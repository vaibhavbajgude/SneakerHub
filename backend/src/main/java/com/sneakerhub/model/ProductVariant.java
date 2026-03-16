package com.sneakerhub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * ProductVariant Entity - Represents size and color variants of a product
 * Each variant has its own stock and optional price adjustment
 */
@Entity
@Table(name = "product_variants", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "product_id", "size", "color" }),
        @UniqueConstraint(columnNames = "sku")
}, indexes = {
        @Index(name = "idx_variant_product", columnList = "product_id"),
        @Index(name = "idx_variant_sku", columnList = "sku")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false, length = 10)
    private String size; // e.g., "7", "8", "9", "10", "11", "12"

    @Column(nullable = false, length = 50)
    private String color; // e.g., "Black", "White", "Red", "Blue"

    @Column(nullable = false)
    @Builder.Default
    private Integer stock = 0;

    @Column(unique = true, nullable = false, length = 50)
    private String sku; // Stock Keeping Unit - unique identifier

    @Column(precision = 10, scale = 2)
    private BigDecimal additionalPrice; // Extra price for this variant (optional)

    // Helper methods
    public boolean isInStock() {
        return stock > 0;
    }

    public BigDecimal getEffectivePrice() {
        BigDecimal basePrice = product.getEffectivePrice();
        if (additionalPrice != null) {
            return basePrice.add(additionalPrice);
        }
        return basePrice;
    }

    @PrePersist
    @PreUpdate
    private void generateSku() {
        if (sku == null || sku.isEmpty()) {
            // Generate SKU: PRODUCT_ID-SIZE-COLOR
            sku = String.format("SNK-%d-%s-%s",
                    product.getId(),
                    size.replace(" ", ""),
                    color.replace(" ", "").substring(0, Math.min(3, color.length())).toUpperCase());
        }
    }
}
