import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const SHOE_SIZES = ['6', '7', '8', '9', '10', '11', '12'];

const AddShoe = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        category: '',
        gender: '',
        price: '',
        stock: '',
        description: '',
        imageUrl: ''
    });
    const [selectedSizes, setSelectedSizes] = useState(['6', '7', '8', '9']);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSizeToggle = (size) => {
        setSelectedSizes(prev =>
            prev.includes(size)
                ? prev.filter(s => s !== size)
                : [...prev, size]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedSizes.length === 0) {
            showToast('Please select at least one size', 'error');
            return;
        }

        setLoading(true);

        try {
            // 1. Create the main Sneaker entry
            const sneakerData = {
                name: formData.name,
                brand: formData.brand,
                category: formData.category,
                gender: formData.gender,
                basePrice: parseFloat(formData.price),
                description: formData.description,
                imageUrl: formData.imageUrl,
                active: true,
                featured: false
            };

            const sneakerResponse = await api.post('/sneakers', sneakerData);

            if (sneakerResponse.data.success) {
                const sneakerId = sneakerResponse.data.data.id;

                // 2. Create variants for each selected size
                // We divide the total stock across selected sizes
                const stockPerSize = Math.floor(parseInt(formData.stock) / selectedSizes.length);

                const variantPromises = selectedSizes.map(size => {
                    const variantData = {
                        size: size,
                        colorVariant: "Default",
                        stockQuantity: stockPerSize,
                        price: parseFloat(formData.price),
                        available: true,
                        sku: `SNK-${sneakerId}-${size}`
                    };
                    return api.post(`/sneakers/${sneakerId}/variants`, variantData);
                });

                await Promise.all(variantPromises);

                showToast(`Product added successfully with ${selectedSizes.length} sizes!`, 'success');
                navigate('/admin/dashboard');
            } else {
                throw new Error(sneakerResponse.data.message || 'Failed to create sneaker');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to add product';
            showToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-indigo-700 to-purple-700 px-8 py-10 text-white">
                    <h1 className="text-3xl font-extrabold tracking-tight">Add New Shoe</h1>
                    <p className="mt-2 text-indigo-100 opacity-90">Enter the details of the new product to add it to the catalog.</p>
                </div>

                <form onSubmit={handleSubmit} className="px-8 py-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Shoe Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Shoe Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none"
                                placeholder="e.g. Air Max 2024"
                            />
                        </div>

                        {/* Brand */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
                            <input
                                type="text"
                                name="brand"
                                required
                                value={formData.brand}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none"
                                placeholder="e.g. Nike"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                            <select
                                name="category"
                                required
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none bg-white"
                            >
                                <option value="">Select Category</option>
                                <option value="Running">Running</option>
                                <option value="Basketball">Basketball</option>
                                <option value="Casual">Casual</option>
                                <option value="Formal">Formal</option>
                                <option value="Training">Training</option>
                                <option value="Lifestyle">Lifestyle</option>
                            </select>
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                            <select
                                name="gender"
                                required
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none bg-white"
                            >
                                <option value="">Select Gender</option>
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                                <option value="Unisex">Unisex</option>
                            </select>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                            <input
                                type="number"
                                name="price"
                                step="0.01"
                                required
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none"
                                placeholder="0.00"
                            />
                        </div>

                        {/* Total Stock */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Total Stock Quantity</label>
                            <input
                                type="number"
                                name="stock"
                                required
                                value={formData.stock}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none"
                                placeholder="0"
                            />
                            <p className="mt-1 text-xs text-gray-500 italic">This stock will be divided equally across selected sizes.</p>
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                            <input
                                type="url"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                    </div>

                    {/* Size Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Available Sizes</label>
                        <div className="flex flex-wrap gap-3">
                            {SHOE_SIZES.map(size => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => handleSizeToggle(size)}
                                    className={`px-5 py-2.5 rounded-lg border-2 font-bold transition-all duration-200 ${selectedSizes.includes(size)
                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50'
                                        }`}
                                >
                                    UK {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none resize-none"
                            placeholder="Tell us about the shoe..."
                        />
                    </div>

                    <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/dashboard')}
                            className="px-6 py-3 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-10 py-3 rounded-lg text-sm font-bold text-white shadow-lg transform transition duration-200 active:scale-95 ${loading
                                ? 'bg-indigo-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200'
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Adding Shoe...
                                </span>
                            ) : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddShoe;
