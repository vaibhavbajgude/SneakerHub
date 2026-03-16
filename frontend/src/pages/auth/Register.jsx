import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, Phone, AlertCircle, Chrome } from 'lucide-react';

function Register() {
    const navigate = useNavigate();
    const { register, loginWithGoogle } = useAuth();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

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

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.phoneNumber) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Phone number is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
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
            // Remove confirmPassword before sending to API
            const { confirmPassword, ...userData } = formData;

            const result = await register(userData);

            if (result.success) {
                navigate('/', { replace: true });
            } else {
                setApiError(result.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            setApiError('An unexpected error occurred. Please try again.');
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
                        Create Account
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Join us and start shopping for premium sneakers
                    </p>
                </div>

                {/* Register Card */}
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
                                    Or register with email
                                </span>
                            </div>
                        </div>

                        {/* Register Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* First Name */}
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className={`input pl-10 ${errors.firstName ? 'input-error' : ''}`}
                                            placeholder="John"
                                        />
                                    </div>
                                    {errors.firstName && (
                                        <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className={`input ${errors.lastName ? 'input-error' : ''}`}
                                        placeholder="Doe"
                                    />
                                    {errors.lastName && (
                                        <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                                    )}
                                </div>
                            </div>

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

                            {/* Phone Number */}
                            <div>
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        type="tel"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className={`input pl-10 ${errors.phoneNumber ? 'input-error' : ''}`}
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                                {errors.phoneNumber && (
                                    <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
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
                                        autoComplete="new-password"
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

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`input pl-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                )}
                            </div>

                            {/* Terms */}
                            <div className="flex items-start">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    required
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                                />
                                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                                    I agree to the{' '}
                                    <a href="#" className="link">
                                        Terms of Service
                                    </a>{' '}
                                    and{' '}
                                    <a href="#" className="link">
                                        Privacy Policy
                                    </a>
                                </label>
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
                                        <span>Creating account...</span>
                                    </div>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Login Link */}
                    <div className="card-footer text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="link font-semibold">
                                Sign in
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

export default Register;
