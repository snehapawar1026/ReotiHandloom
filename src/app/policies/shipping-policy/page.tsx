'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, HelpCircle, ChevronRight } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 font-sans">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-8 font-medium">
        <Link href="/" className="hover:text-rose-600">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span>Policies</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-bold">Shipping Policy</span>
      </nav>

      {/* Main Policy Header */}
      <div className="text-center mb-10">
        <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center mx-auto mb-4 border border-amber-300">
          <Truck className="w-7 h-7 text-amber-800" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-amber-950 tracking-tight">
          Shipping policy
        </h1>
        <p className="text-xs sm:text-sm text-amber-800 italic mt-2 font-medium">
          Reoti Handloom Maheshwari • Dispatch & Delivery Guidelines
        </p>
      </div>

      {/* Policy Content Card */}
      <div className="bg-white border border-amber-100 rounded-2xl shadow-sm p-6 sm:p-10 space-y-6 text-gray-700 font-medium leading-relaxed text-sm sm:text-base">
        <p>
          At Reoti Handloom, we take great care to make sure your handloom products reach you safely and on time. We provide delivery services throughout India and work with trusted courier partners for a smooth and secure shipping experience. Orders are packed with care and dispatched at the earliest possible time. Delivery timelines and applicable shipping charges may vary depending on the destination and order details, with tracking information provided once your order has been shipped. For any assistance or shipping-related questions, please feel free to contact our customer support team.
        </p>

        <p className="pt-2 text-gray-600">
          Please note that shipping timelines and related information may be subject to change. We recommend checking the latest Shipping Policy available on the Reoti Handloom website for complete and updated details.
        </p>

        {/* Highlight Guarantee Box */}
        <div className="mt-8 p-5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
          <h3 className="font-serif font-bold text-base text-amber-950 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-700" />
            <span>Maheshwar Loom Direct Doorstep Shipping</span>
          </h3>
          <ul className="text-xs sm:text-sm text-amber-900 space-y-1.5 font-semibold list-disc list-inside">
            <li>Express dispatch within 24-48 business hours.</li>
            <li>Free shipping across India on all handloom orders.</li>
            <li>Real-time tracking link shared via WhatsApp & SMS.</li>
          </ul>
        </div>
      </div>

      {/* Customer Assistance Action Box */}
      <div className="mt-10 bg-amber-950 text-amber-100 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="space-y-1">
          <h3 className="font-serif font-bold text-lg text-white">Need help with your shipment?</h3>
          <p className="text-xs text-amber-200/80">Our Maheshwar support team is available to assist you with order status & tracking.</p>
        </div>

        <a
          href="https://wa.me/919617444445?text=Hello%20Reoti%20Handloom%2C%20I%20have%20a%20query%20regarding%20shipping%20and%20delivery."
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all active:scale-95 shrink-0 flex items-center gap-2"
        >
          <HelpCircle className="w-4 h-4" />
          <span>CONTACT SUPPORT</span>
        </a>
      </div>
    </div>
  );
}
