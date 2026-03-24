package com.sneakerhub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import lombok.ToString;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * CartItem Entity - Represents an item in a shopping cart
 */
@Entity
@Table(name = "cart_items", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "cart_id", "sneaker_variant_id" })
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sneaker_variant_id", nullable = false)
    private SneakerVariant sneakerVariant;

    @Column(nullable = false)
    @Builder.Default
    private Integer quantity = 1;

    @Column(nullable = false)
    private BigDecimal price; // Price at the time of adding to cart

    // Auditing fields
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // Helper methods

    public BigDecimal getSubtotal() {
        BigDecimal basePrice = this.price.multiply(BigDecimal.valueOf(this.quantity));

        // ONLY apply bulk discount if the sneaker is FEATURED
        if (this.sneakerVariant != null &&
                this.sneakerVariant.getSneaker() != null &&
                Boolean.TRUE.equals(this.sneakerVariant.getSneaker().getFeatured())) {

            if (this.quantity >= 5) {
                return basePrice.multiply(BigDecimal.valueOf(0.80)); // 20% discount for 5 or more
            } else if (this.quantity == 4) {
                return basePrice.multiply(BigDecimal.valueOf(0.85)); // 15% discount for 4
            } else if (this.quantity == 3) {
                return basePrice.multiply(BigDecimal.valueOf(0.90)); // 10% discount for 3
            }
        }

        return basePrice; // No discount for non-featured items or qty < 3
    }

    public void increaseQuantity(int amount) {
        this.quantity += amount;
    }

    public void decreaseQuantity(int amount) {
        this.quantity -= amount;
        if (this.quantity < 1) {
            this.quantity = 1;
        }
    }

    public void updatePrice(BigDecimal newPrice) {
        this.price = newPrice;
    }
}
