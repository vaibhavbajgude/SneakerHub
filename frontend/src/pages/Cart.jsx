import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, TicketPercent } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Cart() {
    const navigate = useNavigate();
    const { cart, loading, updateQuantity, removeItem, clearCart, refreshCart } = useCart();
    const [localUpdating, setLocalUpdating] = useState({});

    useEffect(() => {
        refreshCart();
    }, []);

    const handleUpdateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;
        setLocalUpdating({ ...localUpdating, [cartItemId]: true });
        await updateQuantity(cartItemId, newQuantity);
        setLocalUpdating({ ...localUpdating, [cartItemId]: false });
    };

    const handleRemoveItem = async (cartItemId) => {
        if (!confirm('Remove this item from cart?')) return;
        setLocalUpdating({ ...localUpdating, [cartItemId]: true });
        await removeItem(cartItemId);
        setLocalUpdating({ ...localUpdating, [cartItemId]: false });
    };

    const handleClearCart = async () => {
        if (!confirm('Clear all items from cart?')) return;
        await clearCart();
    };

    if (loading) {
        return (
            <div className="section bg-gray-50">
                <div className="container-custom">
                    <div className="max-w-5xl mx-auto">
                        <div className="h-8 bg-gray-200 animate-pulse rounded w-1/4 mb-8"></div>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="card mb-4 bg-white border-none shadow-soft rounded-3xl">
                                <div className="card-body p-8">
                                    <div className="flex gap-6">
                                        <div className="w-32 h-32 bg-gray-200 animate-pulse rounded-2xl"></div>
                                        <div className="flex-1 space-y-4">
                                            <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4"></div>
                                            <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const items = cart?.items || [];
    const isEmpty = items.length === 0;

    if (isEmpty) {
        return (
            <div className="section bg-gray-50">
                <div className="container-custom">
                    <div className="max-w-2xl mx-auto text-center py-20">
                        <div className="card bg-white border-none shadow-soft rounded-[3rem] p-12">
                            <div className="card-body">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <ShoppingBag className="w-12 h-12 text-gray-300" />
                                </div>
                                <h2 className="text-3xl font-black mb-4 uppercase italic">Your Cart is Empty</h2>
                                <p className="text-gray-500 mb-10 max-w-sm mx-auto">
                                    Looks like you haven't added any heat to your collection yet.
                                </p>
                                <Link to="/products" className="btn btn-primary h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary-100">
                                    Browse Sneakers
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="section bg-gray-50 pt-10 pb-20">
            <div className="container-custom">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <h1 className="text-4xl font-black uppercase italic tracking-tight">Shopping <span className="text-primary-600">Cart</span></h1>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Review your items before checkout ({cart?.totalItems || 0} items)</p>
                        </div>
                        <button
                            onClick={handleClearCart}
                            className="text-red-500 hover:text-red-600 font-black uppercase tracking-widest text-[10px] flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear All
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="card bg-white border border-gray-100 shadow-soft rounded-3xl overflow-hidden hover:shadow-xl transition-all">
                                    <div className="p-6 md:p-8">
                                        <div className="flex flex-col sm:flex-row gap-8">
                                            {/* Image */}
                                            <Link
                                                to={`/products/${item.sneakerVariant.sneakerId}`}
                                                className="w-full sm:w-32 h-32 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 group"
                                            >
                                                <img
                                                    src={item.sneakerImage || 'https://via.placeholder.com/300'}
                                                    alt={item.sneakerName}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/300?text=Sneaker';
                                                    }}
                                                />
                                            </Link>

                                            {/* Details */}
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start gap-4">
                                                        <Link
                                                            to={`/products/${item.sneakerVariant.sneakerId}`}
                                                            className="text-xl font-black text-gray-900 hover:text-primary-600 uppercase italic tracking-tight leading-none"
                                                        >
                                                            {item.sneakerName}
                                                        </Link>
                                                        <button
                                                            onClick={() => handleRemoveItem(item.id)}
                                                            className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        <span className="px-2 py-0.5 bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest rounded-md border border-primary-100">{item.sneakerBrand}</span>
                                                        <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-md border border-gray-100">Size: {item.sneakerVariant.size}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mt-8">
                                                    {/* Quantity Control */}
                                                    <div className="flex items-center bg-gray-50 rounded-xl h-12 px-2 border border-gray-100">
                                                        <button
                                                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                            className="p-2 text-gray-400 hover:text-primary-600 disabled:opacity-30"
                                                            disabled={item.quantity <= 1 || localUpdating[item.id]}
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-10 text-center font-black text-gray-900 leading-none">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                            className="p-2 text-gray-900 hover:text-primary-600 disabled:opacity-30"
                                                            disabled={item.quantity >= item.sneakerVariant.stockQuantity || localUpdating[item.id]}
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    {/* Price Info */}
                                                    <div className="text-right flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 justify-end">
                                                            <span className="text-sm text-gray-400 font-bold uppercase tracking-widest leading-none">Subtotal</span>
                                                            <span className="text-2xl font-black text-gray-900 tracking-tight leading-none">
                                                                ₹{item.subtotal.toLocaleString()}
                                                            </span>
                                                        </div>
                                                        {item.quantity >= 3 && item.isFeatured && (
                                                            <div className="flex items-center gap-1.5 justify-end text-green-600">
                                                                <TicketPercent className="w-4 h-4" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">Bulk Offer Applied</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary Panel */}
                        <div className="lg:col-span-1">
                            <div className="card bg-white border border-gray-100 shadow-soft p-8 rounded-[2.5rem] sticky top-24">
                                <h3 className="text-xl font-black uppercase italic tracking-tight mb-8">Summary</h3>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <span>Subtotal</span>
                                        <span className="text-gray-900">₹{cart?.totalPrice.toLocaleString() || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <span>Shipping</span>
                                        <span className={cart?.totalPrice >= 2999 ? 'text-green-600' : 'text-gray-900'}>
                                            {cart?.totalPrice >= 2999 ? 'FREE' : '₹99'}
                                        </span>
                                    </div>
                                    {cart?.totalPrice >= 2999 && (
                                        <div className="p-3 bg-green-50 rounded-xl border border-green-100 flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-green-700">Eligible for Free Express Shipping</span>
                                        </div>
                                    )}
                                </div>

                                <div className="h-px bg-gray-50 mb-8" />

                                <div className="flex justify-between items-end mb-10">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Final Price</span>
                                    <span className="text-4xl font-black tracking-tight text-primary-600">
                                        ₹{((cart?.totalPrice || 0) + (cart?.totalPrice >= 2999 ? 0 : 99)).toLocaleString()}
                                    </span>
                                </div>

                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="w-full h-16 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-2xl shadow-gray-200 hover:bg-primary-600 hover:-translate-y-1 transition-all"
                                >
                                    Proceed to Payment
                                    <ArrowRight className="w-5 h-5" />
                                </button>

                                <Link to="/products" className="block text-center mt-6 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">
                                    ← Add More Heat
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
