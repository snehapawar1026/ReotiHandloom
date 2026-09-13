'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
  Star,
  Lock,
  X,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const TrustQualityWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Bottom-Left Trigger Button (Royal Maroon & Gold) */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group bg-gradient-to-r from-amber-950 via-rose-950 to-neutral-950 text-amber-200 p-3.5 rounded-full shadow-2xl border-2 border-amber-400/80 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          aria-label="Reoti Handloom Store Quality & Trust Guarantee"
          title="Store Quality & Handloom Guarantee"
        >
          {/* Animated Gold Ring Pulsing */}
          <span className="absolute -inset-1 rounded-full bg-amber-400/30 animate-ping pointer-events-none"></span>

          {isOpen ? (
            <X className="w-5 h-5 text-amber-200" />
          ) : (
            <div className="flex items-center gap-1.5">
              <Award className="w-5 h-5 text-amber-400" />
              <span className="text-[10px] font-extrabold tracking-wider uppercase pr-1 hidden sm:inline-block">
                Trust Score
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Trust & Store Quality Popup Modal (Exact Royal Luxury Design) */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 sm:left-6 z-50 w-80 sm:w-96 max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-amber-300 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200 font-sans">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-950 via-rose-950 to-neutral-950 p-5 text-white relative border-b border-amber-800/60 shrink-0">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-amber-200/80 hover:text-white bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-amber-400 p-0.5 overflow-hidden bg-amber-100/30 shrink-0">
                <img
                  src="/logo.jpg"
                  alt="Reoti Handloom Logo"
                  className="w-full h-full object-cover object-top rounded-full"
                />
              </div>
              <div>
                <div className="flex items-center gap-1 text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">
                  <Sparkles className="w-3 h-3" />
                  <span>Maheshwar Loom Guarantee</span>
                </div>
                <h3 className="font-serif font-extrabold text-lg text-amber-100 leading-tight">
                  Store Quality & Trust
                </h3>
              </div>
            </div>
          </div>

          {/* Metrics List Body */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5 text-xs">
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed pb-1 border-b border-gray-100">
              Verified performance metrics for Reoti Handloom Maheshwar:
            </p>

            {/* 1. Craftmark & Authenticity */}
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-amber-50/40 border border-amber-200/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4.5 h-4.5 text-rose-800" />
                </div>
                <div>
                  <p className="font-bold text-amber-950 text-xs">Handloom Authenticity</p>
                  <p className="text-[10px] text-gray-500">Certified Craftmark & Handloom Mark</p>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 100% Genuine
              </span>
            </div>

            {/* 2. Express Shipping */}
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-amber-50/40 border border-amber-200/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                  <Truck className="w-4.5 h-4.5 text-rose-800" />
                </div>
                <div>
                  <p className="font-bold text-amber-950 text-xs">Shipping Speed</p>
                  <p className="text-[10px] text-gray-500">Free All India Doorstep Shipping</p>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Great
              </span>
            </div>

            {/* 3. Easy Returns */}
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-amber-50/40 border border-amber-200/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4.5 h-4.5 text-rose-800" />
                </div>
                <div>
                  <p className="font-bold text-amber-950 text-xs">Returns & Exchange</p>
                  <p className="text-[10px] text-gray-500">7 Days Hassle-Free Exchange Policy</p>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Good
              </span>
            </div>

            {/* 4. Google Reviews Rating */}
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-amber-50/40 border border-amber-200/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                  <Star className="w-4.5 h-4.5 text-amber-500 fill-amber-500" />
                </div>
                <div>
                  <p className="font-bold text-amber-950 text-xs">Google Rating</p>
                  <p className="text-[10px] text-gray-500">331+ Verified Customer Reviews</p>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 4.8 / 5.0
              </span>
            </div>

            {/* 5. Safe Payment */}
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-amber-50/40 border border-amber-200/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                  <Lock className="w-4.5 h-4.5 text-rose-800" />
                </div>
                <div>
                  <p className="font-bold text-amber-950 text-xs">Checkout Security</p>
                  <p className="text-[10px] text-gray-500">256-Bit SSL Encrypted & Safe Payments</p>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Secure
              </span>
            </div>

            {/* Bottom Button */}
            <div className="pt-1.5">
              <a
                href="https://www.google.com/search?q=reoti+handloom"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-gradient-to-r from-amber-950 via-rose-950 to-neutral-950 hover:from-black hover:to-rose-900 text-amber-100 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider"
              >
                <span>Read Google Store Reviews</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
              </a>
            </div>

          </div>

        </div>
      )}
    </>
  );
};
