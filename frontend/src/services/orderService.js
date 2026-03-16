import api from './api';

const orderService = {
    /**
     * Place order
     */
    placeOrder: async (orderData) => {
        const response = await api.post('/orders/place', orderData);
        return response.data;
    },

    /**
     * Get user's orders
     */
    getMyOrders: async (page = 0, size = 10) => {
        const response = await api.get(`/orders/my?page=${page}&size=${size}`);
        return response.data;
    },

    /**
     * Get order by ID
     */
    getOrderById: async (orderId) => {
        const response = await api.get(`/orders/${orderId}`);
        return response.data;
    },

    /**
     * Cancel order
     */
    cancelOrder: async (orderId) => {
        const response = await api.put(`/orders/${orderId}/cancel`);
        return response.data;
    },

    /**
     * Admin: Get all orders
     */
    getAllOrders: async (page = 0, size = 10, status = '') => {
        const statusQuery = status ? `&status=${status}` : '';
        const response = await api.get(`/admin/orders?page=${page}&size=${size}${statusQuery}`);
        return response.data;
    },

    /**
     * Admin: Update order status
     */
    updateOrderStatus: async (orderId, status) => {
        const response = await api.put(`/admin/orders/${orderId}/status?status=${status}`);
        return response.data;
    },

    /**
     * Admin: Get order statistics
     */
    getOrderStatistics: async () => {
        const response = await api.get('/admin/orders/stats');
        return response.data;
    },

    /**
     * Download Invoice
     */
    downloadInvoice: async (orderId) => {
        const response = await api.get(`/orders/${orderId}/invoice`, {
            responseType: 'blob', // Important for file download
        });
        return response.data;
    },
};

export default orderService;
