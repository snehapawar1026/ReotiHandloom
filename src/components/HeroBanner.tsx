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

const DEFAULT_BANNERS: BannerItem[] = [
  {
    id: 'b1',
    title: 'Get Ready For Upcoming Festivals with Royal Maheshwari Weaves',
    subtitle: 'Celebrate Navratri, Karwa Chauth, Dussehra & Diwali in authentic silk-cotton handloom sarees crafted at Maheshwar Fort looms.',
    image: '/uploads/festival_banner_stairs.jpg',
    tag: '✨ UPCOMING FESTIVE COLLECTION 2026',
    link: '/products',
  },
  {
    id: 'b2',
    title: 'Authentic Handcrafted Sarees for Every Joyous Celebration',
    subtitle: 'Lightweight drapes with gleaming reversible zari borders, woven with pure devotion by traditional master artisans.',
    image: '/uploads/festival_banner_friends.jpg',
    tag: '🌸 FESTIVE CELEBRATIONS • DIRECT FROM WEAVERS',
    link: '/products?category=silk-cotton-maheshwari',
  },
  {
    id: 'b3',
    title: 'Maharani Ahilyabai Holkar Royal Maheshwar Weaves',
    subtitle: 'Crafting authentic Maheshwari Sarees straight from Narmada ghat looms with 5th generation weaver craftsmanship.',
    image: '/uploads/maheshwari_legacy_banner.png',
    tag: 'ROYAL MAHESHWAR HERITAGE',
    link: '/products',
  },
];

export const HeroBanner = () => {
  const [banners, setBanners] = useState<BannerItem[]>(DEFAULT_BANNERS);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('/api/banners')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.banners) && data.banners.length > 0) {
          const cleaned = data.banners.filter((b: any) => !b.image?.includes('unsplash.com'));
          if (cleaned.length > 0) {
            setBanners(cleaned);
          } else {
            setBanners(DEFAULT_BANNERS);
          }
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

  const activeBanner = banners[currentIndex] || DEFAULT_BANNERS[0];

  return (
    <div className="relative w-full h-[340px] sm:h-[480px] lg:h-[560px] bg-neutral-950 overflow-hidden font-sans group">
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
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-12 flex flex-col justify-center text-white space-y-2.5 sm:space-y-4">
        {activeBanner.tag && (
          <span className="inline-flex items-center gap-1.5 self-start bg-gradient-to-r from-rose-700 to-amber-700 text-white font-extrabold text-[10px] sm:text-[11px] px-3 py-0.5 sm:py-1 rounded-full tracking-widest uppercase shadow-md border border-amber-300/30">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
            <span>{activeBanner.tag}</span>
          </span>
        )}
        
        <h1 className="text-2xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-amber-100 tracking-tight drop-shadow-2xl max-w-2xl leading-tight sm:leading-none">
          {activeBanner.title}
        </h1>
        
        <p className="text-xs sm:text-base text-amber-100/90 max-w-lg font-medium drop-shadow leading-relaxed line-clamp-2 sm:line-clamp-none">
          {activeBanner.subtitle}
        </p>

        <div className="pt-2 sm:pt-3 flex items-center gap-4">
          <Link
            href={activeBanner.link}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-amber-950 font-extrabold text-[11px] sm:text-xs px-5 sm:px-8 py-3 sm:py-4 rounded-full uppercase tracking-widest shadow-xl transition-all active:scale-95 border border-amber-200"
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
