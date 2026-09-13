'use client';

import React from 'react';
import Link from 'next/link';

export const BrandCommitmentSection = () => {
  return (
    <section className="w-full bg-[#FAF7F2] border-t border-b border-amber-200/60 py-10 sm:py-14 font-sans text-gray-900 relative">
      
      {/* 2-Column Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Stacked Saree Image */}
        <div className="lg:col-span-5 relative w-full h-[300px] sm:h-[380px] rounded-2xl overflow-hidden shadow-lg border border-amber-200/90 group">
          <img
            src="/studio/brand_commitment.jpg"
            alt="Reoti Handloom Maheshwar Home Studio & Saree Collection"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* Right Column: Reoti Handloom Brand Commitment Text */}
        <div className="lg:col-span-7 space-y-4">
          <span className="text-xs font-extrabold tracking-[0.25em] text-[#8B263E] uppercase block">
            REOTI HANDLOOM MAHESHWAR
          </span>

          <h2 className="font-serif font-extrabold text-2xl sm:text-4xl text-gray-900 leading-tight">
            Reoti Handloom: Trusted Manufacturer of Maheshwari Sarees.
          </h2>

          <div className="space-y-2 text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
            <p className="font-bold text-gray-900 text-xs sm:text-sm">
              Our Commitment to Sustainability & Handloom Craftsmanship:
            </p>
            <p className="text-gray-600">
              Reoti Handloom believes in making sustainable handwoven sarees by using high quality threads and skilled weaving that makes every Maheshwari Saree authentic, lightweight, and long-lasting. We take pride in preserving 5th generation Maheshwar loom heritage.
            </p>
            <p className="text-gray-600">
              We assure proudly genuine Handwoven Silk-Cotton, Pure Mulberry Silk, Tissue Zari, and Hand-block print products made using eco-friendly natural dyes free from harmful chemicals.
            </p>
          </div>

          <div className="pt-3">
            <Link
              href="/about"
              className="inline-block border-2 border-[#581C1C] text-[#581C1C] hover:bg-[#581C1C] hover:text-amber-100 font-extrabold text-xs px-6 py-2.5 rounded-lg uppercase tracking-wider transition-all shadow-xs"
            >
              Know More About Us
            </Link>
          </div>
        </div>

      </div>

    </section>
  );
};
