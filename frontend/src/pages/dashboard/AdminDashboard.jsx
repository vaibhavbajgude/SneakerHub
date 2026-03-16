import React, { useState, useEffect } from 'react';
import {
    Users,
    ShoppingBag,
    BarChart3,
    DollarSign,
    Search,
    Filter,
    MoreVertical,
    ShieldCheck,
    Clock,
    TrendingUp,
    ChevronRight,
    UserPlus,
    Trash2,
    Edit3,
    AlertCircle,
    Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import productService from '../../services/productService';
import { useToast } from '../../context/ToastContext';

function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'products', 'users', 'analytics'
    const [page, setPage] = useState(0);
    const [filterStatus, setFilterStatus] = useState('');
    const [productSearch, setProductSearch] = useState('');
    const [totalPages, setTotalPages] = useState(0);
    const { showToast } = useToast();

    const [statsData, setStatsData] = useState(null);

    const ORDER_STATUSES = ['CREATED', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED', 'RETURNED', 'FAILED'];

    const getStatusColor = (status) => {
        switch (status) {
            case 'CREATED': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
            case 'PAID': return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'PROCESSING': return 'bg-indigo-100 text-indigo-600 border-indigo-200';
            case 'SHIPPED': return 'bg-purple-100 text-purple-600 border-purple-200';
            case 'DELIVERED': return 'bg-green-100 text-green-600 border-green-200';
            case 'CANCELLED': return 'bg-red-100 text-red-600 border-red-200';
            case 'REFUNDED': return 'bg-pink-100 text-pink-600 border-pink-200';
            case 'RETURNED': return 'bg-orange-100 text-orange-600 border-orange-200';
            case 'FAILED': return 'bg-gray-100 text-gray-600 border-gray-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    useEffect(() => {
        if (activeTab === 'orders') {
            loadOrders();
        } else if (activeTab === 'products') {
            loadProducts();
        }
        loadStats();
    }, [activeTab, page, productSearch, filterStatus]);

    const loadStats = async () => {
        try {
            const response = await orderService.getOrderStatistics();
            if (response.success) {
                setStatsData(response.data);
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const loadOrders = async () => {
        // ... existing loadOrders code ...
        try {
            setLoading(true);
            const response = await orderService.getAllOrders(page, 10, filterStatus);
            if (response.success) {
                setOrders(response.data.content || response.data || []);
                setTotalPages(response.data.totalPages || 1);
            }
        } catch (error) {
            console.error('Error loading orders:', error);
            showToast('Failed to load orders', 'error');
        } finally {
            setLoading(false);
        }
    };

    // ... loadProducts, handleDeleteProduct, handleUpdateStatus ...
    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getSneakers({
                page,
                size: 10,
                search: productSearch
            });
            if (response.success) {
                setProducts(response.data.content || response.data || []);
                setTotalPages(response.data.totalPages || 1);
            }
        } catch (error) {
            console.error('Error loading products:', error);
            showToast('Failed to load products', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product? This will hide it from the store.')) {
            try {
                const response = await productService.deleteProduct(productId);
                if (response.success) {
                    showToast('Product deleted successfully', 'success');
                    loadProducts();
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                showToast(error.response?.data?.message || 'Failed to delete product', 'error');
            }
        }
    };

    const handleUpdateStatus = async (orderId, status) => {
        try {
            const response = await orderService.updateOrderStatus(orderId, status);
            if (response.success) {
                showToast('Order status updated', 'success');
                loadOrders();
                loadStats(); // Reload stats after update
            }
        } catch (error) {
            console.error('Error updating status:', error);
            showToast('Failed to update status', 'error');
        }
    };

    const stats = [
        { label: 'Total Revenue', value: statsData ? `₹${statsData.totalRevenue?.toLocaleString() || 0}` : '...', icon: <DollarSign />, color: 'bg-green-500', trend: '' },
        { label: 'Total Orders', value: statsData?.totalOrders || '...', icon: <ShoppingBag />, color: 'bg-blue-500', trend: '' },
        { label: 'Pending Orders', value: statsData?.pendingOrders || '...', icon: <Clock />, color: 'bg-yellow-500', trend: '' },
        { label: 'Delivered', value: statsData?.deliveredOrders || '...', icon: <ShieldCheck />, color: 'bg-purple-500', trend: '' },
    ];

    return (
        <div className="section bg-gray-50 min-h-screen">
            <div className="container-custom">
                {/* Header */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black mb-2 flex items-center gap-4">
                            <ShieldCheck className="w-10 h-10 text-primary-600" />
                            Admin <span className="text-gray-400">Control</span>
                        </h1>
                        <p className="text-gray-600">Enterprise resource management and system overview.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex bg-white p-1 rounded-2xl shadow-soft">
                            {['orders', 'products', 'users', 'analytics'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => {
                                        setActiveTab(tab);
                                        setPage(0);
                                    }}
                                    className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === tab
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                                        : 'text-gray-400 hover:text-gray-900'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <Link
                            to="/admin/add-shoe"
                            className="btn bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center gap-2 h-14 px-8 rounded-2xl shadow-lg shadow-indigo-100 transform hover:scale-105 transition-all text-sm font-black uppercase tracking-widest"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            Add Product
                        </Link>
                    </div>
                </div>

                {/* Analytics Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, i) => (
                        <div key={i} className="card border-none shadow-soft overflow-hidden group">
                            <div className="card-body p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className={`w-14 h-14 ${stat.color} text-white rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
                                        {React.cloneElement(stat.icon, { className: 'w-7 h-7' })}
                                    </div>
                                    {stat.trend && <span className="text-xs font-black text-green-600 bg-green-50 px-3 py-1 rounded-full">{stat.trend}</span>}
                                </div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'orders' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="relative flex-1 max-w-xl">
                                <input
                                    type="text"
                                    placeholder="Filter by Order ID or Customer..."
                                    className="input pl-12 h-14 border-none shadow-soft"
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                <button
                                    onClick={() => setFilterStatus('')}
                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${filterStatus === '' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-900 hover:text-gray-900'}`}
                                >
                                    All
                                </button>
                                {ORDER_STATUSES.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setFilterStatus(s)}
                                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${filterStatus === s ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-400 border-gray-200 hover:border-primary-600 hover:text-primary-600'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="card border-none shadow-soft overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-[10px] text-gray-400 uppercase font-black tracking-widest border-b border-gray-100">
                                        <tr>
                                            <th className="px-8 py-5">Order ID</th>
                                            <th className="px-8 py-5">Customer</th>
                                            <th className="px-8 py-5">Date</th>
                                            <th className="px-8 py-5">Amount</th>
                                            <th className="px-8 py-5">Status</th>
                                            <th className="px-8 py-5 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {orders.map((order) => (
                                            <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <span className="font-mono font-bold text-gray-400">#{order.orderNumber}</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-400 uppercase">
                                                            {order.shippingName?.[0] || 'U'}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 line-clamp-1">{order.shippingName}</p>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{order.shippingPhone}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-sm text-gray-600 font-medium">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-8 py-6 font-black text-gray-900">
                                                    ₹{order.totalAmount.toLocaleString()}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border outline-none cursor-pointer ${getStatusColor(order.status)}`}
                                                    >
                                                        {ORDER_STATUSES.map(s => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <Link to={`/orders/${order.id}`} className="p-2 hover:bg-white inline-block rounded-xl text-gray-400 hover:text-primary-600 shadow-sm transition-all border border-transparent hover:border-gray-100">
                                                        <ChevronRight className="w-5 h-5" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="card-footer bg-white flex items-center justify-between px-8">
                                <span className="text-xs text-gray-400 font-bold">Showing page {page + 1}</span>
                                <div className="flex gap-2">
                                    <button
                                        disabled={page === 0}
                                        onClick={() => setPage(p => p - 1)}
                                        className="btn btn-outline btn-sm disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        disabled={orders.length < 10}
                                        onClick={() => setPage(p => p + 1)}
                                        className="btn btn-primary btn-sm disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="relative flex-1 max-w-xl">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="input pl-12 h-14 border-none shadow-soft"
                                    value={productSearch}
                                    onChange={(e) => setProductSearch(e.target.value)}
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>

                            <Link
                                to="/admin/add-shoe"
                                className="btn btn-primary shadow-soft flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Add Product
                            </Link>
                        </div>

                        <div className="card border-none shadow-soft overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-[10px] text-gray-400 uppercase font-black tracking-widest border-b border-gray-100">
                                        <tr>
                                            <th className="px-8 py-5">Product</th>
                                            <th className="px-8 py-5">Category</th>
                                            <th className="px-8 py-5">Base Price</th>
                                            <th className="px-8 py-5">Stock</th>
                                            <th className="px-8 py-5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {products.map((product) => (
                                            <tr key={product.id} className="group hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shadow-sm">
                                                            <img
                                                                src={product.imageUrl || 'https://via.placeholder.com/100'}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Shoe' }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 line-clamp-1">{product.name}</p>
                                                            <p className="text-[10px] text-primary-600 font-black uppercase tracking-wider">{product.brand}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{product.category}</span>
                                                </td>
                                                <td className="px-8 py-6 font-black text-gray-900">
                                                    ₹{product.basePrice.toLocaleString()}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-gray-700">
                                                            {product.variants?.reduce((acc, v) => acc + v.stockQuantity, 0) || 0} Total
                                                        </span>
                                                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-tight">
                                                            {product.variants?.length || 0} Sizes
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            to={`/admin/edit-shoe/${product.id}`}
                                                            className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                                            title="Edit Product"
                                                        >
                                                            <Edit3 className="w-5 h-5" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteProduct(product.id)}
                                                            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                            title="Delete Product"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="card-footer bg-white flex items-center justify-between px-8">
                                <span className="text-xs text-gray-400 font-bold">Showing page {page + 1}</span>
                                <div className="flex gap-2">
                                    <button
                                        disabled={page === 0}
                                        onClick={() => setPage(p => p - 1)}
                                        className="btn btn-outline btn-sm disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        disabled={products.length < 10}
                                        onClick={() => setPage(p => p + 1)}
                                        className="btn btn-primary btn-sm disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="space-y-6 animate-fade-in text-center py-20 bg-white rounded-3xl shadow-soft">
                        <Users className="w-20 h-20 mx-auto mb-6 text-gray-100" />
                        <h3 className="text-2xl font-black mb-2">User Directory</h3>
                        <p className="text-gray-500 mb-8">Manage system users, permissions and roles from this centralized view.</p>
                        <button className="btn btn-primary flex items-center gap-2 mx-auto">
                            <UserPlus className="w-5 h-5" />
                            Add System User
                        </button>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                        <div className="card border-none shadow-soft p-8">
                            <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                                <TrendingUp className="w-6 h-6 text-primary-600" />
                                Sales Velocity
                            </h3>
                            <div className="h-64 flex items-end justify-between gap-4">
                                {[60, 40, 80, 50, 90, 70, 100].map((h, i) => (
                                    <div key={i} className="flex-1 space-y-2">
                                        <div
                                            className="w-full bg-primary-500 rounded-t-xl hover:bg-primary-600 transition-all cursor-pointer relative group"
                                            style={{ height: `${h}%` }}
                                        >
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                ₹{h * 1000}
                                            </div>
                                        </div>
                                        <p className="text-center text-[10px] font-black text-gray-300 uppercase">Feb {10 - i}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card border-none shadow-soft p-8">
                            <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                                <ShoppingBag className="w-6 h-6 text-secondary-600" />
                                Category Performance
                            </h3>
                            <div className="space-y-6">
                                {[
                                    { label: 'Running', val: 75, color: 'bg-blue-500' },
                                    { label: 'Lifestyle', val: 92, color: 'bg-purple-500' },
                                    { label: 'Basketball', val: 45, color: 'bg-orange-500' },
                                    { label: 'Skateboarding', val: 30, color: 'bg-red-500' },
                                ].map((cat, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-xs font-black uppercase tracking-tight">
                                            <span className="text-gray-900">{cat.label}</span>
                                            <span className="text-gray-400">{cat.val}%</span>
                                        </div>
                                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                            <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.val}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
