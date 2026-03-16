package com.sneakerhub.dto.response;

import com.sneakerhub.model.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Order Response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private Long id;
    private String orderNumber;
    private Long userId;
    private String userEmail;
    private OrderStatus status;
    private List<OrderItemResponse> items;
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal shippingFee;
    @org.springframework.lang.Nullable
    private BigDecimal discount;
    private BigDecimal totalAmount;

    // Shipping details
    private String shippingName;
    private String shippingPhone;
    private String shippingAddressLine1;
    @org.springframework.lang.Nullable
    private String shippingAddressLine2;
    private String shippingCity;
    private String shippingState;
    private String shippingPostalCode;
    private String shippingCountry;

    @org.springframework.lang.Nullable
    private String trackingNumber;
    @org.springframework.lang.Nullable
    private String notes;

    @org.springframework.lang.Nullable
    private LocalDateTime shippedAt;
    @org.springframework.lang.Nullable
    private LocalDateTime deliveredAt;
    @org.springframework.lang.Nullable
    private LocalDateTime cancelledAt;
    @org.springframework.lang.Nullable
    private String cancellationReason;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
