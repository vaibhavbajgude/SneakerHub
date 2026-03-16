package com.sneakerhub.repository;

import com.sneakerhub.model.SneakerVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for SneakerVariant entity
 */
@Repository
public interface SneakerVariantRepository extends JpaRepository<SneakerVariant, Long> {

    /**
     * Find variants by sneaker ID
     */
    List<SneakerVariant> findBySneakerId(Long sneakerId);

    /**
     * Find available variants by sneaker ID
     */
    List<SneakerVariant> findBySneakerIdAndAvailableTrue(Long sneakerId);

    /**
     * Find variant by sneaker ID and size
     */
    Optional<SneakerVariant> findBySneakerIdAndSize(Long sneakerId, String size);

    /**
     * Find variant by sneaker ID, size, and color
     */
    Optional<SneakerVariant> findBySneakerIdAndSizeAndColorVariant(Long sneakerId, String size, String colorVariant);

    /**
     * Find variants with stock
     */
    @Query("SELECT v FROM SneakerVariant v WHERE v.sneaker.id = :sneakerId AND v.stockQuantity > 0 AND v.available = true")
    List<SneakerVariant> findInStockVariantsBySneakerId(@Param("sneakerId") Long sneakerId);

    /**
     * Check if variant exists
     */
    boolean existsBySneakerIdAndSizeAndColorVariant(Long sneakerId, String size, String colorVariant);

    /**
     * Find by SKU
     */
    Optional<SneakerVariant> findBySku(String sku);

    /**
     * Get all sizes for a sneaker
     */
    @Query("SELECT DISTINCT v.size FROM SneakerVariant v WHERE v.sneaker.id = :sneakerId AND v.available = true ORDER BY v.size")
    List<String> findDistinctSizesBySneakerId(@Param("sneakerId") Long sneakerId);
}
