import api from './api';

const cartService = {
    /**
     * Get user's cart
     */
    getCart: async () => {
        const response = await api.get('/cart');
        return response.data;
    },

    /**
     * Add item to cart
     */
    addToCart: async (sneakerVariantId, quantity = 1) => {
        const response = await api.post('/cart/add', {
            sneakerVariantId,
            quantity,
        });
        return response.data;
    },

    /**
     * Update cart item quantity
     */
    updateCartItem: async (cartItemId, quantity) => {
        const response = await api.put(`/cart/update/${cartItemId}`, { quantity });
        return response.data;
    },

    /**
     * Remove item from cart
     */
    removeCartItem: async (cartItemId) => {
        const response = await api.delete(`/cart/remove/${cartItemId}`);
        return response.data;
    },

    /**
     * Clear cart
     */
    clearCart: async () => {
        const response = await api.delete('/cart');
        return response.data;
    },
};

export default cartService;
