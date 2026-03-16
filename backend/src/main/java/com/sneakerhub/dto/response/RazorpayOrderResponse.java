package com.sneakerhub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Razorpay Order Response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RazorpayOrderResponse {

    private String razorpayOrderId;
    private BigDecimal amount;
    private String currency;
    private String keyId;
    private Long orderId;
    private String orderNumber;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
}
