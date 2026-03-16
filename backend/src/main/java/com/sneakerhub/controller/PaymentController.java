package com.sneakerhub.controller;

import com.sneakerhub.dto.request.PaymentVerificationRequest;
import com.sneakerhub.dto.response.ApiResponse;
import com.sneakerhub.dto.response.PaymentResponse;
import com.sneakerhub.dto.response.RazorpayOrderResponse;
import com.sneakerhub.model.PaymentStatus;
import com.sneakerhub.model.User;
import com.sneakerhub.service.AuthService;
import com.sneakerhub.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * Payment Controller - REST APIs for payment processing
 */
@RestController
@RequestMapping("/api/payments")
@Tag(name = "Payments", description = "Payment processing APIs with Razorpay integration")
public class PaymentController {

        @Autowired
        private PaymentService paymentService;

        @Autowired
        private AuthService authService;

        /**
         * Create Razorpay order for payment
         */
        @PostMapping("/create-order/{orderId}")
        @PreAuthorize("hasAnyRole('USER', 'OWNER', 'ADMIN')")
        @Operation(summary = "Create payment order", description = "Create Razorpay order for payment processing")
        public ResponseEntity<ApiResponse<RazorpayOrderResponse>> createPaymentOrder(@PathVariable Long orderId) {
                User user = authService.getCurrentUser();
                RazorpayOrderResponse razorpayOrder = paymentService.createRazorpayOrder(orderId, user);
                ApiResponse<RazorpayOrderResponse> response = ApiResponse.success(
                                "Payment order created successfully", razorpayOrder);
                return new ResponseEntity<>(response, HttpStatus.CREATED);
        }

        /**
         * Verify payment after successful payment
         */
        @PostMapping("/verify")
        @PreAuthorize("hasAnyRole('USER', 'OWNER', 'ADMIN')")
        @Operation(summary = "Verify payment", description = "Verify Razorpay payment signature")
        public ResponseEntity<ApiResponse<PaymentResponse>> verifyPayment(
                        @Valid @RequestBody PaymentVerificationRequest request) {
                User user = authService.getCurrentUser();
                PaymentResponse payment = paymentService.verifyPayment(request, user);
                ApiResponse<PaymentResponse> response = ApiResponse.success(
                                "Payment verified successfully", payment);
                return ResponseEntity.ok(response);
        }

        /**
         * Get payment by order ID
         */
        @GetMapping("/order/{orderId}")
        @PreAuthorize("hasAnyRole('USER', 'OWNER', 'ADMIN')")
        @Operation(summary = "Get payment by order", description = "Get payment details for an order")
        public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentByOrderId(@PathVariable Long orderId) {
                User user = authService.getCurrentUser();
                PaymentResponse payment = paymentService.getPaymentByOrderId(orderId, user);
                ApiResponse<PaymentResponse> response = ApiResponse.success(
                                "Payment retrieved successfully", payment);
                return ResponseEntity.ok(response);
        }

        // ==================== ADMIN ENDPOINTS ====================

        /**
         * Get all payments (Admin only)
         */
        @GetMapping("/admin/all")
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(summary = "Get all payments", description = "Get all payment records (Admin only)")
        public ResponseEntity<ApiResponse<List<PaymentResponse>>> getAllPayments() {
                List<PaymentResponse> payments = paymentService.getAllPayments();
                ApiResponse<List<PaymentResponse>> response = ApiResponse.success(
                                "Payments retrieved successfully", payments);
                return ResponseEntity.ok(response);
        }

        /**
         * Get payments by status (Admin only)
         */
        @GetMapping("/admin/status/{status}")
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(summary = "Get payments by status", description = "Filter payments by status (Admin only)")
        public ResponseEntity<ApiResponse<List<PaymentResponse>>> getPaymentsByStatus(
                        @PathVariable PaymentStatus status) {
                List<PaymentResponse> payments = paymentService.getPaymentsByStatus(status);
                ApiResponse<List<PaymentResponse>> response = ApiResponse.success(
                                "Payments retrieved successfully", payments);
                return ResponseEntity.ok(response);
        }

        /**
         * Process refund (Admin only)
         */
        @PostMapping("/admin/{paymentId}/refund")
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(summary = "Process refund", description = "Process payment refund (Admin only)")
        public ResponseEntity<ApiResponse<PaymentResponse>> processRefund(
                        @PathVariable Long paymentId,
                        @RequestParam BigDecimal amount,
                        @RequestParam(required = false) @org.springframework.lang.Nullable String reason) {
                PaymentResponse payment = paymentService.processRefund(paymentId, amount, reason);
                ApiResponse<PaymentResponse> response = ApiResponse.success(
                                "Refund processed successfully", payment);
                return ResponseEntity.ok(response);
        }
}
