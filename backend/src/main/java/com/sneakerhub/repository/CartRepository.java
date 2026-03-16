package com.sneakerhub.repository;

import com.sneakerhub.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Cart entity
 */
@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    /**
     * Find cart by user ID
     */
    Optional<Cart> findByUserId(Long userId);

    /**
     * Delete cart by user ID
     */
    void deleteByUserId(Long userId);

    /**
     * Check if cart exists for user
     */
    boolean existsByUserId(Long userId);
}
