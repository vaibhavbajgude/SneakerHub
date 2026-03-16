import axios from 'axios';

// Create axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await axios.post(
                        `${api.defaults.baseURL}/auth/refresh`,
                        { refreshToken }
                    );

                    const { accessToken } = response.data.data;
                    localStorage.setItem('accessToken', accessToken);

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/login?expired=true';
                return Promise.reject(refreshError);
            }
        }

        // Standardized Error Object
        const customError = {
            message: error.response?.data?.message || 'Something went wrong. Please try again.',
            status: error.response?.status,
            data: error.response?.data,
            originalError: error
        };

        // Network/Server down error
        if (!error.response) {
            customError.message = 'Unable to connect to server. Please check your internet connection.';
        } else if (error.response.status >= 500) {
            customError.message = error.response.data?.message || 'Server error. Our engineers are on it!';
        } else if (error.response.status === 403) {
            customError.message = "You don't have permission to perform this action.";
        } else if (error.response.status === 404) {
            // Potentially handle 404 if needed
        }

        return Promise.reject(customError);
    }
);

export default api;
