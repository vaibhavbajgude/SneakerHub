package com.sneakerhub.controller;

import com.sneakerhub.dto.request.OrderRequest;
import com.sneakerhub.dto.response.ApiResponse;
import com.sneakerhub.dto.response.OrderResponse;
import com.sneakerhub.model.OrderStatus;
import com.sneakerhub.model.User;
import com.sneakerhub.service.AuthService;
import com.sneakerhub.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Order Controller - REST APIs for order management
 */
@RestController
@RequestMapping("/api/orders")
@Tag(name = "Orders", description = "Order management APIs")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private AuthService authService;

    /**
     * Create order from cart
     */
    @PostMapping("/place")
    @PreAuthorize("hasAnyRole('USER', 'OWNER', 'ADMIN')")
    @Operation(summary = "Create order", description = "Create order from cart items")
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(@Valid @RequestBody OrderRequest request) {
        User user = authService.getCurrentUser();
        OrderResponse order = orderService.createOrder(user, request);
        ApiResponse<OrderResponse> response = ApiResponse.success("Order placed successfully", order);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Get order by ID
     */
    @GetMapping("/{orderId}")
    @PreAuthorize("hasAnyRole('USER', 'OWNER', 'ADMIN')")
    @Operation(summary = "Get order", description = "Get order details by ID")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long orderId) {
        User user = authService.getCurrentUser();
        OrderResponse order = orderService.getOrderById(orderId, user);
        ApiResponse<OrderResponse> response = ApiResponse.success("Order retrieved successfully", order);
        return ResponseEntity.ok(response);
    }

    /**
     * Get user's orders
     */
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER', 'OWNER', 'ADMIN')")
    @Operation(summary = "Get my orders", description = "Get current user's orders")
    public ResponseEntity<ApiResponse<Page<OrderResponse>>> getMyOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        User user = authService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderResponse> orders = orderService.getUserOrders(user, pageable);
        ApiResponse<Page<OrderResponse>> response = ApiResponse.success("Orders retrieved successfully", orders);
        return ResponseEntity.ok(response);
    }

    /**
     * Cancel order
     */
    @PutMapping("/{orderId}/cancel")
    @PreAuthorize("hasAnyRole('USER', 'OWNER', 'ADMIN')")
    @Operation(summary = "Cancel order", description = "Cancel an order")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
            @PathVariable Long orderId,
            @RequestParam(required = false) String reason) {

        User user = authService.getCurrentUser();
        OrderResponse order = orderService.cancelOrder(orderId, reason, user);
        ApiResponse<OrderResponse> response = ApiResponse.success("Order cancelled successfully", order);
        return ResponseEntity.ok(response);
    }

    // ==================== ADMIN/OWNER ENDPOINTS ====================

    /**
     * Get all orders with optional filter (Admin/Owner only)
     */
    @GetMapping("/admin/orders")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    @Operation(summary = "Get all orders", description = "Get all orders with optional status filter")
    public ResponseEntity<ApiResponse<Page<OrderResponse>>> getAllOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<OrderResponse> orders;
        if (status != null) {
            orders = orderService.getOrdersByStatus(status, pageable);
        } else {
            orders = orderService.getAllOrders(pageable);
        }
        ApiResponse<Page<OrderResponse>> response = ApiResponse.success("Orders retrieved successfully", orders);
        return ResponseEntity.ok(response);
    }

    /**
     * Update order status (Admin/Owner only)
     */
    @PutMapping("/admin/orders/{orderId}/status")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    @Operation(summary = "Update order status", description = "Update order status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {

        OrderResponse order = orderService.updateOrderStatus(orderId, status);
        ApiResponse<OrderResponse> response = ApiResponse.success("Order status updated", order);
        return ResponseEntity.ok(response);
    }

    /**
     * Mark order as shipped (Admin/Owner only)
     */
    @PutMapping("/admin/{orderId}/ship")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    @Operation(summary = "Mark as shipped", description = "Mark order as shipped with tracking number")
    public ResponseEntity<ApiResponse<OrderResponse>> markAsShipped(
            @PathVariable Long orderId,
            @RequestParam String trackingNumber) {

        OrderResponse order = orderService.markAsShipped(orderId, trackingNumber);
        ApiResponse<OrderResponse> response = ApiResponse.success("Order marked as shipped", order);
        return ResponseEntity.ok(response);
    }

    /**
     * Get order statistics (Admin only)
     */
    @GetMapping("/admin/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get order statistics", description = "Get order statistics dashboard")
    public ResponseEntity<ApiResponse<OrderService.OrderStatistics>> getOrderStatistics() {
        OrderService.OrderStatistics stats = orderService.getOrderStatistics();
        ApiResponse<OrderService.OrderStatistics> response = ApiResponse.success("Statistics retrieved", stats);
        return ResponseEntity.ok(response);
    }

    @Autowired
    private com.sneakerhub.service.InvoiceGeneratorService invoiceService;

    /**
     * Generate Invoice PDF
     */
    @GetMapping("/{orderId}/invoice")
    @PreAuthorize("hasAnyRole('USER', 'OWNER', 'ADMIN')")
    @Operation(summary = "Download Invoice", description = "Generate PDF invoice for an order")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long orderId) {
        User user = authService.getCurrentUser();
        OrderResponse order = orderService.getOrderById(orderId, user);

        if (order.getStatus() != OrderStatus.PAID && order.getStatus() != OrderStatus.DELIVERED) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        byte[] pdfBytes = invoiceService.generateInvoice(order);

        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=invoice-" + orderId + ".pdf")
                .body(pdfBytes);
    }
}
