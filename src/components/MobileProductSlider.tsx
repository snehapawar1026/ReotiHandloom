'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ProductItem } from '@/context/ShopContext';
import { ProductCard } from '@/components/ProductCard';
import { ArrowRight } from 'lucide-react';

interface MobileProductSliderProps {
  products: ProductItem[];
  emptyMessage?: string;
  viewAllLink?: string;
  isFirstSection?: boolean;
}

export const MobileProductSlider: React.FC<MobileProductSliderProps> = ({
  products,
  emptyMessage = 'No products found.',
  viewAllLink = '/products',
  isFirstSection = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!products || products.length === 0) {
    return (
      <div className="py-8 text-center text-xs font-bold text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 1. Desktop View (Clean 4-column Grid) */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, idx) => (
          <ProductCard key={product.id} product={product} priority={isFirstSection && idx < 4} />
        ))}
      </div>

      {/* 2. Mobile View: Single Prominent Card Horizontal Scroll (Rewa Handloom style) */}
      <div className="block md:hidden">
        <div
          ref={scrollRef}
          className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory px-4 pb-3 pt-1 scrollbar-none scroll-smooth overscroll-x-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {products.slice(0, 16).map((product, idx) => (
            <div
              key={product.id}
              className="w-[70vw] max-w-[270px] shrink-0 snap-start"
            >
              <ProductCard product={product} priority={isFirstSection && idx < 1} />
            </div>
          ))}

          {/* End of Row Card: Clean View All */}
          {products.length >= 3 && (
            <div className="w-[48vw] max-w-[190px] shrink-0 snap-start flex items-stretch">
              <Link
                href={viewAllLink}
                prefetch={false}
                className="w-full rounded-xl border-2 border-dashed border-[#581C1C]/30 bg-amber-50/40 hover:bg-amber-100/60 p-4 flex flex-col items-center justify-center text-center gap-2 transition-all group/endcard"
              >
                <div className="w-10 h-10 rounded-full bg-[#581C1C] text-amber-100 flex items-center justify-center shadow-sm group-hover/endcard:scale-110 transition-transform">
                  <ArrowRight className="w-5 h-5" />
                </div>
                <span className="font-serif font-extrabold text-xs text-[#581C1C] leading-snug">
                  View All Collection
                </span>
                <span className="text-[10px] text-gray-500 font-sans">
                  Explore All Handloom
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
