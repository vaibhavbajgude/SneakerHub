package com.sneakerhub.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Sneaker Variant Request DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SneakerVariantRequest {

    @NotBlank(message = "Size is required")
    private String size;

    private String colorVariant;

    @NotNull(message = "Stock quantity is required")
    @PositiveOrZero(message = "Stock quantity must be zero or positive")
    private Integer stockQuantity;

    @NotNull(message = "Price is required")
    private BigDecimal price;

    private BigDecimal discountPrice;

    private String variantImageUrl;

    private String sku;

    @Builder.Default
    private Boolean available = true;
}
