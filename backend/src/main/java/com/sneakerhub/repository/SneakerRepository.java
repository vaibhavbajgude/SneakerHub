package com.sneakerhub.repository;

import com.sneakerhub.model.Sneaker;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Sneaker entity
 */
@Repository
public interface SneakerRepository extends JpaRepository<Sneaker, Long>, JpaSpecificationExecutor<Sneaker> {

    /**
     * Find sneakers by brand
     */
    Page<Sneaker> findByBrand(String brand, Pageable pageable);

    /**
     * Find sneakers by category
     */
    Page<Sneaker> findByCategory(String category, Pageable pageable);

    /**
     * Find active sneakers
     */
    Page<Sneaker> findByActiveTrue(Pageable pageable);

    /**
     * Find featured sneakers
     */
    List<Sneaker> findByFeaturedTrueAndActiveTrue();

    /**
     * Search sneakers by name or brand
     */
    @Query("SELECT s FROM Sneaker s WHERE " +
            "(LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(s.brand) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "s.active = true")
    Page<Sneaker> searchSneakers(@Param("keyword") String keyword, Pageable pageable);

    /**
     * Find sneakers by brand and category
     */
    Page<Sneaker> findByBrandAndCategoryAndActiveTrue(String brand, String category, Pageable pageable);

    /**
     * Get all distinct brands
     */
    @Query("SELECT DISTINCT s.brand FROM Sneaker s WHERE s.active = true ORDER BY s.brand")
    List<String> findAllBrands();

    /**
     * Get all distinct categories
     */
    @Query("SELECT DISTINCT s.category FROM Sneaker s WHERE s.active = true ORDER BY s.category")
    List<String> findAllCategories();

    /**
     * Find sneakers by color
     */
    Page<Sneaker> findByColorAndActiveTrue(String color, Pageable pageable);
}
