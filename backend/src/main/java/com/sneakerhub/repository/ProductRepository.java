package com.sneakerhub.repository;

import com.sneakerhub.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * Repository interface for Product entity
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * Find all active products
     */
    Page<Product> findByActiveTrue(Pageable pageable);

    /**
     * Find products by brand
     */
    Page<Product> findByBrandAndActiveTrue(String brand, Pageable pageable);

    /**
     * Find products by category
     */
    Page<Product> findByCategoryAndActiveTrue(String category, Pageable pageable);

    /**
     * Find products by owner
     */
    Page<Product> findByOwnerId(Long ownerId, Pageable pageable);

    /**
     * Search products by name or brand
     */
    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
            "(LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.category) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Product> searchProducts(@Param("keyword") String keyword, Pageable pageable);

    /**
     * Find products within price range
     */
    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
            "p.price BETWEEN :minPrice AND :maxPrice")
    Page<Product> findByPriceRange(@Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable);

    /**
     * Find products with discount
     */
    @Query("SELECT p FROM Product p WHERE p.active = true AND p.discountPrice IS NOT NULL")
    Page<Product> findProductsWithDiscount(Pageable pageable);

    /**
     * Find all distinct brands
     */
    @Query("SELECT DISTINCT p.brand FROM Product p WHERE p.active = true ORDER BY p.brand")
    List<String> findAllBrands();

    /**
     * Find all distinct categories
     */
    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.active = true ORDER BY p.category")
    List<String> findAllCategories();
}
