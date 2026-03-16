package com.sneakerhub.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * Sneaker Request DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SneakerRequest {

    @NotBlank(message = "Sneaker name is required")
    private String name;

    @NotBlank(message = "Brand is required")
    private String brand;

    private String description;

    @NotNull(message = "Base price is required")
    @Positive(message = "Base price must be positive")
    private BigDecimal basePrice;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Gender is required")
    private String gender;

    private String color;

    private String material;

    private String imageUrl;

    private List<String> additionalImages;

    @Builder.Default
    private Boolean active = true;

    @Builder.Default
    private Boolean featured = false;
}
