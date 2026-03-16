import React, { createContext, useContext, useState, useEffect } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadCart = async () => {
        if (!isAuthenticated) {
            setCart(null);
            return;
        }

        try {
            setLoading(true);
            const response = await cartService.getCart();
            if (response.success) {
                setCart(response.data);
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, [isAuthenticated]);

    const addToCart = async (variantId, quantity) => {
        try {
            setLoading(true);
            const response = await cartService.addToCart(variantId, quantity);
            if (response.success) {
                setCart(response.data);
                showToast('Added to cart successfully!', 'success');
                return true;
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            showToast(error.response?.data?.message || 'Failed to add to cart', 'error');
        } finally {
            setLoading(false);
        }
        return false;
    };

    const updateQuantity = async (itemId, quantity) => {
        try {
            const response = await cartService.updateCartItem(itemId, quantity);
            if (response.success) {
                setCart(response.data);
                return true;
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            showToast(error.response?.data?.message || 'Failed to update quantity', 'error');
        }
        return false;
    };

    const removeItem = async (itemId) => {
        try {
            const response = await cartService.removeCartItem(itemId);
            if (response.success) {
                setCart(response.data);
                showToast('Item removed from cart', 'info');
                return true;
            }
        } catch (error) {
            console.error('Error removing item:', error);
            showToast('Failed to remove item', 'error');
        }
        return false;
    };

    const clearCart = async () => {
        try {
            await cartService.clearCart();
            setCart({ items: [], totalItems: 0, totalPrice: 0 });
            showToast('Cart cleared', 'info');
            return true;
        } catch (error) {
            console.error('Error clearing cart:', error);
            showToast('Failed to clear cart', 'error');
        }
        return false;
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                addToCart,
                updateQuantity,
                removeItem,
                clearCart,
                refreshCart: loadCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
