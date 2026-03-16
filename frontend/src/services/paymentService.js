import api from './api';

const paymentService = {
    /**
     * Create Razorpay order
     */
    createRazorpayOrder: async (orderId) => {
        const response = await api.post(`/payments/create-order/${orderId}`);
        return response.data;
    },

    /**
     * Verify Razorpay payment
     */
    verifyPayment: async (paymentData) => {
        const response = await api.post('/payments/verify', paymentData);
        return response.data;
    }
};

export default paymentService;
