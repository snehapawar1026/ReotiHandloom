'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';

const INSTA_URL = "https://www.instagram.com/reoti_handloom";

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export const InstagramFamousSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 font-sans">
      <div className="bg-gradient-to-r from-rose-50/70 via-amber-50/50 to-purple-50/70 border border-rose-100/80 rounded-3xl p-6 sm:p-10 text-center shadow-xs">
        <span className="text-xs font-extrabold tracking-[0.25em] uppercase text-rose-600 block mb-1">
          LOOM WEAVING & HERITAGE
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-extrabold text-gray-900 tracking-wide flex items-center justify-center gap-2">
          <InstagramIcon className="w-7 h-7 text-rose-600 shrink-0" />
          <span>Follow Us On Instagram @reoti_handloom</span>
        </h2>
        <div className="w-20 h-0.5 bg-rose-600/40 mx-auto mt-2.5 rounded-full mb-3" />
        <p className="text-xs sm:text-sm text-gray-600 font-medium text-center mb-5 max-w-2xl mx-auto">
          Official Instagram handle • Trending handloom saree collections & loom weaving stories from Maheshwar
        </p>
        <div className="flex justify-center">
          <a
            href={INSTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-rose-600 to-purple-600 hover:from-amber-600 hover:via-rose-700 hover:to-purple-700 text-white font-extrabold text-sm px-7 py-3 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Follow @reoti_handloom</span>
            <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
