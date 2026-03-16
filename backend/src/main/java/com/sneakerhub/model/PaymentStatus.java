package com.sneakerhub.model;

/**
 * PaymentStatus Enum - Represents the status of a payment
 */
public enum PaymentStatus {
    PENDING, // Payment initiated
    PROCESSING, // Payment being processed
    COMPLETED, // Payment successful
    FAILED, // Payment failed
    REFUNDED // Payment refunded
}
