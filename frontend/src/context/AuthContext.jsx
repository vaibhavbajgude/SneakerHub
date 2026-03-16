import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = () => {
            const storedUser = authService.getUser();
            const isAuth = authService.isAuthenticated();

            if (storedUser && isAuth) {
                setUser(storedUser);
                setIsAuthenticated(true);
            }

            setLoading(false);
        };

        initAuth();
    }, []);

    /**
     * Login user
     */
    const login = React.useCallback(async (email, password) => {
        try {
            const response = await authService.login(email, password);

            if (response.success) {
                authService.storeAuthData(response);
                const { userId, accessToken, refreshToken, ...userData } = response.data;
                const user = { id: userId, ...userData };
                setUser(user);
                setIsAuthenticated(true);
                return { success: true, data: user };
            }

            return { success: false, message: response.message };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }, []);

    const register = React.useCallback(async (userData) => {
        try {
            const response = await authService.register(userData);

            if (response.success) {
                authService.storeAuthData(response);
                const { userId, accessToken, refreshToken, ...data } = response.data;
                const user = { id: userId, ...data };
                setUser(user);
                setIsAuthenticated(true);
                return { success: true, data: user };
            }

            return { success: false, message: response.message };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }, []);

    const logout = React.useCallback(() => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    }, []);

    const loginWithGoogle = React.useCallback(() => {
        authService.loginWithGoogle();
    }, []);

    const updateUser = React.useCallback((userData) => {
        setUser(userData);
        setIsAuthenticated(!!userData);
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            localStorage.removeItem('user');
        }
    }, []);

    const value = React.useMemo(() => ({
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        loginWithGoogle,
        updateUser,
    }), [user, loading, isAuthenticated, login, register, logout, loginWithGoogle, updateUser]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
