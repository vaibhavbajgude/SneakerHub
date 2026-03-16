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
import java.util.ArrayList;
import java.util.List;

/**
 * Sneaker Entity - Represents a sneaker product
 */
@Entity
@Table(name = "sneakers")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sneaker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String brand;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private BigDecimal basePrice;

    @Column(nullable = false)
    private String category; // e.g., Running, Basketball, Casual, etc.

    @Column(nullable = false)
    private String gender; // e.g., Men, Women, Unisex

    private String color;

    private String material;

    @Column(length = 1000)
    private String imageUrl;

    @ElementCollection
    @CollectionTable(name = "sneaker_images", joinColumns = @JoinColumn(name = "sneaker_id"))
    @Column(name = "image_url")
    @Builder.Default
    private List<String> additionalImages = new ArrayList<>();

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    @Builder.Default
    private Boolean featured = false;

    public Boolean getActive() {
        return active;
    }

    public Boolean getFeatured() {
        return featured;
    }

    // Relationships
    @OneToMany(mappedBy = "sneaker", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SneakerVariant> variants = new ArrayList<>();

    // Auditing fields
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // Helper methods
    public void addVariant(SneakerVariant variant) {
        variants.add(variant);
        variant.setSneaker(this);
    }

    public void removeVariant(SneakerVariant variant) {
        variants.remove(variant);
        variant.setSneaker(null);
    }
}
