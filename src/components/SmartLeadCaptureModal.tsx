'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sparkles, X, Gift, Phone, CheckCircle2, MessageCircle, Copy, Check, ArrowRight } from 'lucide-react';

export function SmartLeadCaptureModal() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [couponCode, setCouponCode] = useState('WELCOME10');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Don't show on admin or checkout pages
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/reoti-studio-manage') || pathname.startsWith('/checkout')) {
      return;
    }

    const dismissedTime = localStorage.getItem('rh_lead_modal_dismissed');
    if (dismissedTime) {
      const daysPassed = (Date.now() - parseInt(dismissedTime, 10)) / (1000 * 60 * 60 * 24);
      if (daysPassed < 5) return; // Dismissed within 5 days
    }

    // Trigger popup after 8 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, [pathname]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('rh_lead_modal_dismissed', Date.now().toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      let productInterest = 'General Handloom Collection';
      if (pathname.startsWith('/products/')) {
        const h1 = document.querySelector('h1');
        if (h1?.textContent) productInterest = h1.textContent.trim();
      }

      let clientLocText = '';
      try {
        const cached = sessionStorage.getItem('rh_exact_loc');
        if (cached) {
          const parsed = JSON.parse(cached);
          clientLocText = parsed.locationText || `${parsed.city}, ${parsed.region}`;
        }
      } catch (e) {}

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          name: name || 'Valued Visitor',
          city: clientLocText || null,
          source: 'POPUP_OFFER',
          productInterest,
          productUrl: window.location.href,
          couponCode: 'WELCOME10',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsSubmitted(true);
        setCouponCode(data.couponCode || 'WELCOME10');
        localStorage.setItem('rh_lead_modal_dismissed', Date.now().toString());
      } else {
        setErrorMsg(data.error || 'Failed to submit. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-200/60 transform transition-all animate-scale-up">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 text-gray-700 hover:text-red-700 hover:bg-white shadow-md transition-all cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#4A0E17] via-[#63101E] to-[#4A0E17] text-amber-50 p-6 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/20 rounded-full blur-xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-rose-500/20 rounded-full blur-xl pointer-events-none"></div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Exclusive Welcome Offer
          </div>

          <h3 className="text-2xl font-serif font-extrabold text-amber-100 leading-tight">
            Flat 10% OFF + ₹300 Discount
          </h3>
          <p className="text-xs text-amber-200/90 mt-1">
            Direct from Maheshwar Fort Looms • 100% Handcrafted
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                Enter your Mobile / WhatsApp number to unlock your exclusive <strong>10% Discount Coupon Code</strong>!
              </p>

              {errorMsg && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5 text-center font-medium">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Mobile / WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 font-semibold text-sm">
                    +91
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="98260 00000"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4A0E17] focus:border-[#4A0E17] text-gray-900 text-sm font-semibold outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4A0E17] focus:border-[#4A0E17] text-gray-900 text-sm outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || phone.length < 10}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#4A0E17] to-[#780016] text-amber-100 font-bold text-sm rounded-xl shadow-lg hover:shadow-xl hover:from-[#5c131e] hover:to-[#8c001a] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Unlocking Coupon Code...</span>
                ) : (
                  <>
                    <Gift className="w-4 h-4 text-amber-300" /> Unlock 10% OFF Coupon Now
                  </>
                )}
              </button>

              <p className="text-[11px] text-gray-400 text-center">
                🔒 100% Secure • No spam ever
              </p>
            </form>
          ) : (
            <div className="text-center py-2 space-y-4 animate-fade-in">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-900">Congratulations! Your Coupon is Ready:</h4>
                <p className="text-xs text-gray-500 mt-0.5">Use this coupon code on your first order at checkout</p>
              </div>

              {/* Coupon Box */}
              <div className="bg-amber-50 border-2 border-dashed border-amber-400 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">First Order Promo Code</span>
                  <span className="text-2xl font-mono font-black text-[#4A0E17] tracking-widest">{couponCode}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCoupon}
                  className="px-4 py-2 bg-[#4A0E17] hover:bg-[#63101E] text-amber-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy Code
                    </>
                  )}
                </button>
              </div>

              {/* WhatsApp Live Video Assistance */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/919617444445?text=Hello%20Reoti%20Handloom,%20I%20got%20the%20coupon%20code%20${couponCode}%20and%20want%20to%20see%20sarees%20on%20video%20call!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4" /> Chat on WhatsApp for Live Video Call
                </a>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="text-xs text-gray-500 hover:text-gray-800 underline block mx-auto pt-1 cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
