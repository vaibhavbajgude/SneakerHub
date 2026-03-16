import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, LogOut, LayoutGrid, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        navigate('/');
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container-custom">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <span className="text-2xl font-display font-bold gradient-text hidden sm:block">
                            SneakerHub
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                            Home
                        </Link>
                        <Link to="/products" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                            Products
                        </Link>
                        <Link to="/featured" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                            Featured
                        </Link>
                        {isAuthenticated && (
                            <Link to="/orders" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                                Orders
                            </Link>
                        )}
                    </nav>

                    {/* Right Section */}
                    <div className="flex items-center space-x-4">
                        {/* Search Icon (Mobile) */}
                        <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Search className="w-5 h-5 text-gray-700" />
                        </button>

                        {/* Cart */}
                        {isAuthenticated && (
                            <Link
                                to="/cart"
                                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ShoppingCart className="w-6 h-6 text-gray-700" />
                                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cart?.totalItems || 0}
                                </span>
                            </Link>
                        )}

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <div className="hidden md:block relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold text-sm">
                                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                                        </span>
                                    </div>
                                    <span className="text-gray-700 font-medium">
                                        {user?.firstName || 'User'}
                                    </span>
                                </button>

                                {/* Dropdown Menu */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200 animate-slide-down">
                                        <Link
                                            to={user?.role === 'ADMIN' ? '/admin/dashboard' : user?.role === 'OWNER' ? '/owner/dashboard' : '/dashboard'}
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors font-bold"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <LayoutGrid className="w-4 h-4 inline mr-2 text-primary-600" />
                                            Dashboard
                                        </Link>
                                        {user?.role === 'ADMIN' && (
                                            <Link
                                                to="/admin/add-shoe"
                                                className="block px-4 py-2 text-primary-600 hover:bg-gray-100 transition-colors font-bold border-l-4 border-primary-600"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                <ShoppingBag className="w-4 h-4 inline mr-2" />
                                                Add Product
                                            </Link>
                                        )}
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <User className="w-4 h-4 inline mr-2" />
                                            Profile
                                        </Link>
                                        <Link
                                            to="/orders"
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <ShoppingCart className="w-4 h-4 inline mr-2" />
                                            My Orders
                                        </Link>
                                        <div className="divider my-1"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4 inline mr-2" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="hidden md:block btn btn-primary btn-sm"
                            >
                                Login
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMenu}
                            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6 text-gray-700" />
                            ) : (
                                <Menu className="w-6 h-6 text-gray-700" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200 animate-slide-down">
                        <nav className="flex flex-col space-y-3">
                            <Link
                                to="/"
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                                onClick={toggleMenu}
                            >
                                Home
                            </Link>
                            <Link
                                to="/products"
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                                onClick={toggleMenu}
                            >
                                Products
                            </Link>
                            <Link
                                to="/featured"
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                                onClick={toggleMenu}
                            >
                                Featured
                            </Link>
                            {isAuthenticated && (
                                <>
                                    <Link
                                        to="/cart"
                                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium flex items-center justify-between"
                                        onClick={toggleMenu}
                                    >
                                        <span>Cart</span>
                                        <span className="bg-primary-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                                            {cart?.totalItems || 0}
                                        </span>
                                    </Link>
                                    <Link
                                        to="/orders"
                                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                                        onClick={toggleMenu}
                                    >
                                        Orders
                                    </Link>
                                </>
                            )}
                            <div className="divider"></div>
                            {isAuthenticated ? (
                                <>
                                    <div className="px-4 py-2 text-sm text-gray-500">
                                        Signed in as <span className="font-semibold text-gray-700">{user?.email}</span>
                                    </div>
                                    <Link
                                        to={user?.role === 'ADMIN' ? '/admin/dashboard' : user?.role === 'OWNER' ? '/owner/dashboard' : '/dashboard'}
                                        className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-bold"
                                        onClick={toggleMenu}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                                        onClick={toggleMenu}
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            toggleMenu();
                                        }}
                                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-left"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
                                        onClick={toggleMenu}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors font-medium text-center"
                                        onClick={toggleMenu}
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
