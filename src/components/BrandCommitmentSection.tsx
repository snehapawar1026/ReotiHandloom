'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Award, ArrowRight, Crown, CheckCircle2, Feather, HeartHandshake } from 'lucide-react';

export const BrandCommitmentSection = () => {
  return (
    <section className="w-full bg-[#FAF7F2] border-t border-b border-amber-200/80 py-12 sm:py-16 font-sans text-gray-900 relative overflow-hidden">
      
      {/* Subtle Royal Background Gradients & Filigree Accents */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-200/35 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Layered Royal Visual Showcase */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-300/80 bg-neutral-950 group">
              
              {/* Main Showroom / Studio Photo */}
              <div className="w-full h-[320px] sm:h-[400px] overflow-hidden">
                <img
                  src="/studio/brand_commitment.jpg"
                  alt="Reoti Handloom Maheshwar Showroom & Pure Saree Heritage"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-105"
                />
              </div>

              {/* Gradient Shade */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

              {/* Top Luxury Pill */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 bg-[#4A121A]/95 text-amber-200 text-xs font-bold px-4 py-1.5 rounded-full border border-amber-400/50 backdrop-blur-md shadow-lg">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span className="tracking-wide">Estd. 1960 • Maheshwar Looms</span>
              </div>

              {/* Bottom In-Image Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-amber-200 shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 text-[#8B263E]">
                  <Award className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-serif font-extrabold text-xs sm:text-sm text-[#2D1214] truncate">
                    State Award Winner 1996
                  </p>
                  <p className="text-[11px] text-gray-600 truncate font-medium">
                    M.P. State Textile Corp. Certified Excellence
                  </p>
                </div>
              </div>
            </div>

            {/* 3-Column Stats Row Below Image */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="bg-white/90 border border-amber-200/90 rounded-2xl p-2.5 sm:p-3 text-center shadow-xs">
                <p className="font-serif font-black text-lg sm:text-2xl text-[#8B263E] leading-tight">60+</p>
                <p className="text-[10px] sm:text-[11px] text-gray-600 font-bold uppercase tracking-wider mt-0.5">Years Legacy</p>
              </div>
              <div className="bg-white/90 border border-amber-200/90 rounded-2xl p-2.5 sm:p-3 text-center shadow-xs">
                <p className="font-serif font-black text-lg sm:text-2xl text-[#8B263E] leading-tight">3rd</p>
                <p className="text-[10px] sm:text-[11px] text-gray-600 font-bold uppercase tracking-wider mt-0.5">Gen Weavers</p>
              </div>
              <div className="bg-white/90 border border-amber-200/90 rounded-2xl p-2.5 sm:p-3 text-center shadow-xs">
                <p className="font-serif font-black text-lg sm:text-2xl text-[#8B263E] leading-tight">100%</p>
                <p className="text-[10px] sm:text-[11px] text-gray-600 font-bold uppercase tracking-wider mt-0.5">Handloom</p>
              </div>
            </div>
          </div>

          {/* Right Column: Unique Reoti Editorial Content */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Tag Line */}
            <div className="flex items-center gap-2">
              <span className="w-6 h-[2px] bg-[#8B263E]" />
              <span className="text-xs font-extrabold tracking-[0.25em] text-[#8B263E] uppercase block font-sans">
                REOTI HANDLOOM MAHESHWAR
              </span>
            </div>

            {/* Headline */}
            <h2 className="font-serif font-extrabold text-2xl sm:text-4xl lg:text-[40px] text-[#2D1214] leading-[1.2] tracking-tight">
              Reoti Handloom: <span className="text-[#8B263E]">Trusted Manufacturer</span> of Maheshwari Sarees.
            </h2>

            {/* Narrative Paragraph */}
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
              Founded in 1960 by <strong className="font-bold text-[#2D1214]">Shri Lakshminarayan Ambekar</strong> and enriched across three generations of master weavers, <strong className="font-bold text-[#2D1214]">Reoti Handloom</strong> brings you the royal essence of Maheshwar. Every saree is woven with authentic Mulberry silk, hand-spun cotton, and tested zari on traditional wooden pit looms.
            </p>

            {/* 3 Luxury Value Cards */}
            <div className="space-y-2.5 pt-1">
              
              {/* Card 1 */}
              <div className="flex items-center gap-3.5 bg-white/95 border border-amber-200/90 rounded-2xl p-3.5 shadow-2xs hover:border-amber-400 hover:shadow-xs transition-all">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 text-[#8B263E]">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-gray-900">
                    Traditional Wooden Pit Looms
                  </h4>
                  <p className="text-[11px] sm:text-xs text-gray-600 font-normal">
                    Intricate hand-interlocked reversible <em className="italic font-serif text-rose-950 font-semibold">Bugdi & Zari</em> borders inspired by Maheshwar fort carvings.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="flex items-center gap-3.5 bg-white/95 border border-amber-200/90 rounded-2xl p-3.5 shadow-2xs hover:border-amber-400 hover:shadow-xs transition-all">
                <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0 text-[#8B263E]">
                  <Feather className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-gray-900">
                    Lightweight Comfort & Royal Lustre
                  </h4>
                  <p className="text-[11px] sm:text-xs text-gray-600 font-normal">
                    Gossamer silk-cotton texture offering all-day breathability, effortless pleating, and lasting elegance.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="flex items-center gap-3.5 bg-white/95 border border-amber-200/90 rounded-2xl p-3.5 shadow-2xs hover:border-amber-400 hover:shadow-xs transition-all">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-800">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-gray-900">
                    Direct Weaver-to-Wardrobe Transparency
                  </h4>
                  <p className="text-[11px] sm:text-xs text-gray-600 font-normal">
                    Zero middlemen markup—supporting local artisan families with fair wages and guaranteed handloom authenticity.
                  </p>
                </div>
              </div>

            </div>

            {/* Quote Stamp */}
            <p className="text-xs sm:text-sm text-[#8B263E] font-serif italic font-semibold border-l-2 border-[#8B263E] pl-3 py-0.5">
              “For us, every saree is not just handcrafted—it is woven with history, heritage, and generations of passion.”
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-[#581C1C] hover:bg-[#722323] text-amber-100 hover:text-white font-bold text-xs px-6 py-3 rounded-xl uppercase tracking-wider transition-all shadow-md hover:shadow-lg active:scale-98"
              >
                <span>Explore Our Heritage Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/products?category=maheshwari-sarees"
                className="inline-flex items-center gap-2 bg-white border-2 border-[#581C1C]/30 hover:border-[#581C1C] text-[#581C1C] font-bold text-xs px-5 py-3 rounded-xl uppercase tracking-wider transition-all hover:bg-rose-50/60 shadow-2xs"
              >
                <span>View Loom Collection</span>
              </Link>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
};
