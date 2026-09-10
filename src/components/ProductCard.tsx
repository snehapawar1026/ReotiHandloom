'use client';

import React from 'react';
import Link from 'next/link';
import { useShop, ProductItem } from '@/context/ShopContext';
import { Heart, Star, Bookmark } from 'lucide-react';

interface ProductCardProps {
  product: ProductItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  const isLiked = isInWishlist(product.id);
  const parsedImages = JSON.parse(product.images || '[]');
  const primaryImg = parsedImages[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c';

  return (
    <div className="group relative bg-white border border-gray-100 rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300">
      
      {/* Image Container with Soft Grey Background (Nykaa Style) */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 cursor-pointer">
        <Link href={`/products/${product.slug}`}>
          <img
            src={primaryImg}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Nykaa Fashion "BESTSELLER" Tag at Bottom-Left of Image */}
        {product.isBestSeller && (
          <div className="absolute bottom-2 left-2 bg-rose-600 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider shadow-xs z-10">
            BESTSELLER
          </div>
        )}

        {/* Reoti Handloom Premium Glass Watermark Badge at Bottom-Right */}
        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs text-amber-950 px-2 py-0.5 rounded-full text-[8px] font-bold tracking-wider uppercase border border-amber-300/80 pointer-events-none flex items-center gap-1 shadow-xs z-10">
          <div className="w-2.5 h-2.5 rounded-full overflow-hidden border border-amber-500 shrink-0">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-serif font-extrabold text-[8px] text-amber-950">Reoti Handloom</span>
        </div>

        {/* Top-Right Action Icons: Heart & Bookmark */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            className="w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-700 hover:text-rose-600 transition-colors"
            aria-label="Add to Wishlist"
          >
            <Heart
              className={`w-4 h-4 transition-transform active:scale-125 ${
                isLiked ? 'fill-rose-600 text-rose-600' : 'text-gray-600'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Product Details Section (Nykaa Style) */}
      <div className="p-3 flex flex-col justify-between flex-1">
        <div>
          {/* Brand Name */}
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-950 mb-0.5 font-serif">
            <div className="flex items-center gap-1">
              <div className="w-3.5 h-3.5 rounded-full overflow-hidden border border-amber-400 shrink-0">
                <img src="/logo.jpg" alt="Reoti" className="w-full h-full object-cover" />
              </div>
              <span className="font-extrabold text-xs text-amber-950">Reoti Handloom</span>
            </div>
            <div className="flex items-center gap-0.5 bg-emerald-50 text-emerald-700 px-1 py-0.2 rounded font-bold text-[10px]">
              <span>4.9</span>
              <Star className="w-2.5 h-2.5 fill-emerald-700 text-emerald-700" />
            </div>
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-medium text-xs text-gray-600 line-clamp-1 hover:text-rose-600 transition-colors">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Pricing Section (Nykaa Style) */}
        <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-extrabold text-sm text-gray-900">
              ₹{product.price.toLocaleString()}
            </span>
            <span className="text-[11px] text-gray-400 line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
            {product.discountPercent}% Off
          </span>
        </div>

        {/* Add to Bag Button */}
        <button
          onClick={() => addToCart(product)}
          className="w-full mt-2 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[11px] uppercase tracking-wider rounded transition-colors active:scale-98"
        >
          Add To Bag
        </button>
      </div>
    </div>
  );
};
