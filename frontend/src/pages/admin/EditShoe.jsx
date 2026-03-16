import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productService from '../../services/productService';
import { useToast } from '../../context/ToastContext';
import {
    Save,
    ArrowLeft,
    Image as ImageIcon,
    Tag,
    Layers,
    DollarSign,
    Percent,
    Package,
    AlertCircle,
    CheckCircle2,
    Loader2
} from 'lucide-react';

const SHOE_SIZES = ['6', '7', '8', '9', '10', '11', '12'];

const EditShoe = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        category: '',
        gender: '',
        basePrice: '',
        description: '',
        imageUrl: '',
        active: true,
        featured: false
    });

    const [variants, setVariants] = useState([]);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                const response = await productService.getSneakerById(id);
                if (response.success) {
                    const product = response.data;
                    setFormData({
                        name: product.name || '',
                        brand: product.brand || '',
                        category: product.category || '',
                        gender: product.gender || '',
                        basePrice: product.basePrice || '',
                        description: product.description || '',
                        imageUrl: product.imageUrl || '',
                        active: product.active ?? true,
                        featured: product.featured ?? false
                    });
                    setVariants(product.variants || []);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                showToast('Failed to load product details', 'error');
                navigate('/admin/dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [id, navigate, showToast]);

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleVariantChange = (index, field, value) => {
        const updatedVariants = [...variants];
        updatedVariants[index] = {
            ...updatedVariants[index],
            [field]: value
        };
        setVariants(updatedVariants);
    };

    const applyBulkPrice = () => {
        if (!formData.basePrice) {
            showToast('Please enter a base price first', 'error');
            return;
        }
        const updatedVariants = variants.map(v => ({
            ...v,
            price: parseFloat(formData.basePrice)
        }));
        setVariants(updatedVariants);
        showToast('Applied base price to all variants', 'success');
    };

    const applyBulkDiscount = (percentage) => {
        const updatedVariants = variants.map(v => {
            const originalPrice = parseFloat(v.price) || parseFloat(formData.basePrice) || 0;
            const discountPrice = originalPrice * (1 - percentage / 100);
            return {
                ...v,
                discountPrice: Math.round(discountPrice)
            };
        });
        setVariants(updatedVariants);
        showToast(`Applied ${percentage}% discount to all variants`, 'success');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            // 1. Update main product info
            const productUpdateData = {
                ...formData,
                basePrice: parseFloat(formData.basePrice)
            };

            const productResponse = await productService.updateProduct(id, productUpdateData);

            if (productResponse.success) {
                // 2. Update each variant
                const variantPromises = variants.map(variant => {
                    const variantData = {
                        size: variant.size,
                        colorVariant: variant.colorVariant || 'Default',
                        stockQuantity: parseInt(variant.stockQuantity),
                        price: parseFloat(variant.price),
                        discountPrice: variant.discountPrice ? parseFloat(variant.discountPrice) : null,
                        available: variant.available,
                        sku: variant.sku
                    };
                    return productService.updateVariant(variant.id, variantData);
                });

                await Promise.all(variantPromises);

                showToast('Product and all variants updated successfully!', 'success');
                navigate('/admin/dashboard');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            showToast(error.message || 'Failed to update product', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Product Data...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-black uppercase tracking-widest text-xs transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </button>
                <div className="flex items-center gap-3">
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${formData.active ? 'bg-green-100 text-green-600 border border-green-200' : 'bg-red-100 text-red-600 border border-red-200'}`}>
                        {formData.active ? 'Public' : 'Hidden'}
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Basic Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-3xl shadow-soft p-8 border border-gray-100">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                <Tag className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-black text-gray-900">Basic Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Shoe Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary-500 font-bold text-gray-900 transition-all"
                                    placeholder="e.g. Nike Air Max Plus"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Brand</label>
                                <input
                                    type="text"
                                    name="brand"
                                    required
                                    value={formData.brand}
                                    onChange={handleFormChange}
                                    className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary-500 font-bold text-gray-900 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Category</label>
                                <select
                                    name="category"
                                    required
                                    value={formData.category}
                                    onChange={handleFormChange}
                                    className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary-500 font-bold text-gray-900 transition-all"
                                >
                                    <option value="Running">Running</option>
                                    <option value="Basketball">Basketball</option>
                                    <option value="Casual">Casual</option>
                                    <option value="Formal">Formal</option>
                                    <option value="Training">Training</option>
                                    <option value="Lifestyle">Lifestyle</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Gender</label>
                                <select
                                    name="gender"
                                    required
                                    value={formData.gender}
                                    onChange={handleFormChange}
                                    className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary-500 font-bold text-gray-900 transition-all"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Men">Men</option>
                                    <option value="Women">Women</option>
                                    <option value="Unisex">Unisex</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Description</label>
                                <textarea
                                    name="description"
                                    rows="4"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    className="w-full px-6 py-4 rounded-3xl bg-gray-50 border-none focus:ring-2 focus:ring-primary-500 font-bold text-gray-900 transition-all resize-none"
                                    placeholder="Product backstory, material details, etc."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-soft p-8 border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                                    <Layers className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-black text-gray-900">Inventory & Pricing</h2>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={applyBulkPrice}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                                >
                                    Sync Price
                                </button>
                                <button
                                    type="button"
                                    onClick={() => applyBulkDiscount(10)}
                                    className="px-4 py-2 bg-orange-50 text-orange-600 hover:bg-orange-100 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                                >
                                    10% Offer
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="px-4 py-4 rounded-l-xl">Size</th>
                                        <th className="px-4 py-4">Price (₹)</th>
                                        <th className="px-4 py-4">Discount (₹)</th>
                                        <th className="px-4 py-4">Stock</th>
                                        <th className="px-4 py-4 rounded-r-xl">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {variants.map((variant, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-6 font-black text-gray-900">UK {variant.size}</td>
                                            <td className="px-4 py-6">
                                                <input
                                                    type="number"
                                                    value={variant.price}
                                                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                                    className="w-24 h-10 px-3 rounded-xl bg-gray-50 border-none font-bold text-sm focus:ring-2 focus:ring-primary-500"
                                                />
                                            </td>
                                            <td className="px-4 py-6">
                                                <input
                                                    type="number"
                                                    value={variant.discountPrice || ''}
                                                    placeholder="None"
                                                    onChange={(e) => handleVariantChange(index, 'discountPrice', e.target.value)}
                                                    className="w-24 h-10 px-3 rounded-xl bg-orange-50/50 border border-orange-100 font-bold text-sm focus:ring-2 focus:ring-orange-500 text-orange-600"
                                                />
                                            </td>
                                            <td className="px-4 py-6">
                                                <input
                                                    type="number"
                                                    value={variant.stockQuantity}
                                                    onChange={(e) => handleVariantChange(index, 'stockQuantity', e.target.value)}
                                                    className="w-20 h-10 px-3 rounded-xl bg-gray-50 border-none font-bold text-sm focus:ring-2 focus:ring-primary-500"
                                                />
                                            </td>
                                            <td className="px-4 py-6">
                                                <button
                                                    type="button"
                                                    onClick={() => handleVariantChange(index, 'available', !variant.available)}
                                                    className={`w-10 h-6 rounded-full relative transition-colors ${variant.available ? 'bg-green-500' : 'bg-gray-300'}`}
                                                >
                                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${variant.available ? 'left-5' : 'left-1'}`} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Sidebar */}
                <div className="space-y-8">
                    <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
                        <div className="aspect-square bg-gray-50 relative group">
                            <img
                                src={formData.imageUrl || 'https://via.placeholder.com/400?text=No+Image'}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 p-6">
                                <p className="text-white text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Main Thumbnail</p>
                                <p className="text-white text-sm font-bold truncate">{formData.name || 'Untitled Product'}</p>
                            </div>
                        </div>
                        <div className="p-8">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Update Image URL</label>
                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <input
                                        type="url"
                                        name="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={handleFormChange}
                                        className="w-full h-12 px-4 rounded-xl bg-gray-50 border-none text-xs font-bold focus:ring-2 focus:ring-primary-500"
                                        placeholder="https://..."
                                    />
                                    <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-soft p-8 border border-gray-100">
                        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Price Overview</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 mb-2">Display Base Price (₹)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="basePrice"
                                        value={formData.basePrice}
                                        onChange={handleFormChange}
                                        className="w-full h-12 pl-10 pr-6 rounded-xl bg-gray-50 border-none font-black text-gray-900 focus:ring-2 focus:ring-primary-500"
                                    />
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 py-4 border-y border-gray-50">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            name="featured"
                                            checked={formData.featured}
                                            onChange={handleFormChange}
                                            className="sr-only"
                                        />
                                        <div className={`w-12 h-6 rounded-full transition-colors ${formData.featured ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.featured ? 'left-7' : 'left-1'}`} />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-900 transition-colors">Mark as Featured</span>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full mt-8 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-100 transition-all disabled:opacity-50"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving Everything...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Update Product
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditShoe;
