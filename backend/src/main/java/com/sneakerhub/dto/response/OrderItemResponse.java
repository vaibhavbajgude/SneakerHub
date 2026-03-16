package com.sneakerhub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Order Item Response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponse {

    private Long id;
    private Long orderId;
    private Long sneakerVariantId;
    private String sneakerName;
    private String sneakerBrand;
    private String size;
    private String colorVariant;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal discount;
    private BigDecimal subtotal;
    private String imageUrl;
    private LocalDateTime createdAt;
}
