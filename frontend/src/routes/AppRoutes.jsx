import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Orders from '../pages/Orders';
import OrderDetail from '../pages/OrderDetail';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import OAuth2Redirect from '../pages/auth/OAuth2Redirect';
import Profile from '../pages/Profile';
import UserDashboard from '../pages/dashboard/UserDashboard';
import OwnerDashboard from '../pages/dashboard/OwnerDashboard';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import AddShoe from '../pages/admin/AddShoe';
import EditShoe from '../pages/admin/EditShoe';
import Featured from '../pages/Featured';
import NotFound from '../pages/NotFound';

function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="products" element={<Products />} />
                <Route path="products/:id" element={<ProductDetail />} />
                <Route path="featured" element={<Featured />} />

                {/* Protected Routes */}
                <Route path="dashboard" element={
                    <ProtectedRoute>
                        <UserDashboard />
                    </ProtectedRoute>
                } />
                <Route path="owner/dashboard" element={
                    <ProtectedRoute requiredRole="OWNER">
                        <OwnerDashboard />
                    </ProtectedRoute>
                } />
                <Route path="admin/dashboard" element={
                    <ProtectedRoute requiredRole="ADMIN">
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
                <Route path="admin/add-shoe" element={
                    <ProtectedRoute requiredRole="ADMIN">
                        <AddShoe />
                    </ProtectedRoute>
                } />
                <Route path="admin/edit-shoe/:id" element={
                    <ProtectedRoute requiredRole="ADMIN">
                        <EditShoe />
                    </ProtectedRoute>
                } />
                <Route path="cart" element={
                    <ProtectedRoute>
                        <Cart />
                    </ProtectedRoute>
                } />
                <Route path="checkout" element={
                    <ProtectedRoute>
                        <Checkout />
                    </ProtectedRoute>
                } />
                <Route path="orders" element={
                    <ProtectedRoute>
                        <Orders />
                    </ProtectedRoute>
                } />
                <Route path="orders/:id" element={
                    <ProtectedRoute>
                        <OrderDetail />
                    </ProtectedRoute>
                } />
                <Route path="profile" element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                } />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default AppRoutes;
