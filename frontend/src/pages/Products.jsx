import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, Search } from 'lucide-react';
import productService from '../services/productService';
import ProductGrid from '../components/ProductGrid';

function Products() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Filter states
    const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [selectedGender, setSelectedGender] = useState(searchParams.get('gender') || '');
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        loadBrandsAndCategories();
    }, []);

    // Sync state with URL params
    useEffect(() => {
        setSelectedBrand(searchParams.get('brand') || '');
        setSelectedCategory(searchParams.get('category') || '');
        setSelectedGender(searchParams.get('gender') || '');
        setSearchQuery(searchParams.get('search') || '');
        setMinPrice(searchParams.get('minPrice') || '');
        setMaxPrice(searchParams.get('maxPrice') || '');
    }, [searchParams]);

    useEffect(() => {
        loadProducts();
    }, [selectedBrand, selectedCategory, selectedGender, searchQuery, minPrice, maxPrice, page]);

    const loadBrandsAndCategories = async () => {
        try {
            const [brandsRes, categoriesRes] = await Promise.all([
                productService.getBrands(),
                productService.getCategories(),
            ]);

            if (brandsRes.success && Array.isArray(brandsRes.data)) {
                setBrands(brandsRes.data);
            }
            if (categoriesRes.success && Array.isArray(categoriesRes.data)) {
                setCategories(categoriesRes.data);
            }
        } catch (error) {
            console.error('Error loading filters:', error);
        }
    };

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError('');

            const params = {
                page,
                size: 12,
                ...(selectedBrand && { brand: selectedBrand }),
                ...(selectedCategory && { category: selectedCategory }),
                ...(selectedGender && { gender: selectedGender }),
                ...(searchQuery && { search: searchQuery }),
                ...(minPrice && { minPrice }),
                ...(maxPrice && { maxPrice }),
            };

            const response = await productService.getSneakers(params);

            if (response.success && response.data) {
                // Handle both Page object and direct list
                const productList = response.data.content || (Array.isArray(response.data) ? response.data : []);
                setProducts(productList);
                setTotalPages(response.data.totalPages || 1);
            } else {
                setError('Failed to load products');
                setProducts([]);
            }
        } catch (error) {
            console.error('Error loading products:', error);
            setError('Failed to load products. Please try again.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleBrandChange = (brand) => {
        setSelectedBrand(brand);
        setPage(0);
        updateURL({ brand, category: selectedCategory, search: searchQuery });
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setPage(0);
        updateURL({ brand: selectedBrand, category, gender: selectedGender, search: searchQuery });
    };

    const handleGenderChange = (gender) => {
        setSelectedGender(gender);
        setPage(0);
        updateURL({ brand: selectedBrand, category: selectedCategory, gender, search: searchQuery });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        updateURL({ brand: selectedBrand, category: selectedCategory, gender: selectedGender, search: searchQuery });
    };

    const clearFilters = () => {
        setSelectedBrand('');
        setSelectedCategory('');
        setSelectedGender('');
        setSearchQuery('');
        setMinPrice('');
        setMaxPrice('');
        setPage(0);
        setSearchParams({});
    };

    const updateURL = (params) => {
        const newParams = {};
        if (params.brand) newParams.brand = params.brand;
        if (params.category) newParams.category = params.category;
        if (params.gender) newParams.gender = params.gender;
        if (params.search) newParams.search = params.search;
        if (params.minPrice) newParams.minPrice = params.minPrice;
        if (params.maxPrice) newParams.maxPrice = params.maxPrice;
        setSearchParams(newParams);
    };

    const hasActiveFilters = selectedBrand || selectedCategory || selectedGender || searchQuery || minPrice || maxPrice;

    return (
        <div className="section bg-gray-50">
            <div className="container-custom">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="mb-4">All Sneakers</h1>
                    <p className="text-gray-600">
                        Discover our complete collection of premium sneakers
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <form onSubmit={handleSearch} className="relative max-w-2xl">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for sneakers..."
                            className="input pl-12 pr-4"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery('');
                                    updateURL({ brand: selectedBrand, category: selectedCategory, search: '' });
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </form>
                </div>

                <div className="flex gap-8">
                    {/* Filters Sidebar - Desktop */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="card sticky top-24">
                            <div className="card-header flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Filters</h3>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-primary-600 hover:text-primary-700"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>

                            <div className="card-body space-y-6">
                                {/* Brand Filter */}
                                <div>
                                    <h4 className="font-semibold mb-3">Brand</h4>
                                    <div className="space-y-2">
                                        {Array.isArray(brands) && brands.map((brand) => (
                                            <label key={brand} className="flex items-center cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="brand"
                                                    checked={selectedBrand === brand}
                                                    onChange={() => handleBrandChange(brand)}
                                                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                                                />
                                                <span className="ml-2 text-gray-700">{brand}</span>
                                            </label>
                                        ))}
                                        {selectedBrand && (
                                            <button
                                                onClick={() => handleBrandChange('')}
                                                className="text-sm text-primary-600 hover:text-primary-700 ml-6"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="divider"></div>

                                {/* Category Filter */}
                                <div>
                                    <h4 className="font-semibold mb-3">Category</h4>
                                    <div className="space-y-2">
                                        {Array.isArray(categories) && categories.map((category) => (
                                            <label key={category} className="flex items-center cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="category"
                                                    checked={selectedCategory === category}
                                                    onChange={() => handleCategoryChange(category)}
                                                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                                                />
                                                <span className="ml-2 text-gray-700">{category}</span>
                                            </label>
                                        ))}
                                        {selectedCategory && (
                                            <button
                                                onClick={() => handleCategoryChange('')}
                                                className="text-sm text-primary-600 hover:text-primary-700 ml-6"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="divider"></div>

                                {/* Gender Filter */}
                                <div>
                                    <h4 className="font-semibold mb-3">Gender</h4>
                                    <div className="space-y-2">
                                        {['Men', 'Women', 'Unisex'].map((gender) => (
                                            <label key={gender} className="flex items-center cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    checked={selectedGender === gender}
                                                    onChange={() => handleGenderChange(gender)}
                                                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                                                />
                                                <span className="ml-2 text-gray-700">{gender}</span>
                                            </label>
                                        ))}
                                        {selectedGender && (
                                            <button
                                                onClick={() => handleGenderChange('')}
                                                className="text-sm text-primary-600 hover:text-primary-700 ml-6"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="divider"></div>

                                {/* Price Filter */}
                                <div>
                                    <h4 className="font-semibold mb-3">Price Range</h4>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                            className="input text-sm p-2 w-full"
                                        />
                                        <span className="text-gray-400">-</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            className="input text-sm p-2 w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Mobile Filter Button */}
                    <button
                        onClick={() => setShowFilters(true)}
                        className="lg:hidden fixed bottom-6 right-6 z-40 btn btn-primary rounded-full w-14 h-14 flex items-center justify-center shadow-hard"
                    >
                        <Filter className="w-6 h-6" />
                    </button>

                    {/* Mobile Filters Modal */}
                    {showFilters && (
                        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowFilters(false)}>
                            <div
                                className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Filters</h3>
                                    <button onClick={() => setShowFilters(false)}>
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="p-4 space-y-6">
                                    {/* Brand Filter */}
                                    <div>
                                        <h4 className="font-semibold mb-3">Brand</h4>
                                        <div className="space-y-2">
                                            {Array.isArray(brands) && brands.map((brand) => (
                                                <label key={brand} className="flex items-center cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="brand-mobile"
                                                        checked={selectedBrand === brand}
                                                        onChange={() => handleBrandChange(brand)}
                                                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                                                    />
                                                    <span className="ml-2 text-gray-700">{brand}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="divider"></div>

                                    {/* Category Filter */}
                                    <div>
                                        <h4 className="font-semibold mb-3">Category</h4>
                                        <div className="space-y-2">
                                            {Array.isArray(categories) && categories.map((category) => (
                                                <label key={category} className="flex items-center cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="category-mobile"
                                                        checked={selectedCategory === category}
                                                        onChange={() => handleCategoryChange(category)}
                                                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                                                    />
                                                    <span className="ml-2 text-gray-700">{category}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="divider"></div>

                                    {/* Gender Filter Mobile */}
                                    <div>
                                        <h4 className="font-semibold mb-3">Gender</h4>
                                        <div className="space-y-2">
                                            {['Men', 'Women', 'Unisex'].map((gender) => (
                                                <label key={gender} className="flex items-center cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="gender-mobile"
                                                        checked={selectedGender === gender}
                                                        onChange={() => handleGenderChange(gender)}
                                                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                                                    />
                                                    <span className="ml-2 text-gray-700">{gender}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="divider"></div>

                                    {/* Price Filter */}
                                    <div>
                                        <h4 className="font-semibold mb-3">Price Range</h4>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                placeholder="Min"
                                                value={minPrice}
                                                onChange={(e) => setMinPrice(e.target.value)}
                                                className="input text-sm p-2 w-full"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <span className="text-gray-400">-</span>
                                            <input
                                                type="number"
                                                placeholder="Max"
                                                value={maxPrice}
                                                onChange={(e) => setMaxPrice(e.target.value)}
                                                className="input text-sm p-2 w-full"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
                                    <button onClick={clearFilters} className="flex-1 btn btn-outline">
                                        Clear All
                                    </button>
                                    <button onClick={() => setShowFilters(false)} className="flex-1 btn btn-primary">
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Products Grid */}
                    <div className="flex-1">
                        {/* Active Filters */}
                        {hasActiveFilters && (
                            <div className="mb-6 flex flex-wrap items-center gap-2">
                                <span className="text-sm text-gray-600">Active filters:</span>
                                {selectedBrand && (
                                    <span className="badge badge-primary flex items-center gap-2">
                                        {selectedBrand}
                                        <button onClick={() => handleBrandChange('')}>
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                )}
                                {selectedCategory && (
                                    <span className="badge badge-primary flex items-center gap-2">
                                        {selectedCategory}
                                        <button onClick={() => handleCategoryChange('')}>
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                )}
                                {selectedGender && (
                                    <span className="badge badge-primary flex items-center gap-2">
                                        {selectedGender}
                                        <button onClick={() => handleGenderChange('')}>
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                )}
                                {searchQuery && (
                                    <span className="badge badge-primary flex items-center gap-2">
                                        "{searchQuery}"
                                        <button onClick={() => {
                                            setSearchQuery('');
                                            updateURL({ brand: selectedBrand, category: selectedCategory, search: '', minPrice, maxPrice });
                                        }}>
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                )}
                                {minPrice && (
                                    <span className="badge badge-primary flex items-center gap-2">
                                        Min: ₹{minPrice}
                                        <button onClick={() => setMinPrice('')}>
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                )}
                                {maxPrice && (
                                    <span className="badge badge-primary flex items-center gap-2">
                                        Max: ₹{maxPrice}
                                        <button onClick={() => setMaxPrice('')}>
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                )}
                            </div>
                        )}

                        <ProductGrid products={products} loading={loading} error={error} />

                        {/* Pagination */}
                        {!loading && products.length > 0 && totalPages > 1 && (
                            <div className="mt-12 flex justify-center gap-2">
                                <button
                                    disabled={page === 0}
                                    onClick={() => setPage(p => p - 1)}
                                    className="btn btn-outline disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                {Array.isArray(products) && products.length > 0 && totalPages > 1 && [...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPage(i)}
                                        className={`w-10 h-10 rounded-lg font-bold transition-all ${page === i ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    disabled={page === totalPages - 1}
                                    onClick={() => setPage(p => p + 1)}
                                    className="btn btn-outline disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Products;
