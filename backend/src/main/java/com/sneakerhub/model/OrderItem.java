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
 * OrderItem Entity - Represents an item in an order
 */
@Entity
@Table(name = "order_items")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sneaker_variant_id", nullable = false)
    private SneakerVariant sneakerVariant;

    // Snapshot of product details at time of order
    @Column(nullable = false)
    private String sneakerName;

    @Column(nullable = false)
    private String sneakerBrand;

    @Column(nullable = false)
    private String size;

    private String colorVariant;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private BigDecimal price; // Price per unit at time of order

    private BigDecimal discount;

    @Column(length = 1000)
    private String imageUrl;

    // Auditing fields
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // Helper methods
    public BigDecimal getSubtotal() {
        BigDecimal itemTotal = price.multiply(BigDecimal.valueOf(quantity));
        if (discount != null) {
            itemTotal = itemTotal.subtract(discount);
        }
        return itemTotal;
    }

    public BigDecimal getDiscountAmount() {
        return discount != null ? discount : BigDecimal.ZERO;
    }
}
