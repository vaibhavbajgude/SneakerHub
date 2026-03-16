package com.sneakerhub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Cart Response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponse {

    private Long id;
    private Long userId;
    private List<CartItemResponse> items;
    private Integer totalItems;
    private BigDecimal totalPrice;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
