import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Chrome } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, loginWithGoogle } = useAuth();
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        if (query.get('expired')) {
            showToast('Your session has expired. Please login again.', 'warning');
        }
    }, [location, showToast]);

    const from = location.state?.from?.pathname || '/';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
        setApiError('');
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const result = await login(formData.email, formData.password);

            if (result.success) {
                showToast(`Welcome back, ${result.data.firstName}!`, 'success');
                navigate(from, { replace: true });
            } else {
                setApiError(result.message);
                showToast(result.message, 'error');
            }
        } catch (error) {
            const msg = error.message || 'Login failed. Please try again.';
            setApiError(msg);
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        loginWithGoogle();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">S</span>
                        </div>
                        <span className="text-3xl font-display font-bold gradient-text">
                            SneakerHub
                        </span>
                    </Link>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Sign in to your account to continue
                    </p>
                </div>

                {/* Login Card */}
                <div className="card animate-scale-in">
                    <div className="card-body">
                        {/* API Error */}
                        {apiError && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-800">{apiError}</p>
                            </div>
                        )}

                        {/* Google Login */}
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center space-x-3 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 mb-6"
                        >
                            <Chrome className="w-5 h-5" />
                            <span>Continue with Google</span>
                        </button>

                        {/* Divider */}
                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">
                                    Or continue with email
                                </span>
                            </div>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                                        placeholder="you@example.com"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`input pl-10 ${errors.password ? 'input-error' : ''}`}
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            {/* Remember & Forgot */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember"
                                        name="remember"
                                        type="checkbox"
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                        Remember me
                                    </label>
                                </div>
                                <a href="#" className="text-sm link">
                                    Forgot password?
                                </a>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn btn-primary btn-lg"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="spinner"></div>
                                        <span>Signing in...</span>
                                    </div>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Register Link */}
                    <div className="card-footer text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="link font-semibold">
                                sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link to="/" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
