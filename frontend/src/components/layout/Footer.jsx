import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">S</span>
                            </div>
                            <span className="text-2xl font-display font-bold text-white">
                                SneakerHub
                            </span>
                        </div>
                        <p className="text-gray-400 mb-4">
                            Your ultimate destination for premium sneakers. Authentic products, fast delivery, and exceptional service.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-primary-400 transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-primary-400 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-primary-400 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-primary-400 transition-colors">
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="hover:text-primary-400 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/products" className="hover:text-primary-400 transition-colors">
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link to="/featured" className="hover:text-primary-400 transition-colors">
                                    Featured
                                </Link>
                            </li>
                            <li>
                                <Link to="/orders" className="hover:text-primary-400 transition-colors">
                                    My Orders
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Customer Service</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="hover:text-primary-400 transition-colors">
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary-400 transition-colors">
                                    Shipping Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary-400 transition-colors">
                                    Returns & Exchanges
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary-400 transition-colors">
                                    FAQs
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary-400 transition-colors">
                                    Size Guide
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Newsletter</h3>
                        <p className="text-gray-400 mb-4">
                            Subscribe to get special offers and updates.
                        </p>
                        <form
                            className="space-y-2"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder:text-gray-500"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                                >
                                    <Mail className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="divider border-gray-800"></div>

                {/* Bottom */}
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-gray-400 text-sm">
                        © {currentYear} SneakerHub. All rights reserved.
                    </p>
                    <div className="flex space-x-6 text-sm">
                        <a href="#" className="hover:text-primary-400 transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-primary-400 transition-colors">
                            Terms of Service
                        </a>
                        <a href="#" className="hover:text-primary-400 transition-colors">
                            Cookie Policy
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
