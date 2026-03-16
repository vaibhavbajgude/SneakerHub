import React from 'react';
import ProductCard from './ProductCard';

function ProductGrid({ products, loading, error, emptyMessage }) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                    <div key={index} className="card">
                        <div className="aspect-product bg-gray-200 skeleton"></div>
                        <div className="card-body space-y-3">
                            <div className="h-4 bg-gray-200 skeleton rounded w-1/3"></div>
                            <div className="h-6 bg-gray-200 skeleton rounded w-3/4"></div>
                            <div className="h-8 bg-gray-200 skeleton rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="btn btn-primary"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!Array.isArray(products) || products.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">👟</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {emptyMessage || 'No Products Found'}
                </h3>
                <p className="text-gray-600">
                    {!emptyMessage && 'Try adjusting your filters or search terms'}
                </p>
                {/* Fallback check in case products is an object instead of array */}
                {!Array.isArray(products) && products !== null && typeof products === 'object' && (
                    <p className="text-xs text-gray-400 mt-4">Debug Info: Data format mismatch</p>
                )}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id || Math.random()} product={product} />
            ))}
        </div>
    );
}

export default ProductGrid;
