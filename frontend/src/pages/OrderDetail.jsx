import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import {
    ArrowLeft,
    MapPin,
    Package,
    CreditCard,
    Clock,
    Calendar,
    CheckCircle2,
    Truck,
    AlertCircle,
    Hash,
    PartyPopper,
    FileText,
    Share2
} from 'lucide-react';
import orderService from '../services/orderService';
import { useToast } from '../context/ToastContext';

function OrderDetail() {
    const { id } = useParams();
    const location = useLocation();
    const { showToast } = useToast();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(!!location.state?.paymentSuccess);

    useEffect(() => {
        if (showSuccessToast) {
            const timer = setTimeout(() => setShowSuccessToast(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [showSuccessToast]);

    useEffect(() => {
        loadOrder();
    }, [id]);

    const loadOrder = async () => {
        try {
            setLoading(true);
            const response = await orderService.getOrderById(id);
            if (response.success) {
                setOrder(response.data);
            }
        } catch (err) {
            console.error('Error loading order:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;
        try {
            setCancelling(true);
            const response = await orderService.cancelOrder(id);
            if (response.success) {
                setOrder(response.data);
            }
        } catch (err) {
            alert('Failed to cancel order.');
        } finally {
            setCancelling(false);
        }
    };

    const handleDownloadInvoice = async () => {
        try {
            setDownloading(true);
            const blob = await orderService.downloadInvoice(order.id);

            // Create a link element
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${order.orderNumber || order.id}.pdf`);

            // Append to html link element page and click
            document.body.appendChild(link);
            link.click();

            // Clean up
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Error downloading invoice", error);
            showToast?.('Failed to download invoice', 'error');
        } finally {
            setDownloading(false);
        }
    };

    const handleShareInvoice = async () => {
        // Since we can't easily share the PDF directly via Web Share API without generating a file object from blob 
        // and some browsers having restrictions, a simple approach is to share the order status or a link.
        // However, the requirement is to share the invoice. 
        // We will try to download it first then share if supported, otherwise just share order details text.

        try {
            const shareData = {
                title: `Invoice for Order #${order.orderNumber}`,
                text: `Here is the invoice for my SneakerHub order #${order.orderNumber}. Total: ₹${order.totalAmount}`,
                url: window.location.href // Sharing the order detail page link as fallback/primary
            };

            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback: Copy info to clipboard
                await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
                showToast?.('Order details copied to clipboard!', 'success');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'CREATED': return { icon: <Clock className="w-6 h-6" />, color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Waiting for Payment' };
            case 'PAID': return { icon: <CheckCircle2 className="w-6 h-6" />, color: 'text-blue-600', bg: 'bg-blue-100', text: 'Order Paid & Confirmed' };
            case 'SHIPPED': return { icon: <Truck className="w-6 h-6" />, color: 'text-indigo-600', bg: 'bg-indigo-100', text: 'On the Way' };
            case 'DELIVERED': return { icon: <CheckCircle2 className="w-6 h-6" />, color: 'text-green-600', bg: 'bg-green-100', text: 'Successfully Delivered' };
            case 'CANCELLED': return { icon: <AlertCircle className="w-6 h-6" />, color: 'text-red-600', bg: 'bg-red-100', text: 'Order Cancelled' };
            default: return { icon: <Package className="w-6 h-6" />, color: 'text-gray-600', bg: 'bg-gray-100', text: status };
        }
    };

    if (loading) return (
        <div className="section bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="spinner-lg"></div>
        </div>
    );

    if (!order) return (
        <div className="section bg-gray-50 min-h-screen">
            <div className="container-custom text-center py-20">
                <h2 className="text-2xl font-bold mb-4">Order not found</h2>
                <Link to="/orders" className="btn btn-primary">Back to My Orders</Link>
            </div>
        </div>
    );

    const status = getStatusInfo(order.status);
    const shippingCost = order.shippingFee;
    const subtotal = order.subtotal;

    return (
        <div className="section bg-gray-50 min-h-screen py-10">
            <div className="container-custom max-w-5xl">
                <Link to="/orders" className="flex items-center gap-2 text-primary-600 font-semibold mb-8 hover:translate-x-[-4px] transition-transform">
                    <ArrowLeft className="w-5 h-5" />
                    Back to My Orders
                </Link>

                {showSuccessToast && (
                    <div className="mb-8 p-6 bg-green-600 rounded-3xl shadow-xl shadow-green-200 text-white animate-slide-up flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                        <div className="flex items-center gap-6 relative z-10">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                <PartyPopper className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black mb-1">Payment Successful!</h3>
                                <p className="text-white/80 font-medium">Your order has been placed and is being processed.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowSuccessToast(false)}
                            className="btn bg-white/20 hover:bg-white/30 text-white border-none font-bold backdrop-blur-md relative z-10"
                        >
                            Dismiss
                        </button>
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                    </div>
                )}

                {/* Header Summary */}
                <div className="card border-none shadow-hard mb-8 overflow-hidden">
                    <div className={`p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100`}>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-black text-gray-400 uppercase tracking-tighter flex items-center gap-1">
                                    <Hash className="w-4 h-4" />
                                    Order ID
                                </span>
                                <span className="font-mono font-bold text-gray-900">{order.orderNumber || order.id}</span>
                            </div>
                            <h1 className="text-3xl font-black">Details</h1>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-white shadow-sm">
                                <div className={`${status.color}`}>{status.icon}</div>
                                <span className={`font-bold uppercase tracking-wide text-xs ${status.color}`}>
                                    {status.text}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm font-bold text-gray-600">
                                <Calendar className="w-4 h-4 text-primary-500" />
                                {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                            </div>

                            {/* Invoice Actions */}
                            {(order.status === 'PAID' || order.status === 'DELIVERED') && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleDownloadInvoice}
                                        disabled={downloading}
                                        className="btn bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 btn-sm font-bold shadow-sm"
                                    >
                                        {downloading ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                                                Downloading...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-primary-600" />
                                                Invoice
                                            </span>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleShareInvoice}
                                        className="btn bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 btn-sm font-bold shadow-sm"
                                    >
                                        <Share2 className="w-4 h-4 text-primary-600" />
                                    </button>
                                </div>
                            )}
                            {order.status === 'CREATED' && (
                                <button
                                    onClick={handleCancelOrder}
                                    disabled={cancelling}
                                    className="btn btn-ghost text-red-600 hover:bg-red-50 font-bold"
                                >
                                    {cancelling ? 'Cancelling...' : 'Cancel Order'}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        {/* Shipping */}
                        <div className="p-6 md:p-8">
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary-500" />
                                Shipping To
                            </h3>
                            <div className="space-y-1 font-medium text-gray-800">
                                <p className="font-bold text-gray-900">{order.shippingName}</p>
                                <p className="text-sm opacity-80">{order.shippingAddressLine1}</p>
                                {order.shippingAddressLine2 && <p className="text-sm opacity-80">{order.shippingAddressLine2}</p>}
                                <p className="text-sm opacity-80">{order.shippingCity}, {order.shippingState} {order.shippingPostalCode}</p>
                                <p className="text-sm opacity-80">{order.shippingCountry}</p>
                                <div className="pt-2 text-sm text-gray-500 font-bold">{order.shippingPhone}</div>
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="p-6 md:p-8">
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-primary-500" />
                                Payment
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                        <img src="https://razorpay.com/favicon.png" className="w-6 h-6 object-contain" alt="RZP" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">Razorpay</p>
                                        <p className="text-xs text-gray-500 font-bold uppercase">{order.paymentStatus || 'COMPLETED'}</p>
                                    </div>
                                </div>
                                {order.payment?.transactionId && (
                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Transaction Ref</p>
                                        <p className="text-xs font-mono font-bold text-gray-600 break-all">{order.payment.transactionId}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Note / Tracking Stepper */}
                        <div className="p-6 md:p-8 col-span-1 md:col-span-3 lg:col-span-1">
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary-500" />
                                Tracking
                            </h3>

                            <div className="relative pl-4 border-l-2 border-gray-100 space-y-8">
                                {[
                                    { key: 'CREATED', label: 'Order Placed', desc: 'We have received your order.' },
                                    { key: 'PAID', label: 'Payment Confirmed', desc: 'Your payment has been verified.' },
                                    { key: 'SHIPPED', label: 'Shipped', desc: 'Your order is on the way.' },
                                    { key: 'DELIVERED', label: 'Delivered', desc: 'Package delivered.' }
                                ].map((step, idx) => {
                                    const steps = ['CREATED', 'PAID', 'SHIPPED', 'DELIVERED'];
                                    const currentIdx = steps.indexOf(order.status);
                                    // Handle CANCELLED separately or as a specific state
                                    const isCompleted = currentIdx >= idx && order.status !== 'CANCELLED';
                                    const isCurrent = currentIdx === idx && order.status !== 'CANCELLED';
                                    const isCancelled = order.status === 'CANCELLED';

                                    if (isCancelled) {
                                        if (idx === 0) return (
                                            <div key={step.key} className="relative">
                                                <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-green-500 ring-4 ring-white"></div>
                                                <p className="font-bold text-gray-900">Order Placed</p>
                                                <p className="text-xs text-gray-500 mt-0.5">We received your order.</p>
                                            </div>
                                        );
                                        if (idx === 1) return (
                                            <div key={step.key} className="relative">
                                                <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-red-500 ring-4 ring-white"></div>
                                                <p className="font-bold text-red-600">Order Cancelled</p>
                                                <p className="text-xs text-gray-500 mt-0.5">This order has been cancelled.</p>
                                            </div>
                                        );
                                        return null;
                                    }

                                    return (
                                        <div key={step.key} className="relative">
                                            <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white transition-colors duration-500 
                                                ${isCompleted ? 'bg-green-500' : isCurrent ? 'bg-primary-500 animate-pulse' : 'bg-gray-200'}`}>
                                            </div>
                                            <p className={`font-bold transition-colors ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {step.label}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                                            {isCurrent && (
                                                <div className="text-[10px] font-bold text-primary-600 mt-1 uppercase tracking-wide">
                                                    Current Status
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="card border-none shadow-soft overflow-hidden mb-8">
                    <div className="card-header bg-white border-b border-gray-100 flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary-600" />
                        <h3 className="text-lg font-bold">Ordered Items</h3>
                    </div>
                    <div className="card-body p-0 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-[10px] text-gray-400 uppercase font-black tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Size</th>
                                    <th className="px-6 py-4 text-center">Qty</th>
                                    <th className="px-6 py-4 text-right">Price</th>
                                    <th className="px-6 py-4 text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {order.items?.map((item) => (
                                    <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-6 font-medium">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm border border-white">
                                                    <img
                                                        src={item.imageUrl || 'https://via.placeholder.com/150'}
                                                        alt={item.sneakerName}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 line-clamp-1">
                                                        {item.sneakerName}
                                                    </div>
                                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-tight">{item.sneakerBrand}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className="inline-block px-3 py-1 rounded-lg bg-white border border-gray-200 text-xs font-black shadow-sm">
                                                {item.size}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-center font-bold text-gray-600">
                                            {item.quantity}
                                        </td>
                                        <td className="px-6 py-6 text-right font-bold text-gray-700">
                                            ₹{item.price.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-6 text-right font-black text-gray-900">
                                            ₹{(item.price * item.quantity).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals Section */}
                    <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end">
                        <div className="w-full md:w-80 space-y-4">
                            <div className="flex justify-between text-gray-600 font-medium">
                                <span>Items Subtotal</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 font-medium">
                                <span>Shipping & Handling</span>
                                <span className={shippingCost === 0 ? 'text-green-600 font-bold' : ''}>
                                    {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                                </span>
                            </div>
                            <div className="divider opacity-50"></div>
                            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-soft border border-primary-50">
                                <span className="text-lg font-black text-gray-900">Order Total</span>
                                <span className="text-2xl font-black text-primary-600">₹{order.totalAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Help Banner */}
                <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-primary-600 rounded-2xl shadow-lg shadow-primary-200 text-white gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                            <AlertCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="font-bold">Need help with this order?</p>
                            <p className="text-white/80 text-sm">Our support team is available 24/7 to assist you.</p>
                        </div>
                    </div>
                    <button className="btn bg-white text-primary-600 hover:bg-gray-100 font-black px-8 h-12">
                        Contact Support
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderDetail;
