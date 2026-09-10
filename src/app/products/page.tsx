'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { ProductItem } from '@/context/ShopContext';
import {
  SlidersHorizontal,
  ArrowUpDown,
  RefreshCw,
  X,
  Filter,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const selectedCategory = searchParams.get('category') || '';
  const selectedFabric = searchParams.get('fabric') || '';
  const searchQuery = searchParams.get('search') || '';
  const selectedSort = searchParams.get('sort') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const [isFilterOpenMobile, setIsFilterOpenMobile] = useState(false);

  // Accordion toggle states
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    category: true,
    fabric: true,
    price: true,
    discount: true,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCategories(data.categories);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedFabric) params.set('fabric', selectedFabric);
    if (searchQuery) params.set('search', searchQuery);
    if (selectedSort) params.set('sort', selectedSort);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.products);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCategory, selectedFabric, searchQuery, selectedSort, minPrice, maxPrice]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push('/products');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      {/* Breadcrumb Path (Nykaa Style) */}
      <div className="text-xs text-gray-500 mb-2 font-medium">
        <span className="hover:text-rose-600 cursor-pointer" onClick={() => router.push('/')}>Home</span>
        <span className="mx-1.5">/</span>
        <span className="hover:text-rose-600 cursor-pointer">Designers</span>
        <span className="mx-1.5">/</span>
        <span className="text-gray-900 font-bold">Reoti Handloom Maheshwari</span>
      </div>

      {/* Header Title & Items Count */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-extrabold text-gray-900 flex items-baseline gap-2">
            <span>
              {selectedCategory
                ? categories.find((c) => c.slug === selectedCategory)?.name || 'Maheshwari Sarees'
                : searchQuery
                ? `Search results for "${searchQuery}"`
                : 'Buy Maheshwari Sarees Online'}
            </span>
            <span className="text-xs font-normal text-gray-500">
              • {products.length} items
            </span>
          </h1>
        </div>

        {/* Sort & Mobile Filter Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFilterOpenMobile(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded text-xs font-bold text-gray-800 bg-white"
          >
            <Filter className="w-3.5 h-3.5 text-rose-600" />
            <span>FILTERS</span>
          </button>

          {/* Nykaa Style Sort Dropdown */}
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-bold text-gray-800">
            <span>Sort by Popularity</span>
            <select
              value={selectedSort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer text-gray-800"
            >
              <option value="">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="discount">Discount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips Pill Bar (Nykaa Screenshot 4 Style) */}
      <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-gray-200">
        <span className="text-xs font-extrabold text-gray-900 mr-2">Filters:</span>
        
        {(selectedCategory || selectedFabric || minPrice || searchQuery) && (
          <button
            onClick={clearAllFilters}
            className="text-xs font-bold text-rose-600 hover:underline px-2 py-1 bg-rose-50 rounded border border-rose-200"
          >
            Reset
          </button>
        )}

        {selectedCategory && (
          <span className="inline-flex items-center gap-1 text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full">
            <span>Category: {selectedCategory}</span>
            <X className="w-3.5 h-3.5 cursor-pointer" onClick={() => updateFilter('category', '')} />
          </span>
        )}

        {selectedFabric && (
          <span className="inline-flex items-center gap-1 text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full">
            <span>Fabric: {selectedFabric}</span>
            <X className="w-3.5 h-3.5 cursor-pointer" onClick={() => updateFilter('fabric', '')} />
          </span>
        )}

        <span className="inline-flex items-center gap-1 text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full cursor-pointer">
          <span>All discounted products</span>
          <X className="w-3.5 h-3.5" />
        </span>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Accordion Filters (Nykaa Screenshot 4 Style) */}
        <aside className="hidden md:block w-64 shrink-0 space-y-4">
          
          {/* Category Accordion */}
          <div className="border-b border-gray-200 pb-3">
            <button
              onClick={() => toggleAccordion('category')}
              className="w-full flex justify-between items-center py-2 font-bold text-xs text-gray-900 uppercase tracking-wider"
            >
              <span>Category</span>
              {openAccordions.category ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </button>
            {openAccordions.category && (
              <div className="space-y-1.5 text-xs pt-1">
                <button
                  onClick={() => updateFilter('category', '')}
                  className={`w-full text-left py-1 text-gray-600 hover:text-rose-600 ${!selectedCategory ? 'font-extrabold text-rose-600' : ''}`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateFilter('category', cat.slug)}
                    className={`w-full text-left py-1 text-gray-600 hover:text-rose-600 flex justify-between ${
                      selectedCategory === cat.slug ? 'font-extrabold text-rose-600' : ''
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-gray-400">({cat._count?.products || 0})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fabric Accordion */}
          <div className="border-b border-gray-200 pb-3">
            <button
              onClick={() => toggleAccordion('fabric')}
              className="w-full flex justify-between items-center py-2 font-bold text-xs text-gray-900 uppercase tracking-wider"
            >
              <span>Fabric</span>
              {openAccordions.fabric ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </button>
            {openAccordions.fabric && (
              <div className="space-y-1.5 text-xs pt-1">
                {['Silk Cotton', 'Pure Silk', 'Tissue Silk'].map((fab) => (
                  <button
                    key={fab}
                    onClick={() => updateFilter('fabric', selectedFabric === fab ? '' : fab)}
                    className={`w-full text-left py-1 text-gray-600 hover:text-rose-600 ${
                      selectedFabric === fab ? 'font-extrabold text-rose-600' : ''
                    }`}
                  >
                    {fab}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price Accordion */}
          <div className="border-b border-gray-200 pb-3">
            <button
              onClick={() => toggleAccordion('price')}
              className="w-full flex justify-between items-center py-2 font-bold text-xs text-gray-900 uppercase tracking-wider"
            >
              <span>Price</span>
              {openAccordions.price ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </button>
            {openAccordions.price && (
              <div className="space-y-1.5 text-xs pt-1 text-gray-600">
                <button onClick={() => { updateFilter('minPrice', ''); updateFilter('maxPrice', '5000'); }} className="block py-1 hover:text-rose-600">
                  Under ₹5,000
                </button>
                <button onClick={() => { updateFilter('minPrice', '5000'); updateFilter('maxPrice', '10000'); }} className="block py-1 hover:text-rose-600">
                  ₹5,000 - ₹10,000
                </button>
                <button onClick={() => { updateFilter('minPrice', '10000'); updateFilter('maxPrice', ''); }} className="block py-1 hover:text-rose-600">
                  Above ₹10,000
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          {loading ? (
            <div className="py-20 text-center text-gray-500 space-y-2">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-rose-600" />
              <p className="text-xs font-bold">Loading Sarees...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center bg-slate-50 rounded-xl border border-gray-200 p-8">
              <h3 className="text-lg font-serif font-bold text-gray-900">No Sarees Found</h3>
              <p className="text-xs text-gray-500 mt-1">Try resetting filters to see more handcrafted options.</p>
              <button
                onClick={clearAllFilters}
                className="mt-4 px-5 py-2 bg-rose-600 text-white font-bold text-xs rounded hover:bg-rose-700"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Loading page...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
