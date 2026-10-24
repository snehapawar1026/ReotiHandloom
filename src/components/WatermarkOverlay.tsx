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
    imageUrl.includes('festival_') ||
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
      <div
        className="pointer-events-none select-none flex items-center justify-center transform -rotate-[28deg] opacity-50"
        style={{
          transformOrigin: 'center center',
          filter: isPdp
            ? 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.45))'
            : 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4))',
        }}
      >
        <img
          src="/images/reoti_exact_white_watermark_hd.png"
          alt="Reoti Handloom Authentic Maheshwari Saree"
          draggable="false"
          loading="lazy"
          decoding="async"
          className={`object-contain pointer-events-none select-none ${
            variant === 'lightbox'
              ? 'w-[340px] sm:w-[440px] md:w-[520px] max-w-[80%]'
              : isPdp
              ? 'w-[240px] sm:w-[300px] md:w-[340px] max-w-[72%]'
              : 'w-36 sm:w-44 md:w-48 max-w-[70%]'
          }`}
        />
      </div>
    </div>
  );
}




