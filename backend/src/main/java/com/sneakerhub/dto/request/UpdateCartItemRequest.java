package com.sneakerhub.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Update Cart Item Request DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateCartItemRequest {

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private Integer quantity;
}
