import React, { useState, useEffect } from 'react';
import productService from '../services/productService';
import ProductGrid from '../components/ProductGrid';

function Featured() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadFeaturedProducts();
    }, []);

    const loadFeaturedProducts = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await productService.getFeaturedSneakers();

            if (response.success) {
                // Ensure we have an array
                setProducts(Array.isArray(response.data) ? response.data :
                    (response.data?.content && Array.isArray(response.data.content) ? response.data.content : []));
            } else {
                setError('Failed to load featured products');
            }
        } catch (error) {
            console.error('Error loading featured products:', error);
            setError('Failed to load featured products. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white">
            {/* Premium Hero Section */}
            <section className="relative h-[450px] overflow-hidden bg-black flex items-center">
                {/* Visual Background (Gradient + Mesh) */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
                    <div className="absolute top-0 right-0 w-2/3 h-full opacity-40">
                        <img
                            src="https://images.unsplash.com/photo-1606107557195-2171-dd21c1b3?w=1600"
                            alt="Featured Sneaker"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="container-custom relative z-10">
                    <div className="max-w-2xl animate-slide-up">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-[2px] w-12 bg-primary-500"></div>
                            <span className="text-primary-500 font-black uppercase tracking-[0.2em] text-sm">
                                The Elite Series
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none italic">
                            FEATURED <br />
                            <span className="gradient-text">COLLECTION'24</span>
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl font-medium max-w-lg mb-8 outline-none">
                            Our most exclusive drops, performance icons, and luxury collaborations.
                            Curated for those who don't just follow trends—they define them.
                        </p>
                    </div>
                </div>
            </section>

            <div className="section bg-gray-50/50">
                <div className="container-custom">
                    {/* Filter/Header Label */}
                    <div className="flex flex-col md:flex-row items-baseline justify-between gap-4 mb-10 pb-6 border-b border-gray-200">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Curated Selection</h2>
                            <p className="text-gray-500 mt-1 font-medium">{products.length} Exclusive Pairs</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm font-bold text-gray-600 shadow-sm">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                Live Rewards
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="min-h-[400px]">
                        <ProductGrid
                            products={products}
                            loading={loading}
                            error={error}
                            emptyMessage="Our featured vault is currently being restocked. check back soon."
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Story / Lookbook Section */}
            <section className="section bg-white border-t border-gray-100">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl translate-y-8">
                                <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800" alt="Lookbook 1" className="w-full h-full object-cover" />
                            </div>
                            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                                <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800" alt="Lookbook 2" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-4xl font-black mb-6 leading-tight">Beyond The Box.</h2>
                            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                Every pair in our featured collection tells a story. From the legendary courts
                                to the modern streets, we've sourced the most iconic sneakers that represent
                                more than just footwear—they're pieces of history.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center font-black text-primary-600">01</div>
                                    <span className="font-bold text-gray-900">Authenticated & Inspected</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center font-black text-secondary-600">02</div>
                                    <span className="font-bold text-gray-900">Direct From Source</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Featured;
