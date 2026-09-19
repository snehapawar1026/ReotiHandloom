'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ProductItem } from '@/context/ShopContext';
import { ProductCard } from '@/components/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MobileProductSliderProps {
  products: ProductItem[];
  emptyMessage?: string;
}

export const MobileProductSlider: React.FC<MobileProductSliderProps> = ({
  products,
  emptyMessage = 'No products found.',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    if (clientWidth > 0) {
      const index = Math.round(scrollLeft / (clientWidth * 0.82));
      setActiveIndex(Math.min(Math.max(0, index), products.length - 1));
    }
  };

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.clientWidth * 0.82 + 16; // card width + gap
    scrollRef.current.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth',
    });
    setActiveIndex(index);
  };

  const scrollPrev = () => {
    const prev = Math.max(0, activeIndex - 1);
    scrollToIndex(prev);
  };

  const scrollNext = () => {
    const next = Math.min(products.length - 1, activeIndex + 1);
    scrollToIndex(next);
  };

  if (!products || products.length === 0) {
    return (
      <div className="py-12 text-center text-xs font-bold text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div>
      {/* 1. Desktop View (Grid Layout - 100% untouched) */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* 2. Mobile View (Smooth Sliding / Swipeable Carousel) */}
      <div className="block md:hidden">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-4 pt-1 scrollbar-none scroll-smooth overscroll-x-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[84vw] max-w-[340px] shrink-0 snap-center"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile Navigation Controls: [ < ] [ - - - ] [ > ] */}
        {products.length > 1 && (
          <div className="flex items-center justify-center gap-4 mt-3 px-4">
            {/* Prev Button */}
            <button
              type="button"
              onClick={scrollPrev}
              disabled={activeIndex === 0}
              className="w-8 h-8 rounded border border-gray-300 bg-white flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs transition-all"
              aria-label="Previous product"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Pagination Dash Indicators */}
            <div className="flex items-center gap-1.5">
              {products.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === idx
                      ? 'w-6 bg-[#581C1C]'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={scrollNext}
              disabled={activeIndex === products.length - 1}
              className="w-8 h-8 rounded border border-gray-300 bg-white flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs transition-all"
              aria-label="Next product"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
