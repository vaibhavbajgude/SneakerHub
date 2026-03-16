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
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Product Entity - Represents sneaker products in the catalog
 */
@Entity
@Table(name = "products", indexes = {
        @Index(name = "idx_brand", columnList = "brand"),
        @Index(name = "idx_category", columnList = "category"),
        @Index(name = "idx_owner", columnList = "owner_id")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(precision = 10, scale = 2)
    private BigDecimal discountPrice;

    @Column(nullable = false)
    private String category;

    @ElementCollection
    @CollectionTable(name = "product_sizes", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "size")
    @Builder.Default
    private List<String> sizes = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "product_colors", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "color")
    @Builder.Default
    private List<String> colors = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url", length = 500)
    @Builder.Default
    private List<String> imageUrls = new ArrayList<>();

    @Column(nullable = false)
    @Builder.Default
    private Integer stock = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // Helper methods
    public boolean isInStock() {
        return stock > 0;
    }

    public boolean hasDiscount() {
        return discountPrice != null && discountPrice.compareTo(price) < 0;
    }

    public BigDecimal getEffectivePrice() {
        return hasDiscount() ? discountPrice : price;
    }

    public BigDecimal getDiscountPercentage() {
        if (!hasDiscount()) {
            return BigDecimal.ZERO;
        }
        BigDecimal discount = price.subtract(discountPrice);
        return discount.multiply(BigDecimal.valueOf(100)).divide(price, 2, RoundingMode.HALF_UP);
    }
}
