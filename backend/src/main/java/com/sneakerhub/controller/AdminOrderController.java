package com.sneakerhub.controller;

import com.sneakerhub.dto.response.ApiResponse;
import com.sneakerhub.dto.response.OrderResponse;
import com.sneakerhub.model.OrderStatus;
import com.sneakerhub.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/orders")
@Tag(name = "Admin Orders", description = "Admin Order Management APIs")
public class AdminOrderController {

    @Autowired
    private OrderService orderService;

    /**
     * Get all orders with optional filter
     */
    @GetMapping
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
     * Update order status
     */
    @PutMapping("/{orderId}/status")
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
     * Get order statistics
     */
    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    @Operation(summary = "Get order statistics", description = "Get order statistics")
    public ResponseEntity<ApiResponse<OrderService.OrderStatistics>> getOrderStatistics() {
        OrderService.OrderStatistics stats = orderService.getOrderStatistics();
        return ResponseEntity.ok(ApiResponse.success("Statistics retrieved", stats));
    }
}
