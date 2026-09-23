'use client';

import React from 'react';
import Link from 'next/link';
import { useShop, ProductItem } from '@/context/ShopContext';
import { Heart, Star } from 'lucide-react';
import { WatermarkOverlay } from '@/components/WatermarkOverlay';

interface ProductCardProps {
  product: ProductItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useShop();

  const isLiked = isInWishlist(product.id);
  const parsedImages = JSON.parse(product.images || '[]');
  const primaryImg = parsedImages[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c';

  return (
    <div className="group relative bg-[#FAF7F2] border border-[#E5DAC3] hover:border-[#8B263E] rounded-xl overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-lg transition-all duration-300">
      
      {/* Image Container with Soft Warm Craft Frame & Aspect Ratio 3/4 */}
      <div
        className="relative aspect-[3/4] w-full overflow-hidden bg-amber-50/50 p-1 cursor-pointer border-b border-[#E8DFC8] select-none"
        onContextMenu={(e) => e.preventDefault()}
      >
        <Link href={`/products/${product.slug}`} draggable="false" className="block w-full h-full select-none">
          <img
            src={primaryImg}
            alt={product.title}
            draggable="false"
            onContextMenu={(e) => e.preventDefault()}
            className="w-full h-full object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-500 select-none pointer-events-none"
          />
        </Link>

        {/* Automatic Diagonal Watermark Overlay */}
        <WatermarkOverlay variant="card" imageUrl={primaryImg} />

        {/* Status Badges Container (Top-Left Corner - Authentic Heritage Pills) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {product.isOutOfStock ? (
            <span className="bg-rose-950/90 text-rose-100 text-[8px] sm:text-[9px] font-extrabold uppercase px-2 py-0.5 rounded shadow-xs border border-rose-800 tracking-wider">
              OUT OF STOCK
            </span>
          ) : (
            <>
              {product.isBestSeller && (
                <span className="bg-[#8B263E] text-amber-100 text-[8px] sm:text-[9px] font-serif font-bold uppercase px-2 py-0.5 rounded shadow-xs border border-rose-900 tracking-wider">
                  ★ BESTSELLER
                </span>
              )}
              {product.isTrending && (
                <span className="bg-amber-700 text-amber-50 text-[8px] sm:text-[9px] font-serif font-bold uppercase px-2 py-0.5 rounded shadow-xs flex items-center gap-0.5 border border-amber-800 tracking-wider">
                  🔥 TRENDING
                </span>
              )}
              {product.videoUrl && (
                <span className="bg-neutral-900/90 text-amber-300 text-[8px] sm:text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5 border border-amber-500/40 tracking-wider">
                  ▶ Video
                </span>
              )}
            </>
          )}
        </div>

        {/* Reoti Handloom Authentic Heritage Watermark Badge (Bottom-Left) */}
        <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs text-[#581C1C] px-2 py-0.5 rounded-full text-[8px] font-bold tracking-wider uppercase border border-amber-300/80 pointer-events-none flex items-center gap-1 shadow-2xs z-10">
          <div className="w-2.5 h-2.5 rounded-full overflow-hidden border border-amber-600 shrink-0">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-serif font-extrabold text-[8px] text-[#581C1C]">REOTI HANDLOOM</span>
          <span className="text-[7px] text-amber-700 font-normal lowercase">• authentic</span>
        </div>

        {/* Top-Right Action Icon: Wishlist Heart */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-700 hover:text-rose-600 transition-colors"
            aria-label="Add to Wishlist"
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform active:scale-125 ${
                isLiked ? 'fill-rose-600 text-rose-600' : 'text-gray-600'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-2.5 sm:p-3 flex flex-col justify-between flex-1 bg-white">
        <div>
          {/* Brand Name & Rating */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-amber-950 mb-1 font-serif">
            <div className="flex items-center gap-1 truncate max-w-[75%]">
              <span className="font-serif font-extrabold text-[10px] sm:text-xs text-[#581C1C] tracking-wide truncate">
                Reoti Handloom
              </span>
            </div>
            {/* Rating Badge (Only render if customer rating exists) */}
            {product.reviewCount !== undefined && product.reviewCount > 0 && product.rating && product.rating > 0 ? (
              <div className="flex items-center gap-0.5 bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-bold text-[9px] sm:text-[10px] shrink-0 border border-emerald-200 shadow-2xs">
                <span>{product.rating.toFixed(1)}</span>
                <Star className="w-2.5 h-2.5 fill-emerald-700 text-emerald-700" />
              </div>
            ) : null}
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-medium text-xs sm:text-xs text-gray-700 line-clamp-1 hover:text-[#8B263E] transition-colors leading-snug">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Pricing Section */}
        <div className="mt-2 pt-1.5 border-t border-amber-100 flex items-center justify-between flex-wrap gap-1">
          <div className="flex items-baseline gap-1.5 font-sans">
            <span className="font-sans font-extrabold text-sm sm:text-base text-[#581C1C] tracking-tight">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price ? (
              <span className="font-sans text-[11px] text-gray-400 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            ) : null}
          </div>
          {product.discountPercent && product.discountPercent > 0 && product.originalPrice && product.originalPrice > product.price ? (
            <span className="text-[9px] sm:text-[10px] font-sans font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
              {product.discountPercent}% Off
            </span>
          ) : null}
        </div>

        {/* Add to Bag Button -> Opens Item Description Page */}
        {product.isOutOfStock ? (
          <button
            disabled
            className="w-full mt-2 py-1.5 sm:py-2 bg-gray-200 text-gray-500 font-serif font-bold text-[10px] sm:text-[11px] uppercase tracking-wider rounded-lg cursor-not-allowed border border-gray-300"
          >
            OUT OF STOCK
          </button>
        ) : (
          <Link
            href={`/products/${product.slug}`}
            className="w-full mt-2 py-1.5 sm:py-2 bg-[#581C1C] hover:bg-[#722424] text-amber-50 font-serif font-semibold text-[10px] sm:text-[11px] uppercase tracking-wider rounded-lg transition-colors active:scale-98 shadow-2xs flex items-center justify-center gap-1 cursor-pointer text-center"
          >
            <span>ADD TO BAG</span>
          </Link>
        )}
      </div>
    </div>
  );
};

