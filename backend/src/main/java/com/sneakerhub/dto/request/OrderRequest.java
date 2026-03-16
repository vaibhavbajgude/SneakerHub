package com.sneakerhub.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Order Request DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequest {

    // Shipping address
    @NotBlank(message = "Shipping name is required")
    private String shippingName;

    @NotBlank(message = "Phone number is required")
    private String shippingPhone;

    @NotBlank(message = "Address line 1 is required")
    private String shippingAddressLine1;

    private String shippingAddressLine2;

    @NotBlank(message = "City is required")
    private String shippingCity;

    @NotBlank(message = "State is required")
    private String shippingState;

    @NotBlank(message = "Postal code is required")
    private String shippingPostalCode;

    @NotBlank(message = "Country is required")
    private String shippingCountry;

    // Optional notes
    private String notes;
}
