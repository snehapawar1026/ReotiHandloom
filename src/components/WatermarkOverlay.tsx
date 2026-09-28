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
      <div
        className="pointer-events-none select-none flex items-center justify-center"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.75))',
        }}
      >
        <img
          src="/images/reoti_white_watermark.png"
          alt="Reoti Handloom Watermark"
          draggable="false"
          className={`object-contain pointer-events-none select-none ${
            isPdp
              ? 'w-56 sm:w-80 md:w-96 max-w-[75%]'
              : 'w-32 sm:w-40 max-w-[65%]'
          }`}
        />
      </div>
    </div>
  );
}

