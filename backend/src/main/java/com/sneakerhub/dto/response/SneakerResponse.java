package com.sneakerhub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Sneaker Response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SneakerResponse {

    private Long id;
    private String name;
    private String brand;
    private String description;
    private BigDecimal basePrice; // Original field
    private String category;
    private String gender;
    private String color;
    private String material;
    private String imageUrl; // Original field
    private List<String> additionalImages;
    private Boolean active;
    private Boolean featured;
    private List<SneakerVariantResponse> variants;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Convenience fields for frontend compatibility
    public BigDecimal getPrice() {
        return basePrice;
    }

    public List<String> getImages() {
        java.util.List<String> images = new java.util.ArrayList<>();
        if (imageUrl != null) {
            images.add(imageUrl);
        }
        if (additionalImages != null) {
            images.addAll(additionalImages);
        }
        return images;
    }

    public Boolean getIsFeatured() {
        return featured;
    }
}
