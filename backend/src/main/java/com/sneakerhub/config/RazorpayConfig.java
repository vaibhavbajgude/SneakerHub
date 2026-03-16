package com.sneakerhub.config;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Razorpay Configuration
 */
@Configuration
public class RazorpayConfig {

    @Value("${razorpay.key-id}")
    private String keyId;

    @Value("${razorpay.key-secret}")
    private String keySecret;

    /**
     * Razorpay Client Bean
     */
    @Bean
    public RazorpayClient razorpayClient() throws RazorpayException {
        return new RazorpayClient(keyId, keySecret);
    }

    /**
     * Get Razorpay Key ID for frontend
     */
    public String getKeyId() {
        return keyId;
    }

    /**
     * Get Razorpay Key Secret for signature verification
     */
    public String getKeySecret() {
        return keySecret;
    }
}
