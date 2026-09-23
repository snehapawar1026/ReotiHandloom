'use client';

import React from 'react';

interface WatermarkOverlayProps {
  variant?: 'card' | 'pdp' | 'lightbox' | 'thumb';
  className?: string;
  imageUrl?: string;
}

/**
 * Returns true if the image already has an embedded/printed Ambekar Reoti Handloom logo
 * from the original Maheshwar artisan photoshoot.
 */
export function hasExistingWatermark(imageUrl?: string): boolean {
  if (!imageUrl) return false;
  return (
    imageUrl.includes('saree_17890') ||
    imageUrl.includes('saree_17891') ||
    imageUrl.includes('saree_17892') ||
    imageUrl.includes('real_insta_')
  );
}

export function WatermarkOverlay({
  variant = 'card',
  className = '',
  imageUrl = '',
}: WatermarkOverlayProps) {
  if (variant === 'thumb') return null;

  // If the image already has the printed vendor/artisan logo, never render a second watermark
  if (hasExistingWatermark(imageUrl)) {
    return null;
  }

  const isPdp = variant === 'pdp' || variant === 'lightbox';

  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-10 flex items-center justify-center ${className}`}
      aria-hidden="true"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {/* Crisp Single-Layer Diagonal Luxury Watermark */}
      <div
        className="rotate-[-24deg] flex flex-col items-center justify-center text-center opacity-65 pointer-events-none select-none"
        style={{
          transformOrigin: 'center center',
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.7)',
        }}
      >
        {/* Lotus Motif */}
        <svg
          viewBox="0 0 100 48"
          className={`${
            isPdp ? 'w-16 h-8 mb-1.5' : 'w-10 h-5 mb-0.5'
          } text-white fill-none stroke-current stroke-[1.8] drop-shadow-sm`}
        >
          <path
            d="M50 4 C44 16 35 28 16 34 C34 35 44 28 50 44 C56 28 66 35 84 34 C65 28 56 16 50 4 Z"
            fill="rgba(255,255,255,0.15)"
          />
          <path
            d="M50 14 C46 22 40 28 28 34 C38 34 45 30 50 44 C55 30 62 34 72 34 C60 28 54 22 50 14 Z"
            fill="none"
            strokeWidth="1.4"
          />
          <circle cx="50" cy="20" r="2.2" fill="white" />
        </svg>

        {/* Main Brand Name in Fine Serif */}
        <span
          className={`font-serif font-extrabold text-white tracking-[0.14em] uppercase whitespace-nowrap drop-shadow-md ${
            isPdp ? 'text-2xl sm:text-4xl' : 'text-xs sm:text-sm font-bold'
          }`}
        >
          ✦ REOTI HANDLOOM ✦
        </span>

        {/* Subtitle with fine border lines */}
        <div className="flex items-center gap-2 mt-0.5 whitespace-nowrap">
          <span className={`${isPdp ? 'w-12 sm:w-16' : 'w-4 sm:w-6'} h-[1px] bg-white/75`} />
          <span
            className={`font-sans font-bold text-white/95 tracking-[0.2em] uppercase drop-shadow-sm ${
              isPdp ? 'text-[10px] sm:text-xs' : 'text-[6.5px] sm:text-[7.5px]'
            }`}
          >
            AUTHENTIC HANDLOOM
          </span>
          <span className={`${isPdp ? 'w-12 sm:w-16' : 'w-4 sm:w-6'} h-[1px] bg-white/75`} />
        </div>
      </div>
    </div>
  );
}
