package com.sneakerhub.service;

import com.sneakerhub.dto.request.LoginRequest;
import com.sneakerhub.dto.request.RegisterRequest;
import com.sneakerhub.dto.response.AuthResponse;
import com.sneakerhub.exception.BadRequestException;
import com.sneakerhub.model.Cart;
import com.sneakerhub.model.Role;
import com.sneakerhub.model.User;
import com.sneakerhub.repository.CartRepository;
import com.sneakerhub.repository.UserRepository;
import com.sneakerhub.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Authentication Service - Handles user registration and login
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    /**
     * Register a new user
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        // Create new user
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .role(request.getRole() != null ? request.getRole() : Role.USER)
                .provider(User.AuthProvider.LOCAL)
                .enabled(true)
                .accountNonExpired(true)
                .accountNonLocked(true)
                .credentialsNonExpired(true)
                .build();

        User savedUser = userRepository.save(user);

        // Create cart for user
        cartRepository.save(Cart.builder()
                .user(savedUser)
                .build());

        // Generate tokens
        String accessToken = tokenProvider.generateTokenFromUsername(savedUser.getEmail());
        String refreshToken = tokenProvider.generateRefreshToken(savedUser.getEmail());

        return new AuthResponse(
                accessToken,
                refreshToken,
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getRole());
    }

    /**
     * Login user
     */
    public AuthResponse login(LoginRequest request) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Get user details
        User user = (User) authentication.getPrincipal();

        // Generate tokens
        String accessToken = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(user.getEmail());

        return new AuthResponse(
                accessToken,
                refreshToken,
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole());
    }

    /**
     * Refresh access token
     */
    public AuthResponse refreshToken(String refreshToken) {
        // Validate refresh token
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new BadRequestException("Invalid refresh token");
        }

        // Get username from token
        String username = tokenProvider.getUsernameFromToken(refreshToken);

        // Get user
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new BadRequestException("User not found"));

        // Generate new tokens
        String newAccessToken = tokenProvider.generateTokenFromUsername(username);
        String newRefreshToken = tokenProvider.generateRefreshToken(username);

        return new AuthResponse(
                newAccessToken,
                newRefreshToken,
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole());
    }

    /**
     * Get current authenticated user
     */
    @SuppressWarnings("null")
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadRequestException("No authenticated user found");
        }

        User currentUser = (User) authentication.getPrincipal();
        return currentUser;
    }
}
