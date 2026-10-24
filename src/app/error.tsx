'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    try {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'ERROR',
          title: `⚠️ Application Exception: ${error.message?.slice(0, 120) || 'Unexpected Error'}`,
          details: `Digest: ${error.digest || 'N/A'}\nStack: ${error.stack?.slice(0, 500) || 'N/A'}`,
          pageUrl: typeof window !== 'undefined' ? window.location.pathname : '/',
          pageTitle: 'Application Exception',
        }),
        keepalive: true,
      }).catch(() => {});
    } catch (e) {}

    console.error('[Reoti Handloom] Exception:', error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-20 text-center font-sans bg-[#FAF7F2]">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#E8DFC8] shadow-lg flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200/80 flex items-center justify-center text-[#581C1C] mb-5 shadow-2xs">
          <AlertCircle className="w-8 h-8" />
        </div>

        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#581C1C] mb-2 font-serif">
          Reoti Handloom Maheshwar
        </span>

        <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-gray-900 mb-3 tracking-tight">
          Something Went Wrong
        </h1>

        <p className="text-xs sm:text-sm text-gray-600 mb-8 leading-relaxed">
          An unexpected error occurred while loading this page. Our technical team has been automatically notified.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#581C1C] hover:bg-[#722424] text-amber-100 font-serif font-bold text-xs uppercase tracking-widest px-7 py-3.5 rounded-full transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Page</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-gray-800 border border-gray-300 font-serif font-bold text-xs uppercase tracking-widest px-7 py-3.5 rounded-full transition-all shadow-2xs active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-[#581C1C]" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
