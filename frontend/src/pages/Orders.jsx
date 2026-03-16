import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Filter, Search, Calendar, Clock, CreditCard } from 'lucide-react';
import orderService from '../services/orderService';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);

    useEffect(() => {
        loadOrders();
    }, [page]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const response = await orderService.getMyOrders(page, 10);
            if (response.success) {
                setOrders(response.data.content || response.data);
            }
        } catch (err) {
            console.error('Error loading orders:', err);
            setError('Failed to load your orders.');
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

    if (loading && page === 0) {
        return (
            <div className="section bg-gray-50 min-h-screen">
                <div className="container-custom py-12">
                    <div className="h-10 bg-gray-200 skeleton rounded w-48 mb-8"></div>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="card mb-6 h-32 skeleton"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="section bg-gray-50 min-h-screen">
            <div className="container-custom">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
                            <Package className="w-10 h-10 text-primary-600" />
                            My Orders
                        </h1>
                        <p className="text-gray-600">Track and manage your recent purchases</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search order ID..."
                                className="input pl-10 h-11 text-sm bg-white"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                        <button className="btn btn-outline h-11">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                        </button>
                    </div>
                </div>

                {error ? (
                    <div className="card border-red-100 bg-red-50 p-8 text-center">
                        <p className="text-red-700 font-semibold">{error}</p>
                        <button onClick={loadOrders} className="mt-4 btn btn-primary">Try Again</button>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="card p-16 text-center shadow-soft">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-12 h-12 text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h2>
                        <p className="text-gray-600 mb-8">You haven't placed any orders yet. Time to get some new kicks!</p>
                        <Link to="/products" className="btn btn-primary btn-lg px-12">
                            Browse Sneakers
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="card hover-lift transition-all shadow-soft group">
                                <div className="card-body p-0">
                                    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                                        {/* Order Meta */}
                                        <div className="flex-grow space-y-4">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                                    #{order.orderNumber || order.id}
                                                </span>
                                                <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                                                {order.items?.length || 0} {(order.items?.length === 1) ? 'Item' : 'Items'} purchased
                                            </h3>

                                            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                                                <div className="flex items-center gap-2 font-medium">
                                                    <Calendar className="w-4 h-4 text-primary-400" />
                                                    {new Date(order.orderDate || order.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-2 font-medium">
                                                    <CreditCard className="w-4 h-4 text-primary-400" />
                                                    ₹{order.totalAmount?.toLocaleString() || '0'}
                                                </div>
                                                <div className="flex items-center gap-2 font-medium">
                                                    <Clock className="w-4 h-4 text-primary-400" />
                                                    Updated: {new Date(order.updatedAt || order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick Item Previews */}
                                        <div className="flex -space-x-3 overflow-hidden items-center">
                                            {order.items?.slice(0, 3).map((item, idx) => (
                                                <div key={idx} className="w-16 h-16 rounded-xl border-4 border-white shadow-soft overflow-hidden bg-gray-50">
                                                    <img
                                                        src={item.imageUrl || 'https://via.placeholder.com/150'}
                                                        alt="product"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                            {(order.items?.length > 3) && (
                                                <div className="w-16 h-16 rounded-xl border-4 border-white shadow-soft bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
                                                    +{order.items.length - 3}
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-end">
                                            <Link
                                                to={`/orders/${order.id}`}
                                                className="btn btn-outline group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 h-12 px-6"
                                            >
                                                View Details
                                                <ChevronRight className="w-4 h-4 ml-2" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Orders;
