import api from './api';

const authService = {
    /**
     * Login with email and password
     */
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    /**
     * Register new user
     */
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    /**
     * Refresh access token
     */
    refreshToken: async (refreshToken) => {
        const response = await api.post('/auth/refresh', { refreshToken });
        return response.data;
    },

    /**
     * Get current user info
     */
    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    /**
     * Logout user
     */
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated: () => {
        const token = localStorage.getItem('accessToken');
        return !!token && token !== 'undefined' && token !== 'null';
    },

    /**
     * Get stored user
     */
    getUser: () => {
        const userStr = localStorage.getItem('user');
        if (!userStr || userStr === 'undefined' || userStr === 'null') return null;
        try {
            return JSON.parse(userStr);
        } catch (e) {
            console.error('Error parsing user from localStorage', e);
            localStorage.removeItem('user');
            return null;
        }
    },

    /**
     * Store auth data
     */
    storeAuthData: (authResponse) => {
        const data = authResponse.data || {};
        const { accessToken, refreshToken, userId, ...userData } = data;

        if (accessToken) localStorage.setItem('accessToken', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

        if (userData.email) {
            const user = {
                id: userId,
                ...userData
            };
            localStorage.setItem('user', JSON.stringify(user));
        }
    },

    /**
     * Initiate Google OAuth login
     */
    loginWithGoogle: () => {
        window.location.href = 'https://sneakerhub-jfrs.onrender.com/oauth2/authorization/google';
    },
};

export default authService;
