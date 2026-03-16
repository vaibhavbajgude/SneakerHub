import React, { useState } from 'react';
import {
    User,
    Settings,
    Package,
    MapPin,
    Lock,
    Bell,
    ChevronRight,
    Camera,
    Mail,
    Phone,
    Calendar,
    ShieldCheck,
    CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Profile() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    if (!user) return null;

    const tabs = [
        { id: 'profile', label: 'My Profile', icon: <User className="w-5 h-5" /> },
        { id: 'orders', label: 'My Orders', icon: <Package className="w-5 h-5" /> },
        { id: 'addresses', label: 'Addresses', icon: <MapPin className="w-5 h-5" /> },
        { id: 'payments', label: 'Stored Payments', icon: <CreditCard className="w-5 h-5" /> },
        { id: 'security', label: 'Security', icon: <Lock className="w-5 h-5" /> },
    ];

    return (
        <div className="section bg-gray-50 min-h-screen py-10">
            <div className="container-custom">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar */}
                    <aside className="w-full lg:w-80 space-y-6">
                        <div className="card border-none shadow-soft overflow-hidden">
                            <div className="p-8 text-center bg-gradient-to-br from-primary-600 to-secondary-600">
                                <div className="relative inline-block">
                                    <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-4xl font-black text-primary-600 shadow-lg mb-4">
                                        {user.firstName[0]}{user.lastName[0]}
                                    </div>
                                    <button className="absolute bottom-2 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-primary-600 hover:scale-110 transition-transform">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">{user.firstName} {user.lastName}</h3>
                                <p className="text-white/70 text-sm font-medium">{user.email}</p>
                            </div>

                            <div className="card-body p-2">
                                <nav className="space-y-1">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => {
                                                setActiveTab(tab.id);
                                                if (tab.id === 'orders') window.location.href = '/orders';
                                            }}
                                            className={`w-full flex items-center justify-between px-6 py-4 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                                    ? 'bg-primary-50 text-primary-600 shadow-sm'
                                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                {tab.icon}
                                                {tab.label}
                                            </div>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'rotate-90' : ''}`} />
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        <div className="card bg-gray-900 text-white border-none p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Membership</p>
                                <p className="text-sm font-black">SneakerHub VIP Member</p>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 space-y-6 animate-fade-in">
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <div className="card border-none shadow-soft">
                                    <div className="card-header border-b border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                                                <Settings className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-xl font-black">Account Settings</h2>
                                        </div>
                                        <button className="btn btn-outline h-10 px-6">Edit Profile</button>
                                    </div>
                                    <div className="card-body">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                        <User className="w-6 h-6 text-primary-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Full Name</p>
                                                        <p className="font-bold text-gray-900">{user.firstName} {user.lastName}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-4">
                                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                        <Mail className="w-6 h-6 text-primary-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                                                        <p className="font-bold text-gray-900">{user.email}</p>
                                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-100 text-[10px] text-green-700 font-bold uppercase mt-1">
                                                            <ShieldCheck className="w-3 h-3" />
                                                            Verified
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                        <Phone className="w-6 h-6 text-primary-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Phone Number</p>
                                                        <p className="font-bold text-gray-900">{user.phoneNumber || 'Not provided'}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-4">
                                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                        <Calendar className="w-6 h-6 text-primary-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Joined</p>
                                                        <p className="font-bold text-gray-900">{new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Account Preferences Card */}
                                <div className="card border-none shadow-soft">
                                    <div className="card-header border-b border-gray-100 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center text-secondary-600">
                                            <Bell className="w-5 h-5" />
                                        </div>
                                        <h2 className="text-xl font-black">Preferences</h2>
                                    </div>
                                    <div className="card-body space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div>
                                                <p className="font-bold text-gray-900">Email Notifications</p>
                                                <p className="text-xs text-gray-500 font-medium">Get updates on your order status and shipping</p>
                                            </div>
                                            <div className="w-12 h-6 bg-primary-600 rounded-full relative shadow-inner">
                                                <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm"></div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div>
                                                <p className="font-bold text-gray-900">SMS Alerts</p>
                                                <p className="text-xs text-gray-500 font-medium">Receive important texts about your delivery</p>
                                            </div>
                                            <div className="w-12 h-6 bg-gray-200 rounded-full relative">
                                                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Placeholder for other tabs */}
                        {activeTab !== 'profile' && activeTab !== 'orders' && (
                            <div className="card border-none shadow-soft py-20 text-center">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    {tabs.find(t => t.id === activeTab)?.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-2">{tabs.find(t => t.id === activeTab)?.label}</h3>
                                <p className="text-gray-600">This section is currently under development. Check back soon!</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Profile;
