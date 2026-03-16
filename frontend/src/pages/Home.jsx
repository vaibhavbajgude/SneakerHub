import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, TrendingUp, Truck, Shield, HeadphonesIcon } from 'lucide-react';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';

function Home() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFeaturedProducts();
    }, []);

    const loadFeaturedProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getFeaturedSneakers();
            if (response.success) {
                // Limit to 4 products for home page
                setFeaturedProducts(response.data.slice(0, 4));
            }
        } catch (error) {
            console.error('Error loading featured products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 md:py-24">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="animate-slide-up">
                            <h1 className="mb-6">
                                Step Into <span className="gradient-text">Style</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-8">
                                Discover the latest collection of premium sneakers from top brands.
                                Authentic products, unbeatable prices, and fast delivery.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/products" className="btn btn-primary btn-lg">
                                    Shop Now
                                    <ArrowRight className="w-5 h-5 ml-2 inline" />
                                </Link>
                                <Link to="/featured" className="btn btn-outline btn-lg">
                                    View Featured
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-6 mt-12">
                                <div>
                                    <div className="text-3xl font-bold text-primary-600 mb-1">500+</div>
                                    <div className="text-sm text-gray-600">Products</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-primary-600 mb-1">50+</div>
                                    <div className="text-sm text-gray-600">Brands</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-primary-600 mb-1">10k+</div>
                                    <div className="text-sm text-gray-600">Customers</div>
                                </div>
                            </div>
                        </div>

                        <div className="relative animate-fade-in">
                            <div className="aspect-square bg-gradient-to-br from-primary-200 to-secondary-200 rounded-3xl overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"
                                    alt="Hero Sneaker"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-8xl">👟</div>';
                                    }}
                                />
                            </div>
                            {/* Floating Badge */}
                            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-hard p-6 animate-scale-in">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                        <Star className="w-6 h-6 text-green-600 fill-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">4.9</div>
                                        <div className="text-sm text-gray-600">Rating</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="section bg-white">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="card hover-lift text-center">
                            <div className="card-body">
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Truck className="w-8 h-8 text-primary-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
                                <p className="text-gray-600">
                                    Free delivery on orders above ₹2,999
                                </p>
                            </div>
                        </div>
                        <div className="card hover-lift text-center">
                            <div className="card-body">
                                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Shield className="w-8 h-8 text-secondary-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">100% Authentic</h3>
                                <p className="text-gray-600">
                                    Genuine products from authorized retailers
                                </p>
                            </div>
                        </div>
                        <div className="card hover-lift text-center">
                            <div className="card-body">
                                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <HeadphonesIcon className="w-8 h-8 text-accent-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                                <p className="text-gray-600">
                                    Dedicated customer support team
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Sneakers */}
            <section className="relative min-h-[500px] flex items-center bg-gray-900 overflow-hidden">
                {/* Background Video */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                >
                    <source src="https://v1.pinimg.com/videos/iht/720p/11/21/54/11215415f73df99cb0c5680f2e220d4d.mp4" type="video/mp4" />
                    {/* Fallback image if video fails to load */}
                    <img src="https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1600" alt="Sneaker Background" className="absolute inset-0 w-full h-full object-cover" />
                </video>

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/30 z-0"></div>

                {/* Content */}
                <div className="container-custom relative z-10 py-20">
                    <div className="max-w-3xl">
                        <h2 className="mb-2 text-white font-black text-6xl tracking-tight uppercase italic leading-none">
                            Featured <span className="text-indigo-400">Sneakers</span>
                        </h2>
                        <p className="text-gray-200 text-xl max-w-lg mb-10 font-medium">
                            Explore our handpicked collection of premium sneakers for the ultimate style and comfort. Authentic heat delivered to your doorstep.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            <Link to="/featured" className="h-16 px-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-2xl shadow-indigo-500/20 transition-all hover:-translate-y-1">
                                View Collection
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Brands */}
            <section className="section bg-white">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="mb-4">Popular Brands</h2>
                        <p className="text-gray-600">
                            Shop from the world's leading sneaker brands
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {['Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance', 'Converse'].map((brand) => (
                            <Link
                                key={brand}
                                to={`/products?brand=${brand}`}
                                className="card hover-lift text-center"
                            >
                                <div className="card-body py-8">
                                    <div className="text-4xl mb-3">👟</div>
                                    <h4 className="font-semibold text-gray-900">{brand}</h4>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
                <div className="container-custom text-center">
                    <h2 className="mb-6 text-white">Ready to Find Your Perfect Pair?</h2>
                    <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                        Browse our extensive collection and step up your sneaker game today.
                    </p>
                    <Link to="/products" className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg">
                        Explore Collection
                        <ArrowRight className="w-5 h-5 ml-2 inline" />
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default Home;
