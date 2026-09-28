'use client';

import React from 'react';
import Link from 'next/link';
import { RotateCcw, ShieldCheck, HelpCircle, ChevronRight } from 'lucide-react';

export default function ReturnPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 font-sans">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-8 font-medium">
        <Link href="/" className="hover:text-rose-600">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span>Policies</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-bold">Return & Refund Policy</span>
      </nav>

      {/* Main Policy Header */}
      <div className="text-center mb-10">
        <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center mx-auto mb-4 border border-amber-300">
          <RotateCcw className="w-7 h-7 text-amber-800" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-amber-950 tracking-tight">
          Return / Refund Policy
        </h1>
        <p className="text-xs sm:text-sm text-amber-800 italic mt-2 font-medium">
          Reoti Handloom Maheshwari • 7 Days Hassle-Free Returns & Exchange
        </p>
      </div>

      {/* Policy Content Card */}
      <div className="bg-white border border-amber-100 rounded-2xl shadow-sm p-6 sm:p-10 space-y-6 text-gray-700 font-medium leading-relaxed text-sm sm:text-base">
        <p>
          At <strong className="text-amber-950 font-bold">Reoti Handloom</strong>, we want you to be happy with your purchase. If you are not satisfied with your order, eligible products can be returned within <strong className="text-rose-700 font-bold">7 days of delivery</strong>, subject to the conditions mentioned below. Refunds will be processed within <strong className="text-amber-950 font-bold">2–5 working days</strong> after the returned product has been received and inspected, and the customer will be notified via email or WhatsApp.
        </p>

        {/* Conditions Bulleted List */}
        <div className="pt-2">
          <h2 className="font-serif font-extrabold text-base sm:text-lg text-amber-950 mb-3">
            Terms & Conditions for Returns:
          </h2>
          <ul className="space-y-3 text-xs sm:text-sm text-gray-800 font-medium list-none">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-2 shrink-0" />
              <span>Returns must be requested within <strong className="text-rose-700 font-bold">7 days of receiving the order</strong>.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-2 shrink-0" />
              <span>A flat <strong className="text-amber-950 font-bold">₹150 return shipping charge</strong> will be applicable.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-2 shrink-0" />
              <span>The product must be <strong className="text-amber-950 font-bold">unused, unworn, and in its original condition</strong>.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-2 shrink-0" />
              <span><strong className="text-[#8B2635] font-bold">Customization / Fall & Pico:</strong> Sarees tailored with complimentary Fall & Pico binding upon customer selection cannot be returned or exchanged once the work is completed.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-2 shrink-0" />
              <span>The product should be securely and properly packed by the customer for return.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-2 shrink-0" />
              <span>To initiate a return or refund, customers must submit a request through their <strong className="text-amber-950 font-bold">account section</strong> and inform our support team via WhatsApp at <a href="https://wa.me/919617444445" target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-bold underline">+91 9617444445</a>.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-2 shrink-0" />
              <span>Refunds are subject to verification and the applicable return conditions.</span>
            </li>
          </ul>
        </div>

        <p className="pt-2 text-xs sm:text-sm text-gray-600 italic border-t border-gray-100">
          For any questions regarding returns or refunds, please contact our customer support team.
        </p>

        {/* Highlight Guarantee Box */}
        <div className="mt-8 p-5 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2">
          <h3 className="font-serif font-bold text-base text-rose-950 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rose-700" />
            <span>100% Quality & Peace of Mind Guarantee</span>
          </h3>
          <p className="text-xs sm:text-sm text-rose-900 font-medium">
            Every Maheshwari Saree undergoes multi-tier quality check by our master weavers in Maheshwar prior to dispatch.
          </p>
        </div>
      </div>

      {/* Customer Support Action Box */}
      <div className="mt-10 bg-amber-950 text-amber-100 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="space-y-1">
          <h3 className="font-serif font-bold text-lg text-white">Need help initiating a return?</h3>
          <p className="text-xs text-amber-200/80">Message our customer assistance team directly on WhatsApp for quick pickup & refund updates.</p>
        </div>

        <a
          href="https://wa.me/919617444445?text=Hello%20Reoti%20Handloom%2C%20I%20want%20to%20initiate%20a%20return%2Fexchange%20request."
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all active:scale-95 shrink-0 flex items-center gap-2"
        >
          <HelpCircle className="w-4 h-4" />
          <span>CONTACT SUPPORT (+91 9617444445)</span>
        </a>
      </div>
    </div>
  );
}
