import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    LayoutGrid,
    Table,
    MoreVertical,
    Edit,
    Trash2,
    AlertTriangle,
    TrendingUp,
    Package,
    Boxes,
    Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';
import { useToast } from '../../context/ToastContext';

function OwnerDashboard() {
    const [sneakers, setSneakers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('table'); // 'grid' or 'table'
    const [searchQuery, setSearchQuery] = useState('');
    const { showToast } = useToast();

    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {
        try {
            setLoading(true);
            const response = await productService.getSneakers({ size: 100 });
            if (response.success) {
                setSneakers(response.data.content || response.data);
            }
        } catch (error) {
            console.error('Error loading inventory:', error);
            showToast('Failed to load inventory', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product? This will hide it from the store.')) {
            try {
                const response = await productService.deleteProduct(id);
                if (response.success) {
                    showToast('Product deleted successfully', 'success');
                    loadInventory();
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                showToast(error.response?.data?.message || 'Failed to delete product', 'error');
            }
        }
    };

    const filteredSneakers = sneakers.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const lowStockCount = sneakers.reduce((count, s) => {
        // Check if any variant is low stock (just a mock logic for now)
        return count + (s.totalStock < 10 ? 1 : 0);
    }, 0);

    return (
        <div className="section bg-gray-50 min-h-screen">
            <div className="container-custom">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-black mb-2 flex items-center gap-4">
                            <Boxes className="w-10 h-10 text-primary-600" />
                            Inventory <span className="text-gray-400">Hub</span>
                        </h1>
                        <p className="text-gray-600">Manage your sneaker collection and monitor stock levels.</p>
                    </div>

                    <button className="btn btn-primary btn-lg shadow-hard shadow-primary-200 flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Add New Sneaker
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="card shadow-soft border-none p-6 flex items-center gap-6">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-primary-600">
                            <Package className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Models</p>
                            <p className="text-2xl font-black">{sneakers.length}</p>
                        </div>
                    </div>

                    <div className="card shadow-soft border-none p-6 flex items-center gap-6">
                        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                            <AlertTriangle className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Low Stock Alert</p>
                            <p className="text-2xl font-black">{lowStockCount}</p>
                        </div>
                    </div>

                    <div className="card shadow-soft border-none p-6 flex items-center gap-6">
                        <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                            <TrendingUp className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Variants</p>
                            <p className="text-2xl font-black">156</p>
                        </div>
                    </div>

                    <div className="card shadow-soft border-none p-6 flex items-center gap-6 bg-gray-900">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                            <Plus className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Best Selling</p>
                            <p className="text-lg font-black text-white">Nike Air Jordan</p>
                        </div>
                    </div>
                </div>

                {/* Inventory Control Bar */}
                <div className="card border-none shadow-soft mb-8">
                    <div className="card-body p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="relative w-full md:w-96">
                            <input
                                type="text"
                                placeholder="Search collection..."
                                className="input pl-12 h-12 bg-gray-50 border-none shadow-inner"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-4 text-gray-400" />
                        </div>

                        <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-400'}`}
                            >
                                <Table className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-400'}`}
                            >
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product List */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="card h-64 skeleton border-none"></div>
                        ))}
                    </div>
                ) : viewMode === 'table' ? (
                    <div className="card border-none shadow-soft overflow-hidden animate-fade-in">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-[10px] text-gray-400 uppercase font-black tracking-widest border-b border-gray-100">
                                    <tr>
                                        <th className="px-8 py-5">Product Name</th>
                                        <th className="px-8 py-5">Brand</th>
                                        <th className="px-8 py-5">Price</th>
                                        <th className="px-8 py-5 text-center">Stock</th>
                                        <th className="px-8 py-5">Inventory Status</th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredSneakers.map((s) => (
                                        <tr key={s.id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border border-white shadow-sm">
                                                        <img src={s.images?.[0] || 'https://via.placeholder.com/150'} alt={s.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <span className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{s.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="badge badge-primary px-3 py-1 font-bold">{s.brand}</span>
                                            </td>
                                            <td className="px-8 py-6 font-black text-gray-900">₹{s.price?.toLocaleString()}</td>
                                            <td className="px-8 py-6 text-center font-bold text-gray-600">
                                                {s.totalStock || 'N/A'}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${s.totalStock < 10 ? 'bg-red-500 animate-pulse' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]'}`}></div>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${s.totalStock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                                                        {s.totalStock < 10 ? 'Low Stock' : 'Healthy'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-primary-600 shadow-sm transition-all border border-transparent hover:border-gray-100">
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <Link to={`/products/${s.id}`} className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-blue-600 shadow-sm transition-all border border-transparent hover:border-gray-100">
                                                        <Eye className="w-5 h-5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(s.id)}
                                                        className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-red-600 shadow-sm transition-all border border-transparent hover:border-gray-100"
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
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
                        {filteredSneakers.map((s) => (
                            <div key={s.id} className="card group border-none shadow-soft overflow-hidden hover-lift">
                                <div className="aspect-square bg-gray-100 relative">
                                    <img src={s.images?.[0] || 'https://via.placeholder.com/150'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={s.name} />
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-sm">
                                        {s.brand}
                                    </div>
                                </div>
                                <div className="card-body p-6">
                                    <h4 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-4 truncate">{s.name}</h4>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Price</p>
                                            <p className="font-black text-gray-900">₹{s.price?.toLocaleString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Stock</p>
                                            <p className={`font-black ${s.totalStock < 10 ? 'text-red-600' : 'text-blue-600'}`}>{s.totalStock || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer bg-gray-50 flex items-center justify-between">
                                    <button className="flex items-center gap-2 text-primary-600 font-bold text-sm tracking-tight hover:translate-x-1 transition-transform">
                                        Edit Stock <TrendingUp className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(s.id)}
                                        className="text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default OwnerDashboard;
