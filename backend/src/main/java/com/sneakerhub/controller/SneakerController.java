package com.sneakerhub.controller;

import com.sneakerhub.dto.request.SneakerRequest;
import com.sneakerhub.dto.request.SneakerVariantRequest;
import com.sneakerhub.dto.response.ApiResponse;
import com.sneakerhub.dto.response.SneakerResponse;
import com.sneakerhub.dto.response.SneakerVariantResponse;
import com.sneakerhub.service.SneakerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Sneaker Controller - REST APIs for sneaker management
 */
@RestController
@RequestMapping({ "/api/sneakers", "/api/products" })
@Tag(name = "Sneakers", description = "Sneaker management APIs")
public class SneakerController {

    @Autowired
    private SneakerService sneakerService;

    /**
     * Create new sneaker (OWNER/ADMIN only)
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    @Operation(summary = "Create sneaker", description = "Create a new sneaker product")
    public ResponseEntity<ApiResponse<SneakerResponse>> createSneaker(@Valid @RequestBody SneakerRequest request) {
        SneakerResponse sneaker = sneakerService.createSneaker(request);
        ApiResponse<SneakerResponse> response = ApiResponse.success("Sneaker created successfully", sneaker);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Update sneaker (OWNER/ADMIN only)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    @Operation(summary = "Update sneaker", description = "Update existing sneaker")
    public ResponseEntity<ApiResponse<SneakerResponse>> updateSneaker(
            @PathVariable Long id,
            @Valid @RequestBody SneakerRequest request) {
        SneakerResponse sneaker = sneakerService.updateSneaker(id, request);
        ApiResponse<SneakerResponse> response = ApiResponse.success("Sneaker updated successfully", sneaker);
        return ResponseEntity.ok(response);
    }

    /**
     * Get sneaker by ID (Public)
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get sneaker", description = "Get sneaker details by ID")
    public ResponseEntity<ApiResponse<SneakerResponse>> getSneakerById(@PathVariable Long id) {
        SneakerResponse sneaker = sneakerService.getSneakerById(id);
        ApiResponse<SneakerResponse> response = ApiResponse.success("Sneaker retrieved successfully", sneaker);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Get all sneakers", description = "Get all sneakers with pagination and filters")
    public ResponseEntity<ApiResponse<Page<SneakerResponse>>> getAllSneakers(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) java.math.BigDecimal minPrice,
            @RequestParam(required = false) java.math.BigDecimal maxPrice,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<SneakerResponse> sneakers = sneakerService.getFilteredSneakers(
                brand, category, gender, search, minPrice, maxPrice, featured, pageable);
        ApiResponse<Page<SneakerResponse>> response = ApiResponse.success("Sneakers retrieved successfully", sneakers);
        return ResponseEntity.ok(response);
    }

    /**
     * Search sneakers (Public)
     */
    @GetMapping("/search")
    @Operation(summary = "Search sneakers", description = "Search sneakers by keyword")
    public ResponseEntity<ApiResponse<Page<SneakerResponse>>> searchSneakers(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<SneakerResponse> sneakers = sneakerService.searchSneakers(keyword, pageable);
        ApiResponse<Page<SneakerResponse>> response = ApiResponse.success("Search results", sneakers);
        return ResponseEntity.ok(response);
    }

    /**
     * Get sneakers by brand (Public)
     */
    @GetMapping("/brand/{brand}")
    @Operation(summary = "Get sneakers by brand", description = "Filter sneakers by brand")
    public ResponseEntity<ApiResponse<Page<SneakerResponse>>> getSneakersByBrand(
            @PathVariable String brand,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<SneakerResponse> sneakers = sneakerService.getSneakersByBrand(brand, pageable);
        ApiResponse<Page<SneakerResponse>> response = ApiResponse.success("Sneakers retrieved successfully", sneakers);
        return ResponseEntity.ok(response);
    }

