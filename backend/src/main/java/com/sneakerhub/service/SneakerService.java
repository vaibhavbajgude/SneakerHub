package com.sneakerhub.service;

import com.sneakerhub.dto.request.SneakerRequest;
import com.sneakerhub.dto.request.SneakerVariantRequest;
import com.sneakerhub.dto.response.SneakerResponse;
import com.sneakerhub.dto.response.SneakerVariantResponse;
import com.sneakerhub.exception.BadRequestException;
import com.sneakerhub.exception.ResourceNotFoundException;
import com.sneakerhub.model.Sneaker;
import com.sneakerhub.model.SneakerVariant;
import com.sneakerhub.repository.SneakerRepository;
import com.sneakerhub.repository.SneakerVariantRepository;
import com.sneakerhub.repository.specification.SneakerSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Sneaker Service - Business logic for sneaker management
 */
@Service
public class SneakerService {

        @Autowired
        private SneakerRepository sneakerRepository;

        @Autowired
        private SneakerVariantRepository sneakerVariantRepository;

        /**
         * Create new sneaker
         */
        @Transactional
        public SneakerResponse createSneaker(SneakerRequest request) {
                Sneaker sneaker = Sneaker.builder()
                                .name(request.getName())
                                .brand(request.getBrand())
                                .description(request.getDescription())
                                .basePrice(request.getBasePrice())
                                .category(request.getCategory())
                                .gender(request.getGender())
                                .color(request.getColor())
                                .material(request.getMaterial())
                                .imageUrl(request.getImageUrl())
                                .additionalImages(request.getAdditionalImages() != null ? request.getAdditionalImages()
                                                : new java.util.ArrayList<>())
                                .active(request.getActive() != null ? request.getActive() : true)
                                .featured(request.getFeatured() != null ? request.getFeatured() : false)
                                .build();

                @SuppressWarnings("null")
                Sneaker savedSneaker = sneakerRepository.save(sneaker);
                return mapToResponse(savedSneaker);
        }

        /**
         * Update sneaker
         */
        @Transactional
        public SneakerResponse updateSneaker(Long id, SneakerRequest request) {
                Sneaker sneaker = sneakerRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Sneaker", "id", id));

                sneaker.setName(request.getName());
                sneaker.setBrand(request.getBrand());
                sneaker.setDescription(request.getDescription());
                sneaker.setBasePrice(request.getBasePrice());
                sneaker.setCategory(request.getCategory());
                sneaker.setGender(request.getGender());
                sneaker.setColor(request.getColor());
                sneaker.setMaterial(request.getMaterial());
                sneaker.setImageUrl(request.getImageUrl());
                sneaker.setAdditionalImages(
                                request.getAdditionalImages() != null ? request.getAdditionalImages()
                                                : new java.util.ArrayList<>());
                sneaker.setActive(request.getActive() != null ? request.getActive() : true);
                sneaker.setFeatured(request.getFeatured() != null ? request.getFeatured() : false);
                @SuppressWarnings("null")
                Sneaker updatedSneaker = sneakerRepository.save(sneaker);
                return mapToResponse(updatedSneaker);
        }

        /**
         * Get sneaker by ID
         */
        public SneakerResponse getSneakerById(Long id) {
                @SuppressWarnings("null")
                Sneaker sneaker = sneakerRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Sneaker", "id", id));
                return mapToResponse(sneaker);
        }

        /**
         * Get all sneakers (paginated)
         */
        public Page<SneakerResponse> getAllSneakers(Pageable pageable) {
                return sneakerRepository.findByActiveTrue(pageable)
                                .map(this::mapToResponse);
        }

        /**
         * Get filtered sneakers
         */
        public Page<SneakerResponse> getFilteredSneakers(
                        String brand,
                        String category,
                        String gender,
                        String search,
                        BigDecimal minPrice,
                        BigDecimal maxPrice,
                        Boolean featured,
                        Pageable pageable) {

                Specification<Sneaker> spec = SneakerSpecification.filterSneakers(
                                brand, category, gender, search, minPrice, maxPrice, featured);

                @SuppressWarnings("null")
                Page<SneakerResponse> response = sneakerRepository.findAll(spec, pageable)
                                .map(this::mapToResponse);
                return response;
        }

        /**
         * Search sneakers
         */
        public Page<SneakerResponse> searchSneakers(String keyword, Pageable pageable) {
                return sneakerRepository.searchSneakers(keyword, pageable)
                                .map(this::mapToResponse);
        }

        /**
         * Get sneakers by brand
         */
        public Page<SneakerResponse> getSneakersByBrand(String brand, Pageable pageable) {
                return sneakerRepository.findByBrand(brand, pageable)
                                .map(this::mapToResponse);
        }

        /**
         * Get sneakers by category
         */
        public Page<SneakerResponse> getSneakersByCategory(String category, Pageable pageable) {
                return sneakerRepository.findByCategory(category, pageable)
                                .map(this::mapToResponse);
        }

