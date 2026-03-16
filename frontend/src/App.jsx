import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import AppRoutes from './routes/AppRoutes';
import './index.css';

function App() {
    return (
        <Router>
            <ToastProvider>
                <AuthProvider>
                    <CartProvider>
                        <div className="min-h-screen bg-gray-50">
                            <AppRoutes />
                        </div>
                    </CartProvider>
                </AuthProvider>
            </ToastProvider>
        </Router>
    );
}

export default App;
