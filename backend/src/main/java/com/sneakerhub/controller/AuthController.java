package com.sneakerhub.controller;

import com.sneakerhub.dto.request.LoginRequest;
import com.sneakerhub.dto.request.RegisterRequest;
import com.sneakerhub.dto.response.ApiResponse;
import com.sneakerhub.dto.response.AuthResponse;

import com.sneakerhub.dto.response.UserResponse;
import com.sneakerhub.model.User;
import com.sneakerhub.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication Controller - Handles authentication endpoints
 */
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication APIs for login, register, and token management")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Register a new user
     */
    @PostMapping("/register")
    @Operation(summary = "Register new user", description = "Create a new user account")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse authResponse = authService.register(request);
        ApiResponse<AuthResponse> response = ApiResponse.success("User registered successfully", authResponse);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Login user
     */
    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and return JWT tokens")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request);
        ApiResponse<AuthResponse> response = ApiResponse.success("Login successful", authResponse);
        return ResponseEntity.ok(response);
    }

    /**
     * Refresh access token
     */
    @PostMapping("/refresh")
    @Operation(summary = "Refresh token", description = "Generate new access token using refresh token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            @Valid @RequestBody com.sneakerhub.dto.request.TokenRefreshRequest request) {
        AuthResponse authResponse = authService.refreshToken(request.getRefreshToken());
        ApiResponse<AuthResponse> response = ApiResponse.success("Token refreshed successfully", authResponse);
        return ResponseEntity.ok(response);
    }

    /**
     * Get current user profile
     */
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current user", description = "Get authenticated user's profile")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser() {
        User user = authService.getCurrentUser();

        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();

        ApiResponse<UserResponse> response = ApiResponse.success("User retrieved successfully", userResponse);
        return ResponseEntity.ok(response);
    }

    /**
     * Logout (client-side token removal)
     */
    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Logout", description = "Logout user (client should remove tokens)")
    public ResponseEntity<ApiResponse<Void>> logout() {
        // Since we're using stateless JWT, logout is handled client-side by removing
        // tokens
        // This endpoint is just for consistency and can be used for logging/analytics
        ApiResponse<Void> response = ApiResponse.success("Logout successful");
        return ResponseEntity.ok(response);
    }

    /**
     * Health check for auth service
     */
    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check if authentication service is running")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        ApiResponse<String> response = ApiResponse.success("Authentication service is running", "OK");
        return ResponseEntity.ok(response);
    }
}
