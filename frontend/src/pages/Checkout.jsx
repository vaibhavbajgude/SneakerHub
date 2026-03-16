import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, CreditCard, ChevronLeft, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';
import cartService from '../services/cartService';
import orderService from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { loadRazorpayScript } from '../utils/razorpay';
import paymentService from '../services/paymentService';
import { ProductSkeleton } from '../components/common/Skeleton';

function Checkout() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);

    const [shippingAddress, setShippingAddress] = useState({
        shippingName: user ? `${user.firstName} ${user.lastName}` : '',
        shippingPhone: user?.phoneNumber || '',
        shippingAddressLine1: '',
        shippingAddressLine2: '',
        shippingCity: '',
        shippingState: '',
        shippingPostalCode: '',
        shippingCountry: 'India',
        notes: ''
    });

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            setLoading(true);
            const response = await cartService.getCart();
            if (response.success && response.data.items.length > 0) {
                setCart(response.data);
            } else {
                navigate('/cart');
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            navigate('/cart');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRazorpayPayment = async (internalOrder) => {
        try {
            // 1. Load Razorpay Script
            const res = await loadRazorpayScript();
            if (!res) {
                showToast('Payment system failed to load. Please check your connection.', 'error');
                return;
            }

            // 2. Create Razorpay Order on Backend
            const rzpOrderResponse = await paymentService.createRazorpayOrder(internalOrder.id);
            if (!rzpOrderResponse.success) {
                showToast('Failed to initialize payment. Please try again.', 'error');
                return;
            }

            const { amount, razorpayOrderId: rzpOrderId, currency, keyId } = rzpOrderResponse.data;

            // 3. Open Razorpay Modal
            const options = {
                key: keyId,
                amount: amount.toString(),
                currency: currency,
                name: 'SneakerHub',
                description: `Order #${internalOrder.orderNumber}`,
                image: 'https://razorpay.com/favicon.png',
                order_id: rzpOrderId,
                handler: async (response) => {
                    try {
                        const verificationData = {
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            orderId: internalOrder.id
                        };

                        const verificationResponse = await paymentService.verifyPayment(verificationData);

                        if (verificationResponse.success) {
                            showToast('Payment verified successfully!', 'success');
                            navigate(`/orders/${internalOrder.id}`, {
                                state: { paymentSuccess: true }
                            });
                        } else {
                            showToast('Payment verification failed.', 'error');
                        }
                    } catch (err) {
                        console.error('Verification error:', err);
                        showToast('Error verifying payment.', 'error');
                    }
                },
                prefill: {
                    name: shippingAddress.shippingName,
                    email: user.email,
                    contact: shippingAddress.shippingPhone,
                },
                theme: {
                    color: '#0284c7',
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.on('payment.failed', function (response) {
                showToast('Payment failed: ' + response.error.description, 'error');
                navigate(`/orders/${internalOrder.id}`);
            });
            paymentObject.open();

        } catch (error) {
            console.error('Razorpay flow error:', error);
            showToast('Something went wrong with the payment process.', 'error');
            navigate(`/orders/${internalOrder.id}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (placingOrder) return;

        try {
            setPlacingOrder(true);
            const response = await orderService.placeOrder(shippingAddress);

            if (response.success) {
                await handleRazorpayPayment(response.data);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            showToast(error.response?.data?.message || 'Failed to place order.', 'error');
        } finally {
            setPlacingOrder(false);
        }
    };

    if (loading) {
        return (
            <div className="section bg-gray-50 flex items-center justify-center min-h-[60vh]">
                <div className="spinner-lg"></div>
            </div>
        );
    }

    if (!cart) return null;

    const shippingCost = cart.totalPrice >= 2999 ? 0 : 99;
    const totalAmount = cart.totalPrice + shippingCost;

    return (
        <div className="section bg-gray-50 min-h-screen">
            <div className="container-custom">
                <div className="mb-8 flex items-center gap-4">
                    <Link to="/cart" className="p-2 hover:bg-white rounded-full transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-3xl font-bold">Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <form id="checkout-form" onSubmit={handleSubmit}>
                            <div className="card">
                                <div className="card-header flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-primary-600" />
                                    <h2 className="text-xl font-semibold">Shipping Details</h2>
                                </div>
                                <div className="card-body space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <input
                                                required
                                                type="text"
                                                name="shippingName"
                                                value={shippingAddress.shippingName}
                                                onChange={handleInputChange}
                                                className="input"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <input
                                                required
                                                type="text"
                                                name="shippingPhone"
                                                value={shippingAddress.shippingPhone}
                                                onChange={handleInputChange}
                                                className="input"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                                        <input
                                            required
                                            type="text"
                                            name="shippingAddressLine1"
                                            value={shippingAddress.shippingAddressLine1}
                                            onChange={handleInputChange}
                                            className="input"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                                        <input
                                            type="text"
                                            name="shippingAddressLine2"
                                            value={shippingAddress.shippingAddressLine2}
                                            onChange={handleInputChange}
                                            className="input"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                            <input
                                                required
                                                type="text"
                                                name="shippingCity"
                                                value={shippingAddress.shippingCity}
                                                onChange={handleInputChange}
                                                className="input"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                            <input
                                                required
                                                type="text"
                                                name="shippingState"
                                                value={shippingAddress.shippingState}
                                                onChange={handleInputChange}
                                                className="input"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                            <input
                                                required
                                                type="text"
                                                name="shippingPostalCode"
                                                value={shippingAddress.shippingPostalCode}
                                                onChange={handleInputChange}
                                                className="input"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                            <select
                                                name="shippingCountry"
                                                value={shippingAddress.shippingCountry}
                                                onChange={handleInputChange}
                                                className="input"
                                            >
                                                <option value="India">India</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                                        <textarea
                                            name="notes"
                                            value={shippingAddress.notes}
                                            onChange={handleInputChange}
                                            className="input min-h-[100px]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="card mt-8">
                                <div className="card-header flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-primary-600" />
                                    <h2 className="text-xl font-semibold">Payment Method</h2>
                                </div>
                                <div className="card-body">
                                    <div className="flex items-center gap-4 p-4 border-2 border-primary-600 bg-primary-50 rounded-xl">
                                        <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center">
                                            <img src="https://razorpay.com/favicon.png" alt="Razorpay" className="w-8 h-8 object-contain" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900">Razorpay Secure</h4>
                                            <p className="text-sm text-gray-600">Cards, UPI, Netbanking</p>
                                        </div>
                                        <div className="w-6 h-6 rounded-full bg-primary-600 border-4 border-white shadow-sm"></div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="space-y-8">
                        <div className="card sticky top-24 shadow-hard">
                            <div className="card-header">
                                <h3 className="text-xl font-bold">Order Summary</h3>
                            </div>
                            <div className="card-body px-0">
                                <div className="max-h-80 overflow-y-auto px-6 space-y-4 mb-4">
                                    {cart.items.map((item) => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                <img
                                                    src={item.sneakerImage || 'https://via.placeholder.com/150'}
                                                    alt={item.sneakerName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 truncate">{item.sneakerName}</h4>
                                                <p className="text-sm text-gray-500">
                                                    Size: {item.sneakerVariant.size} × {item.quantity}
                                                </p>
                                            </div>
                                            <div className="font-semibold text-gray-900">
                                                ₹{item.subtotal.toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="divider mx-6"></div>

                                <div className="px-6 space-y-3">
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>Subtotal</span>
                                        <span>₹{cart.totalPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>Shipping</span>
                                        <span className={shippingCost === 0 ? 'text-green-600 font-bold' : ''}>
                                            {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                                        </span>
                                    </div>
                                    <div className="divider"></div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-lg font-bold">Total Amount</span>
                                        <span className="text-2xl font-black text-primary-600">₹{totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer bg-gray-50">
                                <button
                                    type="submit"
                                    form="checkout-form"
                                    disabled={placingOrder}
                                    className="w-full btn btn-primary btn-lg shadow-primary-200 shadow-lg"
                                >
                                    {placingOrder ? 'Processing...' : `Pay ₹${totalAmount.toLocaleString()}`}
                                </button>
                                <p className="text-center text-xs text-gray-500 mt-4">
                                    Confirmations will be sent to <strong>{user?.email}</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
