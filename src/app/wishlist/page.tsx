'use client';

import React from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useShop();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
        <div>
          <h1 className="text-2xl font-serif font-extrabold text-amber-950 flex items-center gap-2">
            <span>My Wishlist</span>
            <Heart className="w-6 h-6 fill-rose-600 text-rose-600" />
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            {wishlist.length} Maheshwari Sarees saved for later
          </p>
        </div>

        <Link
          href="/products"
          className="text-xs font-bold text-rose-700 hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-amber-50/50 rounded-xl border border-amber-100 p-8 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-serif font-bold text-amber-950">Your Wishlist is Empty</h3>
          <p className="text-xs text-gray-500">
            Explore our handcrafted Maheshwari Sarees and tap the heart icon on any saree to save it here!
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-2.5 bg-amber-900 text-white font-bold text-xs rounded hover:bg-amber-950"
          >
            DISCOVER SAREES
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlist.map((product) => {
            const parsedImages = JSON.parse(product.images || '[]');
            const imgUrl = parsedImages[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c';
            return (
              <div
                key={product.id}
                className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between"
              >
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow text-gray-400 hover:text-rose-600 z-10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <Link href={`/products/${product.slug}`} className="block aspect-[3/4] bg-slate-100 overflow-hidden">
                  <img
                    src={imgUrl}
                    alt={product.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      {product.fabric}
                    </span>
                    <h3 className="font-serif font-bold text-xs text-gray-900 mt-1 line-clamp-1">
                      {product.title}
                    </h3>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="font-extrabold text-sm text-gray-900">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded">
                      {product.discountPercent}% OFF
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="w-full mt-3 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs uppercase rounded flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>MOVE TO BAG</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
