package com.sneakerhub.model;

/**
 * OrderStatus Enum - Represents the status of an order
 */
public enum OrderStatus {
    CREATED, // Order placed, awaiting payment
    PAID, // Payment received and verified
    PROCESSING, // Being prepared for shipping
    SHIPPED, // Handed over to courier
    DELIVERED, // Received by customer
    CANCELLED, // Cancelled by user or admin
    REFUNDED, // Refund processed
    RETURNED, // Returned by customer
    FAILED // Payment or processing failed
}
