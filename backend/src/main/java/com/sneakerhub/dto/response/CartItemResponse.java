package com.sneakerhub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Cart Item Response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemResponse {

    private Long id;
    private Long cartId;
    private SneakerVariantResponse sneakerVariant;
    private String sneakerName;
    private String sneakerBrand;
    private String sneakerImage;
    private Boolean isFeatured;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal subtotal;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
