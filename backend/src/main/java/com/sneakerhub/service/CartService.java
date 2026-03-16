package com.sneakerhub.service;

import com.sneakerhub.dto.request.AddToCartRequest;
import com.sneakerhub.dto.request.UpdateCartItemRequest;
import com.sneakerhub.dto.response.CartItemResponse;
import com.sneakerhub.dto.response.CartResponse;
import com.sneakerhub.dto.response.SneakerVariantResponse;
import com.sneakerhub.exception.BadRequestException;
import com.sneakerhub.exception.ResourceNotFoundException;
import com.sneakerhub.model.Cart;
import com.sneakerhub.model.CartItem;
import com.sneakerhub.model.SneakerVariant;
import com.sneakerhub.model.User;
import com.sneakerhub.repository.CartItemRepository;
import com.sneakerhub.repository.CartRepository;
import com.sneakerhub.repository.SneakerVariantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Cart Service - Business logic for shopping cart management
 */
@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private SneakerVariantRepository sneakerVariantRepository;

    /**
     * Get user's cart
     */
    public CartResponse getCart(User user) {
        @SuppressWarnings("null")
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> createCartForUser(user));
        return mapToResponse(cart);
    }

    /**
     * Add item to cart
     */
    @Transactional
    public CartResponse addToCart(User user, AddToCartRequest request) {
        @SuppressWarnings("null")
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> createCartForUser(user));

        @SuppressWarnings("null")
        SneakerVariant variant = sneakerVariantRepository.findById(request.getSneakerVariantId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Sneaker Variant", "id", request.getSneakerVariantId()));

        // Check stock availability
        if (!variant.isInStock()) {
            throw new BadRequestException("Product is out of stock");
        }

        if (variant.getStockQuantity() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock. Available: " + variant.getStockQuantity());
        }

        // Check if item already exists in cart
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getSneakerVariant().getId().equals(variant.getId()))
                .findFirst();

        if (existingItem.isPresent()) {
            // Update quantity
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + request.getQuantity();

            if (variant.getStockQuantity() < newQuantity) {
                throw new BadRequestException("Insufficient stock. Available: " + variant.getStockQuantity());
            }

            item.setQuantity(newQuantity);
            item.updatePrice(variant.getEffectivePrice());
            cartItemRepository.save(item);
        } else {
            // Add new item
            CartItem cartItem = CartItem.builder()
                    .cart(cart)
                    .sneakerVariant(variant)
                    .quantity(request.getQuantity())
                    .price(variant.getEffectivePrice())
                    .build();
            cartItemRepository.save(cartItem);
            cart.addItem(cartItem);
        }

        cartRepository.save(cart);
        return mapToResponse(cart);
    }

    /**
     * Update cart item quantity
     */
    @Transactional
    public CartResponse updateCartItem(User user, Long cartItemId, UpdateCartItemRequest request) {
        @SuppressWarnings("null")
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        @SuppressWarnings("null")
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart Item", "id", cartItemId));

        // Verify cart item belongs to user's cart
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Cart item does not belong to your cart");
        }

        // Check stock
        SneakerVariant variant = cartItem.getSneakerVariant();
        if (variant.getStockQuantity() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock. Available: " + variant.getStockQuantity());
        }

        cartItem.setQuantity(request.getQuantity());
        cartItem.updatePrice(variant.getEffectivePrice());
        cartItemRepository.save(cartItem);

        return mapToResponse(cart);
    }

    /**
     * Remove item from cart
     */
    @Transactional
    public CartResponse removeFromCart(User user, Long cartItemId) {
        @SuppressWarnings("null")
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        @SuppressWarnings("null")
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart Item", "id", cartItemId));

        // Verify cart item belongs to user's cart
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Cart item does not belong to your cart");
        }

        cart.removeItem(cartItem);
        cartItemRepository.delete(cartItem);
        cartRepository.save(cart);

        return mapToResponse(cart);
    }

    /**
     * Clear cart
     */
    @Transactional
    public void clearCart(User user) {
        @SuppressWarnings("null")
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        cart.clearCart();
        cartItemRepository.deleteAll(cart.getItems());
        cartRepository.save(cart);
    }

    /**
     * Create cart for user
     */
    private Cart createCartForUser(User user) {
        Cart cart = Cart.builder()
                .user(user)
                .build();
        return cartRepository.save(cart);
    }

    /**
     * Map Cart to Response
     */
    private CartResponse mapToResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
                .map(this::mapCartItemToResponse)
                .collect(Collectors.toList());

        return CartResponse.builder()
                .id(cart.getId())
                .userId(cart.getUser().getId())
                .items(items)
                .totalItems(cart.getTotalItems())
                .totalPrice(cart.getTotalPrice())
                .createdAt(cart.getCreatedAt())
                .updatedAt(cart.getUpdatedAt())
                .build();
    }

    /**
     * Map CartItem to Response
     */
    private CartItemResponse mapCartItemToResponse(CartItem item) {
        SneakerVariant variant = item.getSneakerVariant();

        SneakerVariantResponse variantResponse = SneakerVariantResponse.builder()
                .id(variant.getId())
                .sneakerId(variant.getSneaker().getId())
                .size(variant.getSize())
                .colorVariant(variant.getColorVariant())
                .stockQuantity(variant.getStockQuantity())
                .price(variant.getPrice())
                .discountPrice(variant.getDiscountPrice())
                .effectivePrice(variant.getEffectivePrice())
                .available(variant.getAvailable())
                .inStock(variant.isInStock())
                .build();

        return CartItemResponse.builder()
                .id(item.getId())
                .cartId(item.getCart().getId())
                .sneakerVariant(variantResponse)
                .sneakerName(variant.getSneaker().getName())
                .sneakerBrand(variant.getSneaker().getBrand())
                .sneakerImage(variant.getVariantImageUrl() != null ? variant.getVariantImageUrl()
                        : variant.getSneaker().getImageUrl())
                .isFeatured(variant.getSneaker().getFeatured())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .subtotal(item.getSubtotal())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }
}
