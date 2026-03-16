package com.sneakerhub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * SneakerVariant Entity - Represents different variants of a sneaker (size,
 * color combinations)
 */
@Entity
@Table(name = "sneaker_variants", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "sneaker_id", "size", "color_variant" })
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SneakerVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sneaker_id", nullable = false)
    private Sneaker sneaker;

    @Column(nullable = false)
    private String size; // e.g., "8", "9", "10", "10.5"

    private String colorVariant; // e.g., "Black/White", "Red/Blue"

    @Column(nullable = false)
    @Builder.Default
    private Integer stockQuantity = 0;

    @Column(nullable = false)
    private BigDecimal price; // Can be different from base price

    private BigDecimal discountPrice;

    @Column(length = 500)
    private String variantImageUrl;

    private String sku; // Stock Keeping Unit

    @Column(nullable = false)
    @Builder.Default
    private Boolean available = true;

    public Boolean getAvailable() {
        return available;
    }

    // Auditing fields
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // Helper methods
    public boolean isInStock() {
        return available && stockQuantity > 0;
    }

    public void decreaseStock(int quantity) {
        if (stockQuantity >= quantity) {
            stockQuantity -= quantity;
            if (stockQuantity == 0) {
                available = false;
            }
        } else {
            throw new IllegalStateException("Insufficient stock");
        }
    }

    public void increaseStock(int quantity) {
        stockQuantity += quantity;
        if (stockQuantity > 0) {
            available = true;
        }
    }

    public BigDecimal getEffectivePrice() {
        return discountPrice != null ? discountPrice : price;
    }
}
