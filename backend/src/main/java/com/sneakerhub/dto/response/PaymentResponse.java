package com.sneakerhub.dto.response;

import com.sneakerhub.model.PaymentMethod;
import com.sneakerhub.model.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Payment Response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {

    private Long id;
    private Long orderId;
    private String orderNumber;
    private String transactionId;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
    private BigDecimal amount;
    private String currency;

    // Razorpay specific
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;

    // Payment details
    private String cardLast4;
    private String cardBrand;
    private String upiId;
    private String bankName;

    // Timestamps
    private LocalDateTime paidAt;
    private LocalDateTime failedAt;
    private String failureReason;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
