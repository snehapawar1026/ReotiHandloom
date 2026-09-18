'use client';

import React from 'react';

interface WatermarkOverlayProps {
  variant?: 'card' | 'pdp' | 'lightbox' | 'thumb';
  className?: string;
}

export function WatermarkOverlay({ variant = 'card', className = '' }: WatermarkOverlayProps) {
  if (variant === 'thumb') return null;

  const isPdp = variant === 'pdp' || variant === 'lightbox';

  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-10 ${className}`}
      aria-hidden="true"
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[22deg] flex flex-col items-center justify-center text-center opacity-45 hover:opacity-55 transition-opacity pointer-events-none"
        style={{
          transformOrigin: 'center center',
          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25))',
        }}
      >
        {/* Subtle Line-Art Lotus Motif */}
        <svg
          viewBox="0 0 100 48"
          className={`${
            isPdp ? 'w-14 h-7 mb-0.5' : 'w-9 h-4.5 mb-0.5'
          } text-white fill-none stroke-current stroke-[1.5]`}
        >
          <path d="M50 4 C44 16 35 28 16 34 C34 35 44 28 50 44 C56 28 66 35 84 34 C65 28 56 16 50 4 Z" fill="rgba(255,255,255,0.08)" />
          <path d="M50 14 C46 22 40 28 28 34 C38 34 45 30 50 44 C55 30 62 34 72 34 C60 28 54 22 50 14 Z" fill="none" strokeWidth="1.2" />
          <circle cx="50" cy="20" r="2" fill="white" />
        </svg>

        {/* Main Brand Name in Fine Elegant Serif */}
        <span
          className={`font-serif font-normal text-white tracking-wide whitespace-nowrap ${
            isPdp ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-base sm:text-lg'
          }`}
          style={{
            letterSpacing: '0.07em',
          }}
        >
          Reoti Handloom
        </span>

        {/* Delicate Tagline with Thin Horizontal Lines */}
        <div className="flex items-center gap-2 mt-0.5 whitespace-nowrap">
          <span className={`${isPdp ? 'w-12 sm:w-16' : 'w-5 sm:w-7'} h-[0.75px] bg-white/70`} />
          <span
            className={`font-serif font-normal text-white/90 italic tracking-wider ${
              isPdp ? 'text-xs sm:text-sm' : 'text-[7.5px] sm:text-[8.5px]'
            }`}
          >
            Tradition Woven with Love
          </span>
          <span className={`${isPdp ? 'w-12 sm:w-16' : 'w-5 sm:w-7'} h-[0.75px] bg-white/70`} />
        </div>
      </div>
    </div>
  );
}
