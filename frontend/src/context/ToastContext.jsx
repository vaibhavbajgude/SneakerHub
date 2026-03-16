import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback((message, type = 'info', duration = 5000) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { id, message, type };

        setToasts((prev) => [...prev, newToast]);

        if (duration !== Infinity) {
            setTimeout(() => removeToast(id), duration);
        }
    }, [removeToast]);

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'success': return 'bg-green-50 border-green-100';
            case 'error': return 'bg-red-50 border-red-100';
            case 'warning': return 'bg-yellow-50 border-yellow-100';
            default: return 'bg-blue-50 border-blue-100';
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 max-w-md w-full px-4 sm:px-0 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl border shadow-lg animate-slide-up ${getBgColor(toast.type)}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                                {getIcon(toast.type)}
                            </div>
                            <p className="text-sm font-bold text-gray-800">{toast.message}</p>
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="p-1 hover:bg-black/5 rounded-full transition-colors flex-shrink-0"
                        >
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
