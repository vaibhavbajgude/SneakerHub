package com.sneakerhub.controller;

import com.sneakerhub.dto.request.AddToCartRequest;
import com.sneakerhub.dto.request.UpdateCartItemRequest;
import com.sneakerhub.dto.response.ApiResponse;
import com.sneakerhub.dto.response.CartResponse;
import com.sneakerhub.model.User;
import com.sneakerhub.service.AuthService;
import com.sneakerhub.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Cart Controller - REST APIs for shopping cart management
 */
@RestController
@RequestMapping("/api/cart")
@PreAuthorize("hasAnyRole('USER', 'OWNER', 'ADMIN')")
@Tag(name = "Cart", description = "Shopping cart management APIs")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private AuthService authService;

    /**
     * Get user's cart
     */
    @GetMapping
    @Operation(summary = "Get cart", description = "Get current user's shopping cart")
    public ResponseEntity<ApiResponse<CartResponse>> getCart() {
        User user = authService.getCurrentUser();
        CartResponse cart = cartService.getCart(user);
        ApiResponse<CartResponse> response = ApiResponse.success("Cart retrieved successfully", cart);
        return ResponseEntity.ok(response);
    }

    /**
     * Add item to cart
     */
    @PostMapping("/add")
    @Operation(summary = "Add to cart", description = "Add item to shopping cart")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(@Valid @RequestBody AddToCartRequest request) {
        User user = authService.getCurrentUser();
        CartResponse cart = cartService.addToCart(user, request);
        ApiResponse<CartResponse> response = ApiResponse.success("Item added to cart", cart);
        return ResponseEntity.ok(response);
    }

    /**
     * Update cart item quantity
     */
    @PutMapping("/update/{itemId}")
    @Operation(summary = "Update cart item", description = "Update cart item quantity")
    public ResponseEntity<ApiResponse<CartResponse>> updateCartItem(
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        User user = authService.getCurrentUser();
        CartResponse cart = cartService.updateCartItem(user, itemId, request);
        ApiResponse<CartResponse> response = ApiResponse.success("Cart item updated", cart);
        return ResponseEntity.ok(response);
    }

    /**
     * Remove item from cart
     */
    @DeleteMapping("/remove/{itemId}")
    @Operation(summary = "Remove from cart", description = "Remove item from cart")
    public ResponseEntity<ApiResponse<CartResponse>> removeFromCart(@PathVariable Long itemId) {
        User user = authService.getCurrentUser();
        CartResponse cart = cartService.removeFromCart(user, itemId);
        ApiResponse<CartResponse> response = ApiResponse.success("Item removed from cart", cart);
        return ResponseEntity.ok(response);
    }

    /**
     * Clear cart
     */
    @DeleteMapping
    @Operation(summary = "Clear cart", description = "Remove all items from cart")
    public ResponseEntity<ApiResponse<Void>> clearCart() {
        User user = authService.getCurrentUser();
        cartService.clearCart(user);
        ApiResponse<Void> response = ApiResponse.success("Cart cleared successfully");
        return ResponseEntity.ok(response);
    }
}
