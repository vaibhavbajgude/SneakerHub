package com.sneakerhub.repository;

import com.sneakerhub.model.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for ProductVariant entity
 */
@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    /**
     * Find all variants for a product
     */
    List<ProductVariant> findByProductId(Long productId);

    /**
     * Find variant by product, size, and color
     */
    Optional<ProductVariant> findByProductIdAndSizeAndColor(Long productId, String size, String color);

    /**
     * Find variant by SKU
     */
    Optional<ProductVariant> findBySku(String sku);

    /**
     * Check if SKU exists
     */
    boolean existsBySku(String sku);

    /**
     * Find all in-stock variants for a product
     */
    @Query("SELECT v FROM ProductVariant v WHERE v.product.id = :productId AND v.stock > 0")
    List<ProductVariant> findInStockVariantsByProductId(Long productId);

    /**
     * Get all available sizes for a product
     */
    @Query("SELECT DISTINCT v.size FROM ProductVariant v WHERE v.product.id = :productId AND v.stock > 0 ORDER BY v.size")
    List<String> findAvailableSizesByProductId(Long productId);

    /**
     * Get all available colors for a product
     */
    @Query("SELECT DISTINCT v.color FROM ProductVariant v WHERE v.product.id = :productId AND v.stock > 0 ORDER BY v.color")
    List<String> findAvailableColorsByProductId(Long productId);

    /**
     * Delete all variants for a product
     */
    void deleteByProductId(Long productId);
}
