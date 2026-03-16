import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ShoppingCart,
    Heart,
    Star,
    Truck,
    RotateCcw,
    Shield,
    Check,
    Trash2,
    AlertCircle,
    Plus,
    Minus,
    Tag,
    TicketPercent
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import productService from '../services/productService';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const { addToCart } = useCart();
    const { showToast } = useToast();

    const isAdmin = isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'OWNER');

    const [product, setProduct] = useState(null);
    const [variants, setVariants] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadProduct();
        loadVariants();
    }, [id]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const response = await productService.getSneakerById(id);
            if (response.success) {
                setProduct(response.data);
            } else {
                setError('Product not found');
            }
        } catch (error) {
            console.error('Error loading product:', error);
            setError('Failed to load product');
        } finally {
            setLoading(false);
        }
    };

    const loadVariants = async () => {
        try {
            const response = await productService.getSneakerVariants(id);
            if (response.success) {
                setVariants(response.data);
            }
        } catch (error) {
            console.error('Error loading variants:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete "${product.name}"? This will mark it as inactive and hide it from the store.`)) {
            try {
                const response = await productService.deleteProduct(id);
                if (response.success) {
                    showToast('Product deleted successfully', 'success');
                    navigate('/products');
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                showToast(error.response?.data?.message || 'Failed to delete product', 'error');
            }
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
            return;
        }

        if (!selectedVariant) {
            showToast('Please select a size', 'error');
            return;
        }

        setAddingToCart(true);
        const success = await addToCart(selectedVariant.id, quantity);
        setAddingToCart(false);

        if (success) {
            // Success toast is handled in context
        }
    };

    if (loading) {
        return (
            <div className="section">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <div className="aspect-square bg-gray-200 animate-pulse rounded-2xl"></div>
                            <div className="grid grid-cols-4 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg"></div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="h-8 bg-gray-200 animate-pulse rounded w-1/3"></div>
                            <div className="h-12 bg-gray-200 animate-pulse rounded w-3/4"></div>
                            <div className="h-24 bg-gray-200 animate-pulse rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="section">
                <div className="container-custom text-center py-20">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-black mb-4 uppercase italic">Oops! Product Missing</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">{error || "We couldn't find the sneaker you're looking for."}</p>
                    <button onClick={() => navigate('/products')} className="btn btn-primary px-8 h-14 rounded-2xl font-black uppercase tracking-widest text-xs">
                        Back to Shop
                    </button>
                </div>
            </div>
        );
    }

    const displayPrice = product.discountPrice || product.price;
    const hasDiscount = product.discountPrice && product.discountPrice < product.price;
    const discount = hasDiscount
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0;

    // Quantity based discount calculation (FEATURED ONLY)
    const getQtyDiscount = (qty) => {
        if (!product.featured) return 0;
        if (qty >= 5) return 20;
        if (qty === 4) return 15;
        if (qty === 3) return 10;
        return 0;
    };

    const currentQtyDiscount = getQtyDiscount(quantity);
    const unitPrice = selectedVariant ? (selectedVariant.discountPrice || selectedVariant.price) : displayPrice;
    const originalUnitPrice = selectedVariant ? selectedVariant.price : product.price;

    const discountedUnitPrice = currentQtyDiscount > 0
        ? unitPrice * (1 - currentQtyDiscount / 100)
        : unitPrice;

    const totalPrice = discountedUnitPrice * quantity;

    const images = product.images && product.images.length > 0
        ? product.images
        : ['https://via.placeholder.com/800?text=Sneaker'];

    const sizeVariants = variants.reduce((acc, variant) => {
        if (!acc[variant.size]) {
            acc[variant.size] = [];
        }
        acc[variant.size].push(variant);
        return acc;
    }, {});

    return (
        <div className="section bg-gray-50 pt-10 pb-20">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Images Column */}
                    <div className="space-y-6">
                        <div className="aspect-square bg-white rounded-3xl overflow-hidden shadow-soft group border border-gray-100">
                            <img
                                src={images[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/800?text=Sneaker';
                                }}
                            />
                        </div>

                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-square bg-white rounded-2xl overflow-hidden border-2 transition-all p-1 ${selectedImage === index
                                            ? 'border-primary-600 shadow-lg'
                                            : 'border-transparent hover:border-gray-200'
                                            }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-full object-cover rounded-xl"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info Column */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary-100">{product.brand}</span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-gray-200">{product.gender} {product.category}</span>
                            </div>
                            <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight leading-none uppercase italic">{product.name}</h1>

                            <div className="flex items-center gap-4">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-current" />
                                    ))}
                                </div>
                                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">450+ Verified Reviews</span>
                            </div>
                        </div>

                        {/* Price Details */}
                        <div className="p-8 bg-white rounded-3xl shadow-soft border border-gray-100 space-y-6">
                            <div className="flex flex-col gap-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Base Price</p>
                                <div className="flex items-center gap-3">
                                    <span className="text-5xl font-black text-gray-900 tracking-tight">
                                        ₹{discountedUnitPrice.toLocaleString()}
                                    </span>
                                    {originalUnitPrice > discountedUnitPrice && (
                                        <span className="text-2xl text-gray-300 line-through decoration-[3px] decoration-red-500/30">
                                            ₹{originalUnitPrice.toLocaleString()}
                                        </span>
                                    )}
                                    {currentQtyDiscount > 0 && (
                                        <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-green-100">
                                            Bulk Offer: {currentQtyDiscount}% OFF
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Buy More Section - ONLY for Featured Items */}
                            {product.featured && (
                                <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center">
                                            <TicketPercent className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-sm font-black text-indigo-900 uppercase tracking-widest leading-none">Bulk Savings Multiplier</h3>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { qty: 3, disc: 10 },
                                            { qty: 4, disc: 15 },
                                            { qty: 5, disc: 20 }
                                        ].map(tier => (
                                            <button
                                                key={tier.qty}
                                                onClick={() => setQuantity(tier.qty)}
                                                className={`p-3 rounded-xl border-2 flex flex-col items-center transition-all ${quantity >= tier.qty
                                                    ? 'bg-white border-indigo-500 shadow-md'
                                                    : 'bg-transparent border-indigo-100 opacity-60 hover:opacity-100'}`}
                                            >
                                                <span className="text-[10px] font-black text-indigo-400 uppercase">Buy {tier.qty}</span>
                                                <span className="text-lg font-black text-indigo-900">{tier.disc}% OFF</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Size & Quantity Control */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Select Your Size (UK)</h3>
                                <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                                    {Object.keys(sizeVariants).sort((a, b) => parseFloat(a) - parseFloat(b)).map((size) => {
                                        const variant = sizeVariants[size].find(v => v.stockQuantity > 0 && v.available);
                                        const isSelected = selectedVariant?.size === size;
                                        const isDisabled = !variant;
                                        return (
                                            <button
                                                key={size}
                                                disabled={isDisabled}
                                                onClick={() => setSelectedVariant(variant)}
                                                className={`h-12 rounded-xl border-2 font-black text-sm transition-all ${isSelected
                                                    ? 'bg-gray-900 text-white border-gray-900 shadow-xl scale-105'
                                                    : isDisabled
                                                        ? 'bg-gray-50 text-gray-200 border-gray-100 cursor-not-allowed'
                                                        : 'bg-white text-gray-600 border-gray-100 hover:border-gray-900 hover:shadow-soft'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quantity</h3>
                                    <div className="flex items-center bg-white border border-gray-100 rounded-2xl h-16 px-4 shadow-soft">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-50 rounded-xl transition-colors"><Minus className="w-5 h-5 text-gray-400" /></button>
                                        <span className="w-12 text-center text-xl font-black text-gray-900">{quantity}</span>
                                        <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-gray-50 rounded-xl transition-colors"><Plus className="w-5 h-5 text-gray-900" /></button>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-3">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estimated Total</h3>
                                    <div className="h-16 flex items-center justify-between px-6 bg-gray-900 text-white rounded-2xl shadow-xl shadow-gray-200">
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Final Checkout</span>
                                        <span className="text-2xl font-black tracking-tight">₹{totalPrice.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Actions */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={!selectedVariant || addingToCart}
                                className="flex-[3] h-20 bg-primary-600 text-white rounded-3xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-2xl shadow-primary-200 hover:bg-primary-700 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
                            >
                                {addingToCart ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" /> : <ShoppingCart className="w-6 h-6" />}
                                {addingToCart ? 'Syncing...' : 'Add to Collection'}
                            </button>
                            <button className="flex-1 h-20 bg-white border border-gray-100 text-gray-400 rounded-3xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all shadow-soft group">
                                <Heart className="w-6 h-6 transition-transform group-hover:scale-125 group-hover:fill-current" />
                            </button>
                        </div>

                        {/* Benefits */}
                        <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
                            {[
                                { icon: Truck, title: 'Express', sub: '2-Day' },
                                { icon: RotateCcw, title: 'Return', sub: '30-Day' },
                                { icon: Shield, title: 'Safe', sub: 'Verified' }
                            ].map((ben, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 text-center group cursor-default">
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                                        <ben.icon className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-900 leading-none">{ben.title}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">{ben.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
