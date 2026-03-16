package com.sneakerhub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Payment Entity - Represents a payment transaction
 */
@Entity
@Table(name = "payments")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @Column(nullable = false, unique = true)
    private String transactionId; // Unique transaction ID

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PaymentMethod paymentMethod = PaymentMethod.RAZORPAY;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(nullable = false)
    private BigDecimal amount;

    @Builder.Default
    private String currency = "INR";

    // Razorpay specific fields
    private String razorpayOrderId;

    private String razorpayPaymentId;

    private String razorpaySignature;

    // Payment gateway response
    @Column(length = 2000)
    private String gatewayResponse;

    // Additional payment details
    private String cardLast4; // Last 4 digits of card (if applicable)

    private String cardBrand; // Visa, Mastercard, etc.

    private String upiId; // UPI ID if payment via UPI

    private String bankName; // Bank name for net banking

    // Refund details
    private String refundId;

    private BigDecimal refundAmount;

    private LocalDateTime refundedAt;

    @Column(length = 500)
    private String refundReason;

    // Timestamps
    private LocalDateTime paidAt;

    private LocalDateTime failedAt;

    @Column(length = 500)
    private String failureReason;

    // Auditing fields
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // Helper methods
    public void markAsCompleted(String razorpayPaymentId, String razorpaySignature) {
        this.status = PaymentStatus.COMPLETED;
        this.razorpayPaymentId = razorpayPaymentId;
        this.razorpaySignature = razorpaySignature;
        this.paidAt = LocalDateTime.now();
    }

    public void markAsFailed(@org.springframework.lang.Nullable String reason) {
        this.status = PaymentStatus.FAILED;
        this.failureReason = reason;
        this.failedAt = LocalDateTime.now();
    }

    public void markAsRefunded(String refundId, BigDecimal refundAmount,
            @org.springframework.lang.Nullable String reason) {
        this.status = PaymentStatus.REFUNDED;
        this.refundId = refundId;
        this.refundAmount = refundAmount;
        this.refundReason = reason;
        this.refundedAt = LocalDateTime.now();
    }

    public boolean isSuccessful() {
        return status == PaymentStatus.COMPLETED;
    }

    public boolean canBeRefunded() {
        return status == PaymentStatus.COMPLETED && refundId == null;
    }
}
