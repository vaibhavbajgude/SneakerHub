package com.sneakerhub.repository;

import com.sneakerhub.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for OrderItem entity
 */
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    /**
     * Find order items by order ID
     */
    List<OrderItem> findByOrderId(Long orderId);

    /**
     * Find order items by sneaker variant ID
     */
    List<OrderItem> findBySneakerVariantId(Long variantId);
}