    /**
     * Get sneakers by category (Public)
     */
    @GetMapping("/category/{category}")
    @Operation(summary = "Get sneakers by category", description = "Filter sneakers by category")
    public ResponseEntity<ApiResponse<Page<SneakerResponse>>> getSneakersByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<SneakerResponse> sneakers = sneakerService.getSneakersByCategory(category, pageable);
        ApiResponse<Page<SneakerResponse>> response = ApiResponse.success("Sneakers retrieved successfully", sneakers);
        return ResponseEntity.ok(response);
    }

    /**
     * Get featured sneakers (Public)
     */
    @GetMapping("/featured")
    @Operation(summary = "Get featured sneakers", description = "Get all featured sneakers")
    public ResponseEntity<ApiResponse<List<SneakerResponse>>> getFeaturedSneakers() {
        List<SneakerResponse> sneakers = sneakerService.getFeaturedSneakers();
        ApiResponse<List<SneakerResponse>> response = ApiResponse.success("Featured sneakers retrieved", sneakers);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all brands (Public)
     */
    @GetMapping("/brands")
    @Operation(summary = "Get all brands", description = "Get list of all brands")
    public ResponseEntity<ApiResponse<List<String>>> getAllBrands() {
        List<String> brands = sneakerService.getAllBrands();
        ApiResponse<List<String>> response = ApiResponse.success("Brands retrieved successfully", brands);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all categories (Public)
     */
    @GetMapping("/categories")
    @Operation(summary = "Get all categories", description = "Get list of all categories")
    public ResponseEntity<ApiResponse<List<String>>> getAllCategories() {
        List<String> categories = sneakerService.getAllCategories();
        ApiResponse<List<String>> response = ApiResponse.success("Categories retrieved successfully", categories);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete sneaker (OWNER/ADMIN only)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    @Operation(summary = "Delete sneaker", description = "Soft delete a sneaker")
    public ResponseEntity<ApiResponse<Void>> deleteSneaker(@PathVariable Long id) {
        sneakerService.deleteSneaker(id);
        ApiResponse<Void> response = ApiResponse.success("Sneaker deleted successfully");
        return ResponseEntity.ok(response);
    }

    // ==================== VARIANT MANAGEMENT ====================

    /**
     * Add variant to sneaker (OWNER/ADMIN only)
     */
    @PostMapping("/{sneakerId}/variants")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    @Operation(summary = "Add variant", description = "Add size variant to sneaker")
    public ResponseEntity<ApiResponse<SneakerVariantResponse>> addVariant(
            @PathVariable Long sneakerId,
            @Valid @RequestBody SneakerVariantRequest request) {
        SneakerVariantResponse variant = sneakerService.addVariant(sneakerId, request);
        ApiResponse<SneakerVariantResponse> response = ApiResponse.success("Variant added successfully", variant);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Update variant (OWNER/ADMIN only)
     */
    @PutMapping("/variants/{variantId}")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    @Operation(summary = "Update variant", description = "Update sneaker variant")
    public ResponseEntity<ApiResponse<SneakerVariantResponse>> updateVariant(
            @PathVariable Long variantId,
            @Valid @RequestBody SneakerVariantRequest request) {
        SneakerVariantResponse variant = sneakerService.updateVariant(variantId, request);
        ApiResponse<SneakerVariantResponse> response = ApiResponse.success("Variant updated successfully", variant);
        return ResponseEntity.ok(response);
    }

    /**
     * Get variants by sneaker ID (Public)
     */
    @GetMapping("/{sneakerId}/variants")
    @Operation(summary = "Get variants", description = "Get all variants for a sneaker")
    public ResponseEntity<ApiResponse<List<SneakerVariantResponse>>> getVariants(@PathVariable Long sneakerId) {
        List<SneakerVariantResponse> variants = sneakerService.getVariantsBySneakerId(sneakerId);
        ApiResponse<List<SneakerVariantResponse>> response = ApiResponse.success("Variants retrieved successfully",
                variants);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete variant (OWNER/ADMIN only)
     */
    @DeleteMapping("/variants/{variantId}")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    @Operation(summary = "Delete variant", description = "Soft delete a variant")
    public ResponseEntity<ApiResponse<Void>> deleteVariant(@PathVariable Long variantId) {
        sneakerService.deleteVariant(variantId);
        ApiResponse<Void> response = ApiResponse.success("Variant deleted successfully");
        return ResponseEntity.ok(response);
    }
}
