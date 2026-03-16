package com.sneakerhub.repository;

import com.sneakerhub.model.Order;
import com.sneakerhub.model.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Order entity
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    /**
     * Find orders by user ID
     */
    Page<Order> findByUserId(Long userId, Pageable pageable);

    /**
     * Find order by order number
     */
    Optional<Order> findByOrderNumber(String orderNumber);

    /**
     * Find orders by status
     */
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    /**
     * Find orders by user ID and status
     */
    Page<Order> findByUserIdAndStatus(Long userId, OrderStatus status, Pageable pageable);

    /**
     * Find orders by user ID ordered by creation date
     */
    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    /**
     * Find all orders ordered by creation date
     */
    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);

    /**
     * Find orders by status ordered by creation date
     */
    Page<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status, Pageable pageable);

    /**
     * Count orders by status
     */
    long countByStatus(OrderStatus status);
}
