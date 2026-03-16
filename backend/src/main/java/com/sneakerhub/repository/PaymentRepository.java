package com.sneakerhub.repository;

import com.sneakerhub.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Payment entity
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    /**
     * Find payment by order ID
     */
    Optional<Payment> findByOrderId(Long orderId);

    /**
     * Find payment by Razorpay order ID
     */
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);

    /**
     * Find payment by Razorpay payment ID
     */
    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);

    /**
     * Check if payment exists for order
     */
    boolean existsByOrderId(Long orderId);

    /**
     * Check if Razorpay order ID exists
     */
    boolean existsByRazorpayOrderId(String razorpayOrderId);

    /**
     * Find payments by status
     */
    java.util.List<Payment> findByStatus(com.sneakerhub.model.PaymentStatus status);
}