        /**
         * Get featured sneakers
         */
        public List<SneakerResponse> getFeaturedSneakers() {
                @SuppressWarnings("null")
                List<com.sneakerhub.model.Sneaker> sneakers = sneakerRepository.findByFeaturedTrueAndActiveTrue();
                return sneakers.stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        /**
         * Get all brands
         */
        public List<String> getAllBrands() {
                @SuppressWarnings("null")
                List<String> brands = sneakerRepository.findAllBrands();
                return brands;
        }

        /**
         * Get all categories
         */
        public List<String> getAllCategories() {
                @SuppressWarnings("null")
                List<String> categories = sneakerRepository.findAllCategories();
                return categories;
        }

        /**
         * Delete sneaker (soft delete)
         */
        @Transactional
        public void deleteSneaker(Long id) {
                Sneaker sneaker = sneakerRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Sneaker", "id", id));
                sneaker.setActive(false);
                sneakerRepository.save(sneaker);
        }

        /**
         * Add variant to sneaker
         */
        @Transactional
        public SneakerVariantResponse addVariant(Long sneakerId, SneakerVariantRequest request) {
                Sneaker sneaker = sneakerRepository.findById(sneakerId)
                                .orElseThrow(() -> new ResourceNotFoundException("Sneaker", "id", sneakerId));

                // Check if variant already exists
                @SuppressWarnings("null")
                boolean exists = sneakerVariantRepository.existsBySneakerIdAndSizeAndColorVariant(
                                sneakerId, request.getSize(), request.getColorVariant());
                if (exists) {
                        throw new BadRequestException("Variant with this size and color already exists");
                }

                SneakerVariant variant = SneakerVariant.builder()
                                .sneaker(sneaker)
                                .size(request.getSize())
                                .colorVariant(request.getColorVariant())
                                .stockQuantity(request.getStockQuantity())
                                .price(request.getPrice())
                                .discountPrice(request.getDiscountPrice())
                                .variantImageUrl(request.getVariantImageUrl())
                                .sku(request.getSku())
                                .available(request.getAvailable() != null ? request.getAvailable() : true)
                                .build();

                @SuppressWarnings("null")
                SneakerVariant savedVariant = sneakerVariantRepository.save(variant);
                return mapVariantToResponse(savedVariant);
        }

        /**
         * Update variant
         */
        @Transactional
        public SneakerVariantResponse updateVariant(Long variantId, SneakerVariantRequest request) {
                SneakerVariant variant = sneakerVariantRepository.findById(variantId)
                                .orElseThrow(() -> new ResourceNotFoundException("Sneaker Variant", "id", variantId));

                variant.setSize(request.getSize());
                variant.setColorVariant(request.getColorVariant());
                variant.setStockQuantity(request.getStockQuantity());
                variant.setPrice(request.getPrice());
                variant.setDiscountPrice(request.getDiscountPrice());
                variant.setVariantImageUrl(request.getVariantImageUrl());
                variant.setSku(request.getSku());
                variant.setAvailable(request.getAvailable());

                @SuppressWarnings("null")
                SneakerVariant updatedVariant = sneakerVariantRepository.save(variant);
                return mapVariantToResponse(updatedVariant);
        }

        /**
         * Get variants by sneaker ID
         */
        public List<SneakerVariantResponse> getVariantsBySneakerId(Long sneakerId) {
                @SuppressWarnings("null")
                List<com.sneakerhub.model.SneakerVariant> variants = sneakerVariantRepository
                                .findBySneakerId(sneakerId);
                return variants.stream()
                                .map(this::mapVariantToResponse)
                                .collect(Collectors.toList());
        }

        /**
         * Delete variant
         */
        @Transactional
        public void deleteVariant(Long variantId) {
                SneakerVariant variant = sneakerVariantRepository.findById(variantId)
                                .orElseThrow(() -> new ResourceNotFoundException("Sneaker Variant", "id", variantId));
                variant.setAvailable(false);
                sneakerVariantRepository.save(variant);
        }

        /**
         * Map Sneaker to Response
         */
        private SneakerResponse mapToResponse(Sneaker sneaker) {
                @SuppressWarnings("null")
                Long sneakerId = sneaker.getId();
                @SuppressWarnings("null")
                List<SneakerVariantResponse> variants = sneakerVariantRepository
                                .findBySneakerId(sneakerId)
                                .stream()
                                .map(this::mapVariantToResponse)
                                .collect(Collectors.toList());

                return SneakerResponse.builder()
                                .id(sneaker.getId())
                                .name(sneaker.getName())
                                .brand(sneaker.getBrand())
                                .description(sneaker.getDescription())
                                .basePrice(sneaker.getBasePrice())
                                .category(sneaker.getCategory())
                                .gender(sneaker.getGender())
                                .color(sneaker.getColor())
                                .material(sneaker.getMaterial())
                                .imageUrl(sneaker.getImageUrl())
                                .additionalImages(sneaker.getAdditionalImages())
                                .active(sneaker.getActive())
                                .featured(sneaker.getFeatured())
                                .variants(variants)
                                .createdAt(sneaker.getCreatedAt())
                                .updatedAt(sneaker.getUpdatedAt())
                                .build();
        }

        /**
         * Map SneakerVariant to Response
         */
        private SneakerVariantResponse mapVariantToResponse(SneakerVariant variant) {
                return SneakerVariantResponse.builder()
                                .id(variant.getId())
                                .sneakerId(variant.getSneaker().getId())
                                .size(variant.getSize())
                                .colorVariant(variant.getColorVariant())
                                .stockQuantity(variant.getStockQuantity())
                                .price(variant.getPrice())
                                .discountPrice(variant.getDiscountPrice())
                                .effectivePrice(variant.getEffectivePrice())
                                .variantImageUrl(variant.getVariantImageUrl())
                                .sku(variant.getSku())
                                .available(variant.getAvailable())
                                .inStock(variant.isInStock())
                                .createdAt(variant.getCreatedAt())
                                .updatedAt(variant.getUpdatedAt())
                                .build();
        }
}
