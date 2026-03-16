package com.sneakerhub.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Payment Order Request DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentOrderRequest {

    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    @Builder.Default
    private String currency = "INR";
}
