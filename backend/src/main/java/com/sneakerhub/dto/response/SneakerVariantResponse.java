package com.sneakerhub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Sneaker Variant Response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SneakerVariantResponse {

    private Long id;
    private Long sneakerId;
    private String size;
    private String colorVariant;
    private Integer stockQuantity;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private BigDecimal effectivePrice;
    private String variantImageUrl;
    private String sku;
    private Boolean available;
    private Boolean inStock;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
