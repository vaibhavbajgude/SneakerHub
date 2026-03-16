import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, requiredRole }) {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="spinner mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role if required
    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
