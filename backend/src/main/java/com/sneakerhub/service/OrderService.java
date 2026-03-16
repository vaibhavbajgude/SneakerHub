package com.sneakerhub.service;

import com.sneakerhub.dto.request.OrderRequest;
import com.sneakerhub.dto.response.OrderItemResponse;
import com.sneakerhub.dto.response.OrderResponse;
import com.sneakerhub.exception.BadRequestException;
import com.sneakerhub.exception.ResourceNotFoundException;
import com.sneakerhub.model.*;
import com.sneakerhub.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Order Service - Business logic for order management
 */
@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private SneakerVariantRepository sneakerVariantRepository;

    /**
     * Create order from cart
     */
    @Transactional
    public OrderResponse createOrder(User user, OrderRequest request) {
        // Get user's cart
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Cart is empty"));

        if (cart.isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        // Validate stock for all items
        for (CartItem cartItem : cart.getItems()) {
            SneakerVariant variant = cartItem.getSneakerVariant();
            if (!variant.isInStock() || variant.getStockQuantity() < cartItem.getQuantity()) {
                throw new BadRequestException("Insufficient stock for: " + variant.getSneaker().getName());
            }
        }

        // Calculate totals with proper rounding
        BigDecimal subtotal = cart.getTotalPrice();
        BigDecimal tax = subtotal.multiply(new BigDecimal("0.18")).setScale(2, java.math.RoundingMode.HALF_UP);
        // Align with frontend: free shipping above 2999, else 99
        BigDecimal shippingFee = subtotal.compareTo(new BigDecimal("2999")) >= 0 ? BigDecimal.ZERO
                : new BigDecimal("99.00");
        BigDecimal totalAmount = subtotal.add(tax).add(shippingFee);

        // Create order
        Order order = Order.builder()
                .user(user)
                .orderNumber(generateOrderNumber())
                .status(OrderStatus.CREATED)
                .subtotal(subtotal)
                .tax(tax)
                .shippingFee(shippingFee)
                .discount(BigDecimal.ZERO)
                .totalAmount(totalAmount)
                .shippingName(request.getShippingName())
                .shippingPhone(request.getShippingPhone())
                .shippingAddressLine1(request.getShippingAddressLine1())
                .shippingAddressLine2(request.getShippingAddressLine2())
                .shippingCity(request.getShippingCity())
                .shippingState(request.getShippingState())
                .shippingPostalCode(request.getShippingPostalCode())
                .shippingCountry(request.getShippingCountry())
                .notes(request.getNotes())
                .build();

        Order savedOrder = orderRepository.save(order);

        // Create order items from cart items
        for (CartItem cartItem : cart.getItems()) {
            SneakerVariant variant = cartItem.getSneakerVariant();

            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .sneakerVariant(variant)
                    .sneakerName(variant.getSneaker().getName())
                    .sneakerBrand(variant.getSneaker().getBrand())
                    .size(variant.getSize())
                    .colorVariant(variant.getColorVariant())
                    .quantity(cartItem.getQuantity())
                    .price(cartItem.getPrice())
                    .discount(BigDecimal.ZERO)
                    .imageUrl(variant.getVariantImageUrl() != null ? variant.getVariantImageUrl()
                            : variant.getSneaker().getImageUrl())
                    .build();

            orderItemRepository.save(orderItem);
            savedOrder.addOrderItem(orderItem);

            // Reduce stock
            variant.decreaseStock(cartItem.getQuantity());
            sneakerVariantRepository.save(variant);
        }

        // Clear cart
        cartItemRepository.deleteByCartId(cart.getId());
        cart.getItems().clear();
        cartRepository.save(cart);

        return mapToResponse(savedOrder);
    }

    /**
     * Get order by ID
     */
    public OrderResponse getOrderById(Long orderId, User user) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        // Verify order belongs to user (unless admin)
        Long userId = user.getId();
        Long orderUserId = order.getUser().getId();
        if (userId == null || orderUserId == null
                || (!orderUserId.equals(userId) && !user.getRole().equals(Role.ADMIN))) {
            throw new BadRequestException("You don't have permission to view this order");
        }

        return mapToResponse(order);
    }

    /**
     * Get user's orders
     */
    public Page<OrderResponse> getUserOrders(User user, Pageable pageable) {
        Long userId = user.getId();
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::mapToResponse);
    }

    /**
     * Get all orders (Admin only)
     */
    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        return orderRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::mapToResponse);
    }

    /**
     * Get orders by status (Admin only)
     */
    public Page<OrderResponse> getOrdersByStatus(OrderStatus status, Pageable pageable) {
        return orderRepository.findByStatusOrderByCreatedAtDesc(status, pageable)
                .map(this::mapToResponse);
    }

    @Autowired
    private EmailService emailService;

    // ... existing fields ...

    /**
     * Update order status (Admin/Owner only)
     */
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (!isValidTransition(order.getStatus(), newStatus)) {
            throw new BadRequestException("Invalid status transition from " + order.getStatus() + " to " + newStatus);
        }

        order.setStatus(newStatus);

        if (newStatus == OrderStatus.SHIPPED && order.getShippedAt() == null) {
            order.setShippedAt(LocalDateTime.now());
        } else if (newStatus == OrderStatus.DELIVERED && order.getDeliveredAt() == null) {
            order.setDeliveredAt(LocalDateTime.now());
            emailService.sendOrderDeliveredEmail(order);
        } else if (newStatus == OrderStatus.PAID) {
            emailService.sendOrderConfirmationEmail(order);
        } else if (newStatus == OrderStatus.CANCELLED && order.getCancelledAt() == null) {
            order.setCancelledAt(LocalDateTime.now());
            // Restore stock
            restoreStock(order);
        }

        Order updatedOrder = orderRepository.save(order);
        return mapToResponse(updatedOrder);
    }

    @Transactional
    public OrderResponse markAsShipped(Long orderId, String trackingNumber) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        order.markAsShipped(trackingNumber);
        Order updatedOrder = orderRepository.save(order);
        return mapToResponse(updatedOrder);
    }

    /**
     * Cancel order
     */
    @Transactional
    public OrderResponse cancelOrder(Long orderId, @org.springframework.lang.Nullable String reason, User user) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        // Verify order belongs to user (unless admin)
        Long userId = user.getId();
        Long orderUserId = order.getUser().getId();
        if (userId == null || orderUserId == null
                || (!orderUserId.equals(userId) && !user.getRole().equals(Role.ADMIN))) {
            throw new BadRequestException("You don't have permission to cancel this order");
        }

        if (!order.canBeCancelled()) {
            throw new BadRequestException("Order cannot be cancelled in current status");
        }

        order.markAsCancelled(reason);
        restoreStock(order);

        Order updatedOrder = orderRepository.save(order);
        return mapToResponse(updatedOrder);
    }

    /**
     * Get order statistics (Admin only)
     */
    public OrderStatistics getOrderStatistics() {
        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.countByStatus(OrderStatus.CREATED);
        long shippedOrders = orderRepository.countByStatus(OrderStatus.SHIPPED);
        long deliveredOrders = orderRepository.countByStatus(OrderStatus.DELIVERED);
        long cancelledOrders = orderRepository.countByStatus(OrderStatus.CANCELLED);

        BigDecimal totalRevenue = orderRepository.findAll().stream()
                .filter(order -> order.getStatus() == OrderStatus.DELIVERED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new OrderStatistics(
                totalOrders,
                pendingOrders,
                shippedOrders,
                deliveredOrders,
                cancelledOrders,
                totalRevenue);
    }

    /**
     * Restore stock when order is cancelled
     */
    private void restoreStock(Order order) {
        for (OrderItem item : order.getOrderItems()) {
            SneakerVariant variant = item.getSneakerVariant();
            variant.increaseStock(item.getQuantity());
            sneakerVariantRepository.save(variant);
        }
    }

    /**
     * Generate unique order number
     */
    private String generateOrderNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String random = String.format("%04d", (int) (Math.random() * 10000));
        return "ORD-" + timestamp + "-" + random;
    }

    /**
     * Map Order to Response
     */
    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> items = order.getOrderItems().stream()
                .map(this::mapOrderItemToResponse)
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .userId(order.getUser().getId())
                .userEmail(order.getUser().getEmail())
                .status(order.getStatus())
                .items(items)
                .subtotal(order.getSubtotal())
                .tax(order.getTax())
                .shippingFee(order.getShippingFee())
                .discount(order.getDiscount())
                .totalAmount(order.getTotalAmount())
                .shippingName(order.getShippingName())
                .shippingPhone(order.getShippingPhone())
                .shippingAddressLine1(order.getShippingAddressLine1())
                .shippingAddressLine2(order.getShippingAddressLine2())
                .shippingCity(order.getShippingCity())
                .shippingState(order.getShippingState())
                .shippingPostalCode(order.getShippingPostalCode())
                .shippingCountry(order.getShippingCountry())
                .trackingNumber(order.getTrackingNumber())
                .notes(order.getNotes())
                .shippedAt(order.getShippedAt())
                .deliveredAt(order.getDeliveredAt())
                .cancelledAt(order.getCancelledAt())
                .cancellationReason(order.getCancellationReason())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    /**
     * Map OrderItem to Response
     */
    private OrderItemResponse mapOrderItemToResponse(OrderItem item) {
        return OrderItemResponse.builder()
                .id(item.getId())
                .orderId(item.getOrder().getId())
                .sneakerVariantId(item.getSneakerVariant().getId())
                .sneakerName(item.getSneakerName())
                .sneakerBrand(item.getSneakerBrand())
                .size(item.getSize())
                .colorVariant(item.getColorVariant())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .discount(item.getDiscount())
                .subtotal(item.getSubtotal())
                .imageUrl(item.getImageUrl())
                .createdAt(item.getCreatedAt())
                .build();
    }

    private boolean isValidTransition(OrderStatus currentStatus, OrderStatus newStatus) {
        if (currentStatus == newStatus)
            return true;
        if (currentStatus == OrderStatus.CANCELLED || currentStatus == OrderStatus.DELIVERED
                || currentStatus == OrderStatus.RETURNED || currentStatus == OrderStatus.FAILED) {
            return false; // Terminal states
        }

        switch (currentStatus) {
            case CREATED:
                return newStatus == OrderStatus.PAID || newStatus == OrderStatus.CANCELLED;
            case PAID:
                return newStatus == OrderStatus.SHIPPED || newStatus == OrderStatus.PROCESSING
                        || newStatus == OrderStatus.CANCELLED;
            case PROCESSING:
                return newStatus == OrderStatus.SHIPPED || newStatus == OrderStatus.CANCELLED;
            case SHIPPED:
                return newStatus == OrderStatus.DELIVERED || newStatus == OrderStatus.RETURNED;
            default:
                return false;
        }
    }

    /**
     * Order Statistics Inner Class
     */
    @lombok.Data
    @lombok.AllArgsConstructor
    public static class OrderStatistics {
        private long totalOrders;
        private long pendingOrders;
        private long shippedOrders;
        private long deliveredOrders;
        private long cancelledOrders;
        private BigDecimal totalRevenue;
    }
}
