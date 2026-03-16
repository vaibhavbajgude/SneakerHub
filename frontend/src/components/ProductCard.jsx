import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Trash2, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import productService from '../services/productService';
import { useToast } from '../context/ToastContext';

function ProductCard({ product }) {
    const {
        id,
        name,
        brand,
        price,
        discountPrice,
        images,
        category,
        gender,
        isFeatured,
        variants,
    } = product;
    const { user, isAuthenticated } = useAuth();
    const { showToast } = useToast();

    const isAdmin = isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'OWNER');

    const isOutOfStock = !variants || variants.length === 0 || variants.every(v => v.stockQuantity <= 0);

    const displayPrice = discountPrice || price;
    const hasDiscount = discountPrice && discountPrice < price;
    const discountPercent = hasDiscount
        ? Math.round(((price - discountPrice) / price) * 100)
        : 0;

    const imageUrl = (images && images.length > 0) ? images[0] : (product.imageUrl || '/placeholder-sneaker.jpg');

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                const response = await productService.deleteProduct(id);
                if (response.success) {
                    showToast('Product deleted successfully', 'success');
                    window.location.reload();
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                showToast(error.response?.data?.message || 'Failed to delete product', 'error');
            }
        }
    };

    return (
        <div className="card hover-lift group border border-gray-100 shadow-soft overflow-hidden rounded-[2rem]">
            <Link to={`/products/${id}`}>
                {/* Image */}
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x400?text=Sneaker';
                        }}
                    />

                    {/* Quality Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {isFeatured && (
                            <span className="px-3 py-1 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                Elite
                            </span>
                        )}
                        {hasDiscount && (
                            <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                {discountPercent}% OFF
                            </span>
                        )}
                        {isOutOfStock && (
                            <span className="px-3 py-1 bg-gray-400 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                Sold Out
                            </span>
                        )}
                    </div>

                    {/* Bulk Offer Incentive - ONLY for Featured Items */}
                    {isFeatured && (
                        <div className="absolute bottom-4 left-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
                            <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-xl flex items-center justify-center gap-2">
                                <Zap className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                                <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Bulk Offers Available</span>
                            </div>
                        </div>
                    )}

                    {/* Admin Actions */}
                    {isAdmin && (
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDelete();
                                }}
                                className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all group/del"
                            >
                                <Trash2 className="w-5 h-5 text-red-500 group-hover/del:text-white" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex items-center justify-between mb-3 text-[10px] font-black uppercase tracking-widest">
                        <span className="text-primary-600">{brand}</span>
                        <span className="text-gray-400">{gender} {category}</span>
                    </div>

                    <h3 className="text-lg font-black text-gray-900 mb-4 line-clamp-1 uppercase italic leading-none group-hover:text-primary-600 transition-colors">
                        {name}
                    </h3>

                    {/* Price Section */}
                    <div className="flex items-end gap-3">
                        <div className="flex flex-col">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Price</span>
                            <span className="text-2xl font-black text-gray-900 tracking-tight leading-none">
                                ₹{displayPrice?.toLocaleString()}
                            </span>
                        </div>
                        {hasDiscount && (
                            <span className="text-sm text-gray-300 line-through decoration-[2px] decoration-red-500/20 pb-px">
                                ₹{price?.toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>
            </Link>

            {/* Quick View Link */}
            <div className="px-6 pb-6">
                <Link
                    to={`/products/${id}`}
                    className={`h-14 w-full rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 border-2 transition-all ${isOutOfStock
                        ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                        : 'bg-white border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white shadow-soft group-hover:shadow-xl'}`}
                    onClick={(e) => isOutOfStock && e.preventDefault()}
                >
                    {isOutOfStock ? 'Sold Out' : 'View Collection'}
                </Link>
            </div>
        </div>
    );
}

export default ProductCard;
