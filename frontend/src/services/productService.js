import api from './api';

const productService = {
    /**
     * Get all sneakers with pagination and filters
     */
    getSneakers: async (params = {}) => {
        const { page = 0, size = 12, brand, category, search, featured, minPrice, maxPrice } = params;
        const queryParams = new URLSearchParams({
            page,
            size,
            ...(brand && { brand }),
            ...(category && { category }),
            ...(search && { search }),
            ...(featured !== undefined && { featured }),
            ...(minPrice && { minPrice }),
            ...(maxPrice && { maxPrice }),
        });
        const response = await api.get(`/products?${queryParams}`);
        return response.data;
    },

    /**
     * Get sneaker by ID
     */
    getSneakerById: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    /**
     * Get sneaker variants (sizes)
     */
    getSneakerVariants: async (sneakerId) => {
        const response = await api.get(`/products/${sneakerId}/variants`);
        return response.data;
    },

    /**
     * Get featured sneakers
     */
    getFeaturedSneakers: async () => {
        const response = await api.get('/products/featured');
        return response.data;
    },

    /**
     * Get all brands
     */
    getBrands: async () => {
        const response = await api.get('/products/brands');
        return response.data;
    },

    /**
     * Get all categories
     */
    getCategories: async () => {
        const response = await api.get('/products/categories');
        return response.data;
    },

    /**
     * Search sneakers
     */
    searchSneakers: async (keyword, page = 0, size = 12) => {
        const response = await api.get(`/products/search?keyword=${keyword}&page=${page}&size=${size}`);
        return response.data;
    },

    /**
     * Delete product (soft delete)
     */
    deleteProduct: async (id) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    },

    /**
     * Update product
     */
    updateProduct: async (id, data) => {
        const response = await api.put(`/products/${id}`, data);
        return response.data;
    },

    /**
     * Update variant
     */
    updateVariant: async (variantId, data) => {
        const response = await api.put(`/products/variants/${variantId}`, data);
        return response.data;
    },
};

export default productService;
