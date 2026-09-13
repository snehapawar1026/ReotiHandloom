'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Star,
  Home,
  Building2,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Tag,
} from 'lucide-react';

export default function WholesalePage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    businessName: '',
    categoryInterest: 'Maheshwari Sarees (Bulk)',
    estimatedQuantity: '10-25 Pieces',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const studioImages = [
    { src: '/studio/studio_2.jpg', title: 'Maheshwari Saree Stock & Display Cabinets', desc: 'Bulk Maheshwari Silk Cotton & Pure Silk Saree Stock.' },
    { src: '/studio/studio_4.jpg', title: 'Authentic Handloom Inventory', desc: 'Direct loom inventory directly from Maheshwar weavers.' },
    { src: '/studio/studio_5.jpg', title: 'Dispatch & Wholesale Packing Desk', desc: 'Bulk orders packaged securely for express shipping all over India.' },
    { src: '/studio/studio_1.jpg', title: 'Home Studio Lounge', desc: 'Comfortable atmosphere for boutique buyers and bulk clients.' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % studioImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [studioImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % studioImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? studioImages.length - 1 : prev - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    setTimeout(() => {
      const text = `*New Wholesale & Bulk Order Inquiry - Reoti Handloom*\n\n` +
        `*Name:* ${formData.name}\n` +
        `*Phone:* ${formData.phone}\n` +
        `*Business:* ${formData.businessName || 'N/A'}\n` +
        `*Interest:* ${formData.categoryInterest}\n` +
        `*Quantity:* ${formData.estimatedQuantity}\n` +
        `*Message:* ${formData.message || 'N/A'}`;
      
      const whatsappUrl = `https://wa.me/919617444445?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
    }, 1000);
  };

  return (
    <div className="bg-amber-50/20 font-sans">
      
      {/* 1. Top Split Hero Section (Image on Left, Direct Contact / WhatsApp Info on Right) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white border border-amber-200 rounded-3xl p-6 sm:p-10 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Studio Inventory Image Showcase */}
          <div className="lg:col-span-6 relative w-full h-[320px] sm:h-[420px] rounded-2xl overflow-hidden shadow-md border border-amber-200 bg-neutral-950 group">
            <img
              src={studioImages[currentSlide].src}
              alt={studioImages[currentSlide].title}
              className="w-full h-full object-cover object-center transition-all duration-700 brightness-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h4 className="font-serif font-bold text-base sm:text-lg text-amber-100 drop-shadow">
                {studioImages[currentSlide].title}
              </h4>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-rose-900 text-white flex items-center justify-center backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all border border-amber-300/30"
            >
              <ChevronLeft className="w-5 h-5 text-amber-200" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-rose-900 text-white flex items-center justify-center backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all border border-amber-300/30"
            >
              <ChevronRight className="w-5 h-5 text-amber-200" />
            </button>
          </div>

          {/* Right Column: Direct Contact & Wholesale Callout */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-900 to-rose-900 text-amber-100 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-xs">
              <Tag className="w-3.5 h-3.5 text-amber-300" />
              <span>DIRECT FROM MAHESHWAR LOOMS</span>
            </div>

            <h1 className="font-serif font-extrabold text-2xl sm:text-4xl text-amber-950 leading-tight">
              For Wholesale / Bulk Purchase, Kindly Connect on WhatsApp or Call @
            </h1>

            <div className="bg-amber-50/70 border-l-4 border-rose-700 p-4 rounded-r-2xl space-y-2">
              <div className="text-2xl sm:text-4xl font-extrabold font-serif text-rose-900 tracking-tight flex items-center gap-3">
                <Phone className="w-7 h-7 text-rose-700 shrink-0" />
                <a href="tel:+919617444445" className="hover:underline">+91 96174 44445</a>
              </div>
              <p className="text-xs text-amber-900/90 font-medium">
                Please contact us All Days from <strong className="text-amber-950 font-bold">10:00 AM to 8:30 PM IST</strong>
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-1">
              <a
                href="https://wa.me/919617444445?text=Hi%20Reoti%20Handloom%2C%20I%20want%20to%20inquire%20about%20Wholesale%20%2F%20Bulk%20Saree%20Purchasing"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Wholesale Inquiry on WhatsApp</span>
              </a>

              <a
                href="tel:+919617444445"
                className="px-6 py-3.5 bg-gradient-to-r from-amber-950 to-rose-950 hover:from-black hover:to-rose-900 text-amber-100 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Call Wholesale Desk</span>
              </a>
            </div>

            <div className="pt-2 border-t border-amber-100 grid grid-cols-2 gap-4 text-xs text-gray-700">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-rose-700 shrink-0" />
                <span>B2B & Retail Partner Desk</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-700 shrink-0" />
                <span>Maheshwar Weaving Loom Studio</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Wholesale Inquiry Form Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white border border-amber-200 rounded-3xl p-6 sm:p-10 shadow-lg">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
            <h2 className="font-serif font-extrabold text-2xl sm:text-4xl text-amber-950">
              Wholesale / Bulk Inquiry Form
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Complete the form below and our Maheshwar wholesale desk will respond with catalog & price list.
            </p>
          </div>

          {isSubmitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-gray-900">
                Inquiry Submitted Successfully!
              </h3>
              <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                Opening WhatsApp to connect directly with our Maheshwar Wholesale Desk (+91 96174 44445).
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 px-6 py-2.5 bg-amber-950 text-amber-100 font-bold text-xs rounded-xl hover:bg-rose-900 transition-colors"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 font-medium text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-800 font-bold mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full border border-gray-200 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-700 bg-amber-50/20"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-bold mb-1">Boutique / Business Name</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="e.g. Ananya Silks Boutique"
                    className="w-full border border-gray-200 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-700 bg-amber-50/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-800 font-bold mb-1">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full border border-gray-200 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-700 bg-amber-50/20"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. name@example.com"
                    className="w-full border border-gray-200 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-700 bg-amber-50/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-800 font-bold mb-1">Category Interest</label>
                  <select
                    value={formData.categoryInterest}
                    onChange={(e) => setFormData({ ...formData, categoryInterest: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl py-3 px-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-700 bg-white"
                  >
                    <option value="Maheshwari Sarees (Bulk)">Maheshwari Sarees (Bulk)</option>
                    <option value="Silk Cotton Sarees">Silk Cotton Sarees</option>
                    <option value="Pure Silk Sarees">Pure Mulberry Silk Sarees</option>
                    <option value="Tissue Zari Sarees">Tissue Zari Sarees</option>
                    <option value="Garbha Reshami Special">Garbha Reshami Sarees</option>
                    <option value="Maheshwari Suit Sets">Maheshwari Dress Material / Suits</option>
                    <option value="Bagh Print Suits & Sarees">Bagh Print Collection</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-800 font-bold mb-1">Estimated Quantity</label>
                  <select
                    value={formData.estimatedQuantity}
                    onChange={(e) => setFormData({ ...formData, estimatedQuantity: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl py-3 px-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-700 bg-white"
                  >
                    <option value="10-25 Pieces">10 - 25 Pieces (Trial Order)</option>
                    <option value="25-50 Pieces">25 - 50 Pieces</option>
                    <option value="50-100 Pieces">50 - 100 Pieces</option>
                    <option value="100+ Pieces">100+ Pieces (Wholesale Distributor)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-800 font-bold mb-1">Your Requirements / Message *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Mention custom colors, design preferences, or wholesale inquiry details..."
                  className="w-full border border-gray-200 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-700 bg-amber-50/20"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-amber-950 via-rose-950 to-neutral-950 text-amber-100 font-extrabold text-sm uppercase tracking-widest rounded-xl hover:shadow-xl hover:from-black hover:to-rose-950 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>Submit Wholesale Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
