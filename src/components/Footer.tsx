'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RefreshCw, Phone, MapPin, Mail, Sparkles, Star } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-amber-950 text-amber-100 font-sans border-t-4 border-amber-600">
      {/* Handloom Quality Guarantee Strip */}
      <div className="bg-amber-900 border-b border-amber-800/80 py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center space-y-2 p-2">
            <div className="w-12 h-12 rounded-full bg-amber-800 text-amber-200 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-sm text-white">100% Authentic Handloom</h4>
            <p className="text-xs text-amber-200/80">Certified Craftmark & Handloom Mark directly from Maheshwar weavers.</p>
          </div>

          <div className="flex flex-col items-center space-y-2 p-2">
            <div className="w-12 h-12 rounded-full bg-amber-800 text-amber-200 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-sm text-white">Express All India Delivery</h4>
            <p className="text-xs text-amber-200/80">Free doorstep shipping with real-time tracking updates.</p>
          </div>

          <div className="flex flex-col items-center space-y-2 p-2">
            <div className="w-12 h-12 rounded-full bg-amber-800 text-amber-200 flex items-center justify-center">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-sm text-white">7 Days Easy Returns</h4>
            <p className="text-xs text-amber-200/80">Hassle-free exchange & return policy for supreme peace of mind.</p>
          </div>

          <div className="flex flex-col items-center space-y-2 p-2">
            <div className="w-12 h-12 rounded-full bg-amber-800 text-amber-200 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-sm text-white">Ahilya Fort Heritage</h4>
            <p className="text-xs text-amber-200/80">Preserving centuries-old royal weaving techniques of Maharani Ahilyabai Holkar.</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
        
        {/* Brand info with Official Circle Logo */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 p-0.5 bg-amber-100/50 shrink-0">
              <img src="/logo.jpg" alt="Reoti Handloom" className="w-full h-full object-cover object-top rounded-full" />
            </div>
            <div>
              <span className="font-serif font-extrabold text-xl tracking-wide text-amber-100 block">
                Reoti Handloom
              </span>
              <span className="text-[10px] text-amber-300 italic font-semibold">
                Something &quot;more&quot; in Maheshwari Handloom
              </span>
            </div>
          </div>
          <p className="text-amber-200/75 leading-relaxed pt-1">
            Reoti Handloom is a premier brand dedicated to crafting authentic Maheshwari Sarees. We bring royal craftsmanship, rich zari borders, and lightweight silk-cotton textures straight from Maheshwar looms to your doorstep.
          </p>

          {/* Google Rating Badge */}
          <div className="pt-2">
            <a
              href="https://www.google.com/search?q=reoti+handloom"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-amber-900/80 hover:bg-amber-900 border border-amber-700/60 px-3 py-1.5 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-1 text-amber-400">
                <span className="font-extrabold text-xs text-white">4.8</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <span className="text-[10px] text-amber-200 font-bold border-l border-amber-800 pl-2">
                331 Google Reviews
              </span>
            </a>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider mb-4 border-b border-amber-800 pb-2">
            MAHESHWARI SAREES
          </h4>
          <ul className="space-y-2.5 text-amber-200/80 font-medium">
            <li>
              <Link href="/products?category=silk-cotton-maheshwari" className="hover:text-amber-400 transition-colors">
                Silk Cotton Sarees
              </Link>
            </li>
            <li>
              <Link href="/products?category=pure-silk-maheshwari" className="hover:text-amber-400 transition-colors">
                Pure Mulberry Silk Sarees
              </Link>
            </li>
            <li>
              <Link href="/products?category=tissue-zari-maheshwari" className="hover:text-amber-400 transition-colors">
                Tissue Zari Shimmer Collection
              </Link>
            </li>
            <li>
              <Link href="/products?category=chatai-border-special" className="hover:text-amber-400 transition-colors">
                Chatai Border Reversible Sarees
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-amber-400 transition-colors">
                New Festive Arrivals 2026
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider mb-4 border-b border-amber-800 pb-2">
            CUSTOMER ASSISTANCE
          </h4>
          <ul className="space-y-2.5 text-amber-200/80 font-medium">
            <li><Link href="/products" className="hover:text-amber-400">Track Order Status</Link></li>
            <li><Link href="/wishlist" className="hover:text-amber-400">My Wishlist</Link></li>
            <li><span className="hover:text-amber-400">Handloom Care Instructions</span></li>
            <li><span className="hover:text-amber-400">Shipping & Delivery Policy</span></li>
            <li><span className="hover:text-amber-400">Returns & Refund Policy</span></li>
          </ul>
        </div>

        {/* Address & Contact */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider mb-4 border-b border-amber-800 pb-2">
            ADDRESS & CONTACT
          </h4>
          <div className="space-y-2 text-amber-200/80">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>73, Laxmibai Marg, Maheshwar, Madhya Pradesh 451224</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <span>+91 96174 44445</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span>reotihandloom@hotmail.com</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="bg-amber-950 py-4 border-t border-amber-900 text-center text-[11px] text-amber-300/60 font-medium">
        <p>© 2026 Reoti Handloom Maheshwar. All Rights Reserved. Something &quot;more&quot; in Maheshwari Handloom.</p>
      </div>
    </footer>
  );
};
