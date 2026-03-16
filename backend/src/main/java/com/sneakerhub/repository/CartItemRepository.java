package com.sneakerhub.repository;

import com.sneakerhub.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for CartItem entity
 */
@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    /**
     * Find cart item by cart ID and sneaker variant ID
     */
    Optional<CartItem> findByCartIdAndSneakerVariantId(Long cartId, Long sneakerVariantId);

    /**
     * Delete all items in a cart
     */
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    void deleteByCartId(Long cartId);
}
