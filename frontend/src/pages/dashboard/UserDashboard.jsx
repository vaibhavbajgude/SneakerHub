import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Package,
    User,
    ShoppingBag,
    Settings,
    Heart,
    MapPin,
    ChevronRight,
    TrendingUp,
    Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import orderService from '../../services/orderService';
import { TableSkeleton } from '../../components/common/Skeleton';

function UserDashboard() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRecentOrders();
    }, []);

    const loadRecentOrders = async () => {
        try {
            setLoading(true);
            const response = await orderService.getMyOrders(0, 3);
            if (response.success) {
                setRecentOrders(response.data.content || response.data);
            }
        } catch (error) {
            console.error('Error loading recent orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'CREATED': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'PAID': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'PROCESSING': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case 'SHIPPED': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'DELIVERED': return 'bg-green-100 text-green-700 border-green-200';
            case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
            case 'REFUNDED': return 'bg-pink-100 text-pink-700 border-pink-200';
            case 'RETURNED': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'FAILED': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (!user) return null;

    return (
        <div className="section bg-gray-50 min-h-screen">
            <div className="container-custom">
                {/* Welcome Header */}
                <div className="mb-10 animate-fade-in">
                    <h1 className="text-4xl font-black mb-2 flex items-center gap-4">
                        Hello, <span className="gradient-text">{user.firstName}!</span>
                    </h1>
                    <p className="text-gray-600">Great to see you again. Here's what's happening with your account.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content (Left) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Link to="/orders" className="card hover-lift group border-none shadow-soft overflow-hidden">
                                <div className="card-body p-8 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Active Orders</p>
                                        <h3 className="text-3xl font-black text-gray-900 group-hover:text-primary-600 transition-colors">
                                            {recentOrders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length}
                                        </h3>
                                    </div>
                                    <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all">
                                        <Package className="w-8 h-8" />
                                    </div>
                                </div>
                            </Link>

                            <Link to="/profile" className="card hover-lift group border-none shadow-soft overflow-hidden">
                                <div className="card-body p-8 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Member Since</p>
                                        <h3 className="text-2xl font-black text-gray-900 group-hover:text-secondary-600 transition-colors">
                                            Feb 2026
                                        </h3>
                                    </div>
                                    <div className="w-16 h-16 bg-purple-50 rounded-3xl flex items-center justify-center text-secondary-600 group-hover:bg-secondary-600 group-hover:text-white transition-all">
                                        <TrendingUp className="w-8 h-8" />
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Recent Orders Section */}
                        <div className="card border-none shadow-soft overflow-hidden">
                            <div className="card-header bg-white border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                                        <ShoppingBag className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-bold">Recent Orders</h3>
                                </div>
                                <Link to="/orders" className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center">
                                    View All <ChevronRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>
                            <div className="card-body p-0">
                                {loading ? (
                                    <div className="p-8">
                                        <TableSkeleton rows={3} cols={2} />
                                    </div>
                                ) : recentOrders.length > 0 ? (
                                    <div className="divide-y divide-gray-50">
                                        {recentOrders.map((order) => (
                                            <Link
                                                key={order.id}
                                                to={`/orders/${order.id}`}
                                                className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={order.items?.[0]?.sneaker?.images?.[0] || 'https://via.placeholder.com/150'}
                                                            className="w-full h-full object-cover"
                                                            alt="product"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                                                            #{order.orderNumber || order.id.toString().slice(0, 8)}
                                                        </p>
                                                        <p className="text-xs text-gray-500 font-medium">
                                                            {new Date(order.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                    <p className="text-sm font-black text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-12 text-center text-gray-500">
                                        <Clock className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                        <p>No orders yet. Ready for your first pair?</p>
                                        <Link to="/products" className="btn btn-primary btn-sm mt-4">Shop Now</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (Right) */}
                    <aside className="space-y-8">
                        {/* Profile Brief */}
                        <div className="card border-none shadow-soft p-8 text-center bg-white">
                            <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-3xl flex items-center justify-center text-3xl font-black text-white shadow-lg mx-auto mb-6">
                                {user.firstName[0]}{user.lastName[0]}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{user.firstName} {user.lastName}</h3>
                            <p className="text-gray-500 text-sm mb-6">{user.email}</p>
                            <Link to="/profile" className="w-full btn btn-outline btn-sm">
                                Manage Profile
                            </Link>
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">Account Shortcuts</h4>
                            <nav className="space-y-2">
                                <Link to="/profile" className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm hover:shadow-soft transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-primary-600 group-hover:bg-primary-50 transition-all">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <span className="font-bold text-gray-700">Account Settings</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300" />
                                </Link>
                                <Link to="/orders" className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm hover:shadow-soft transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-primary-600 group-hover:bg-primary-50 transition-all">
                                            <ShoppingBag className="w-5 h-5" />
                                        </div>
                                        <span className="font-bold text-gray-700">Order History</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300" />
                                </Link>
                                <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm hover:shadow-soft transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-red-600 group-hover:bg-red-50 transition-all">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <span className="font-bold text-gray-700">Saved Addresses</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300" />
                                </button>
                            </nav>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;
