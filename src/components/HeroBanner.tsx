'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
  link: string;
}

export const HeroBanner = () => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('/api/banners')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.banners.length > 0) {
          setBanners(data.banners);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  if (banners.length === 0) return null;

  const activeBanner = banners[currentIndex];

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[560px] bg-neutral-950 overflow-hidden font-sans group">
      {/* Background Image with Crisp Lighting & Vignette Overlay */}
      <div className="absolute inset-0">
        <img
          src={activeBanner.image}
          alt={activeBanner.title}
          className="w-full h-full object-cover object-center brightness-105 contrast-105 scale-105 transition-all duration-700"
        />
        {/* Luxury Gradient Veil */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-950/90 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      {/* Slide Content Overlay */}
      <div className="relative max-w-7xl mx-auto h-full px-6 sm:px-12 flex flex-col justify-center text-white space-y-4">
        {activeBanner.tag && (
          <span className="inline-flex items-center gap-1.5 self-start bg-gradient-to-r from-rose-700 to-amber-700 text-white font-extrabold text-[11px] px-3.5 py-1 rounded-full tracking-widest uppercase shadow-md border border-amber-300/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{activeBanner.tag}</span>
          </span>
        )}
        
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-amber-100 tracking-tight drop-shadow-2xl max-w-2xl leading-none">
          {activeBanner.title}
        </h1>
        
        <p className="text-sm sm:text-base text-amber-100/90 max-w-lg font-medium drop-shadow leading-relaxed">
          {activeBanner.subtitle}
        </p>

        <div className="pt-3 flex items-center gap-4">
          <Link
            href={activeBanner.link}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-amber-950 font-extrabold text-xs px-8 py-4 rounded-full uppercase tracking-widest shadow-xl transition-all active:scale-95 border border-amber-200"
          >
            <span>SHOP COLLECTION NOW</span>
          </Link>

          <span className="hidden sm:inline-block text-xs font-semibold text-amber-200 border-l border-amber-400/40 pl-4">
            100% Authentic Handloom Mark • Maheshwar Loom
          </span>
        </div>
      </div>

      {/* Prev / Next Buttons */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity border border-white/20"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity border border-white/20"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-5 inset-x-0 flex justify-center gap-2.5">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2.5 rounded-full transition-all ${
              idx === currentIndex ? 'bg-amber-400 w-8' : 'bg-white/40 w-2.5'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
