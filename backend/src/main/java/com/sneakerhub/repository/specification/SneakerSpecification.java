package com.sneakerhub.repository.specification;

import com.sneakerhub.model.Sneaker;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class SneakerSpecification {

    public static Specification<Sneaker> filterSneakers(
            String brand,
            String category,
            String gender,
            String search,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Boolean featured) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Only active sneakers
            predicates.add(criteriaBuilder.equal(root.get("active"), true));

            if (brand != null && !brand.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("brand"), brand));
            }

            if (category != null && !category.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("category"), category));
            }

            if (gender != null && !gender.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("gender"), gender));
            }

            if (featured != null) {
                predicates.add(criteriaBuilder.equal(root.get("featured"), featured));
            }

            if (search != null && !search.isEmpty()) {
                String keyword = "%" + search.toLowerCase() + "%";
                Predicate namePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), keyword);
                Predicate brandPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("brand")), keyword);
                predicates.add(criteriaBuilder.or(namePredicate, brandPredicate));
            }

            if (minPrice != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("basePrice"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("basePrice"), maxPrice));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
