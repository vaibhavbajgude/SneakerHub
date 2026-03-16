package com.sneakerhub.model;

/**
 * PaymentMethod Enum - Payment methods supported
 */
public enum PaymentMethod {
    RAZORPAY, // Razorpay payment gateway
    CARD, // Credit/Debit card
    UPI, // UPI payment
    NET_BANKING, // Net banking
    WALLET, // Digital wallet
    COD // Cash on delivery
}
