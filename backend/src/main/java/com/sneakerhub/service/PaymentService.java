package com.sneakerhub.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.sneakerhub.config.RazorpayConfig;
import com.sneakerhub.dto.request.PaymentVerificationRequest;
import com.sneakerhub.dto.response.PaymentResponse;
import com.sneakerhub.dto.response.RazorpayOrderResponse;
import com.sneakerhub.exception.BadRequestException;
import com.sneakerhub.exception.ResourceNotFoundException;
import com.sneakerhub.model.*;
import com.sneakerhub.repository.OrderRepository;
import com.sneakerhub.repository.PaymentRepository;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Payment Service - Razorpay integration for payment processing
 */
@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    @Autowired
    private RazorpayClient razorpayClient;

    @Autowired
    private RazorpayConfig razorpayConfig;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private EmailService emailService;

    /**
     * Create Razorpay order
     */
    @Transactional
    @SuppressWarnings("null")
    public RazorpayOrderResponse createRazorpayOrder(Long orderId, User user) {
        // Get order
        @SuppressWarnings("null")
        com.sneakerhub.model.Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        // Verify order belongs to user
        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You don't have permission to pay for this order");
        }

        // Check if order already has a payment
        if (order.getPayment() != null) {
            throw new BadRequestException("Payment already exists for this order");
        }

        // Check order status
        if (!order.getStatus().equals(OrderStatus.CREATED)) {
            throw new BadRequestException("Order is not in created status");
        }

        try {
            // Create Razorpay order
            JSONObject orderRequest = new JSONObject();
            // Convert amount to paise (Razorpay uses smallest currency unit)
            int amountInPaise = order.getTotalAmount().multiply(new BigDecimal("100")).intValue();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", order.getOrderNumber());

            // Add notes
            JSONObject notes = new JSONObject();
            notes.put("order_id", order.getId());
            notes.put("order_number", order.getOrderNumber());
            notes.put("customer_email", user.getEmail());
            orderRequest.put("notes", notes);

            // Create order in Razorpay
            Order razorpayOrder = razorpayClient.orders.create(orderRequest);
            String razorpayOrderId = razorpayOrder.get("id");

            // Create payment record
            Payment payment = Payment.builder()
                    .order(order)
                    .transactionId(generateTransactionId())
                    .paymentMethod(PaymentMethod.RAZORPAY)
                    .status(PaymentStatus.PENDING)
                    .amount(order.getTotalAmount())
                    .currency("INR")
                    .razorpayOrderId(razorpayOrderId)
                    .build();

            Payment savedPayment = paymentRepository.save(payment);
            order.setPayment(savedPayment);
            @SuppressWarnings({ "null", "unused" })
            com.sneakerhub.model.Order savedOrder = orderRepository.save(order);

            logger.info("Razorpay order created: {} for order: {}", razorpayOrderId, order.getOrderNumber());

            // Return response for frontend
            return RazorpayOrderResponse.builder()
                    .razorpayOrderId(razorpayOrderId)
                    .amount(order.getTotalAmount())
                    .currency("INR")
                    .keyId(razorpayConfig.getKeyId())
                    .orderId(order.getId())
                    .orderNumber(order.getOrderNumber())
                    .customerName(user.getFirstName() + " " + user.getLastName())
                    .customerEmail(user.getEmail())
                    .customerPhone(user.getPhoneNumber())
                    .build();

        } catch (RazorpayException e) {
            logger.error("Error creating Razorpay order: {}", e.getMessage());
            throw new BadRequestException("Failed to create payment order: " + e.getMessage());
        }
    }

    /**
     * Verify payment signature
     */
    @Transactional
    @SuppressWarnings("null")
    public PaymentResponse verifyPayment(PaymentVerificationRequest request, User user) {
        // Get order
        @SuppressWarnings("null")
        com.sneakerhub.model.Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", request.getOrderId()));

        // Verify order belongs to user
        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You don't have permission to verify this payment");
        }

        // Get payment
        Payment payment = order.getPayment();
        if (payment == null) {
            throw new BadRequestException("No payment found for this order");
        }

        // Verify Razorpay order ID matches
        if (!payment.getRazorpayOrderId().equals(request.getRazorpayOrderId())) {
            throw new BadRequestException("Invalid Razorpay order ID");
        }

        try {
            // Verify signature
            boolean isValid = verifySignature(
                    request.getRazorpayOrderId(),
                    request.getRazorpayPaymentId(),
                    request.getRazorpaySignature());

            if (isValid) {
                // Mark payment as completed
                payment.markAsCompleted(request.getRazorpayPaymentId(), request.getRazorpaySignature());
                payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
                payment.setRazorpaySignature(request.getRazorpaySignature());

                // Update order status
                order.setStatus(OrderStatus.PAID);

                paymentRepository.save(payment);
                orderRepository.save(order);

                logger.info("Payment verified successfully for order: {}", order.getOrderNumber());

                // Send email notifications (non-blocking, failure does NOT affect payment flow)
                try {
                    emailService.sendUserOrderConfirmationEmail(order.getUser().getEmail(), order);
                    emailService.sendAdminNewOrderNotification(order);
                } catch (Exception emailEx) {
                    logger.error("Email notification failed for order {} — payment flow unaffected: {}",
                            order.getOrderNumber(), emailEx.getMessage());
                }

                return mapToResponse(payment);
            } else {
                // Mark payment as failed
                payment.markAsFailed("Invalid signature");
                paymentRepository.save(payment);

                logger.error("Payment signature verification failed for order: {}", order.getOrderNumber());
                throw new BadRequestException("Payment verification failed: Invalid signature");
            }

        } catch (Exception e) {
            logger.error("Error verifying payment: {}", e.getMessage());
            payment.markAsFailed(e.getMessage());
            paymentRepository.save(payment);
            throw new BadRequestException("Payment verification failed: " + e.getMessage());
        }
    }

    /**
     * Verify Razorpay signature
     */
    private boolean verifySignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", razorpayOrderId);
            options.put("razorpay_payment_id", razorpayPaymentId);
            options.put("razorpay_signature", razorpaySignature);

            return Utils.verifyPaymentSignature(options, razorpayConfig.getKeySecret());
        } catch (RazorpayException e) {
            logger.error("Signature verification error: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Get payment by order ID
     */
    public PaymentResponse getPaymentByOrderId(Long orderId, User user) {
        @SuppressWarnings("null")
        com.sneakerhub.model.Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        // Verify order belongs to user (unless admin)
        if (!order.getUser().getId().equals(user.getId()) && !user.getRole().equals(Role.ADMIN)) {
            throw new BadRequestException("You don't have permission to view this payment");
        }

        Payment payment = order.getPayment();
        if (payment == null) {
            throw new ResourceNotFoundException("Payment not found for order: " + orderId);
        }

        return mapToResponse(payment);
    }

    /**
     * Get all payments (Admin only)
     */
    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get payments by status (Admin only)
     */
    public List<PaymentResponse> getPaymentsByStatus(PaymentStatus status) {
        return paymentRepository.findByStatus(status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Process refund
     */
    @Transactional
    public PaymentResponse processRefund(Long paymentId, BigDecimal refundAmount,
            @org.springframework.lang.Nullable String reason) {
        @SuppressWarnings("null")
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", paymentId));

        if (!payment.canBeRefunded()) {
            throw new BadRequestException("Payment cannot be refunded");
        }

        try {
            // Create refund in Razorpay
            JSONObject refundRequest = new JSONObject();
            int amountInPaise = refundAmount.multiply(new BigDecimal("100")).intValue();
            refundRequest.put("amount", amountInPaise);

            // In real implementation, call Razorpay refund API
            // Refund refund =
            // razorpayClient.payments.refund(payment.getRazorpayPaymentId(),
            // refundRequest);

            // For now, mark as refunded
            String refundId = "rfnd_" + System.currentTimeMillis();
            @SuppressWarnings("null")
            String validReason = reason;
            payment.markAsRefunded(refundId, refundAmount, validReason);

            // Update order status
            payment.getOrder().setStatus(OrderStatus.REFUNDED);

            Payment updatedPayment = paymentRepository.save(payment);
            orderRepository.save(payment.getOrder());

            logger.info("Refund processed for payment: {}", payment.getTransactionId());

            return mapToResponse(updatedPayment);

        } catch (Exception e) {
            logger.error("Error processing refund: {}", e.getMessage());
            throw new BadRequestException("Failed to process refund: " + e.getMessage());
        }
    }

    /**
     * Generate unique transaction ID
     */
    private String generateTransactionId() {
        return "TXN-" + System.currentTimeMillis();
    }

    /**
     * Map Payment to Response
     */
    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrder().getId())
                .orderNumber(payment.getOrder().getOrderNumber())
                .transactionId(payment.getTransactionId())
                .paymentMethod(payment.getPaymentMethod())
                .status(payment.getStatus())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .razorpayOrderId(payment.getRazorpayOrderId())
                .razorpayPaymentId(payment.getRazorpayPaymentId())
                .razorpaySignature(payment.getRazorpaySignature())
                .cardLast4(payment.getCardLast4())
                .cardBrand(payment.getCardBrand())
                .upiId(payment.getUpiId())
                .bankName(payment.getBankName())
                .paidAt(payment.getPaidAt())
                .failedAt(payment.getFailedAt())
                .failureReason(payment.getFailureReason())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}
