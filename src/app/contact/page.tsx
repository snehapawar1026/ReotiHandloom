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
  Video,
  Camera,
  Play,
  User,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'General Inquiry',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const studioImages = [
    { src: '/studio/studio_2.jpg', title: 'Maheshwari Saree Stock & Display Cabinets', desc: 'Handcrafted Silk Cotton & Pure Silk Maheshwari sarees in display cabinets.' },
    { src: '/studio/studio_1.jpg', title: 'Home Studio & Sitting Lounge', desc: 'Warm seating area for client trials and exclusive saree selections.' },
    { src: '/studio/studio_3.jpg', title: 'Royal Display & Traditional Carpet', desc: 'Traditional Maheshwar home studio atmosphere for comfortable saree viewing.' },
    { src: '/studio/studio_4.jpg', title: 'Authentic Handloom Inventory', desc: 'Directly woven by Maheshwar artisans & natural print craftsmen.' },
    { src: '/studio/studio_5.jpg', title: 'Dispatch & Order Packing Desk', desc: 'Quality checked and securely packaged sarees ready to ship all over India.' },
  ];

  // Auto-play slideshow every 4 seconds
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
      const text = `*New Contact Inquiry - Reoti Handloom*\n\n` +
        `*Name:* ${formData.name}\n` +
        `*Email:* ${formData.email || 'N/A'}\n` +
        `*Phone:* ${formData.phone}\n` +
        `*Type:* ${formData.inquiryType}\n` +
        `*Message:* ${formData.message}`;
      
      const whatsappUrl = `https://wa.me/919617444445?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
    }, 1000);
  };

  return (
    <div className="bg-amber-50/20 font-sans">
      
      {/* 1. Top Split Hero Section (Image on Left, Direct Contact / WhatsApp Info on Right) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white border border-amber-200 rounded-3xl p-6 sm:p-10 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Studio Photo Showcase Banner Slider */}
          <div className="lg:col-span-6 relative w-full h-[320px] sm:h-[420px] rounded-2xl overflow-hidden shadow-md border border-amber-200 bg-neutral-950 group">
            <img
              src={studioImages[currentSlide].src}
              alt={studioImages[currentSlide].title}
              className="w-full h-full object-cover object-center transition-all duration-700 brightness-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Bottom Overlay info */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h4 className="font-serif font-bold text-base sm:text-lg text-amber-100 drop-shadow">
                {studioImages[currentSlide].title}
              </h4>
            </div>

            {/* Arrows */}
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
            <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-bold text-amber-900 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-rose-700" />
              <span>REACH OUT TO REOTI HANDLOOM</span>
            </div>

            <h1 className="font-serif font-extrabold text-2xl sm:text-4xl text-amber-950 leading-tight">
              For Saree Purchase, Custom Orders & Wholesale, Kindly Connect on WhatsApp or Call
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
                href="https://wa.me/919617444445?text=Hi%20Reoti%20Handloom%2C%20I%20have%20an%20inquiry%20regarding%20sarees%2Fwholesale"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href="tel:+919617444445"
                className="px-6 py-3.5 bg-gradient-to-r from-amber-950 to-rose-950 hover:from-black hover:to-rose-900 text-amber-100 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Call Now</span>
              </a>
            </div>

            <div className="pt-2 border-t border-amber-100 grid grid-cols-2 gap-4 text-xs text-gray-700">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-700 shrink-0" />
                <span>73, Laxmibai Marg, Maheshwar, M.P. 451224</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-700 shrink-0" />
                <span className="truncate">reotihandloom@hotmail.com</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Contact Info Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Home Studio Address */}
          <div className="bg-white border border-amber-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3">
            <div>
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center mb-3">
                <Home className="w-6 h-6 text-rose-700" />
              </div>
              <h3 className="font-serif font-bold text-lg text-amber-950">Home Studio Address</h3>
              <p className="text-xs text-gray-600 leading-relaxed mt-1">
                73, Laxmibai Marg, Maheshwar, Distt. Khargone, Madhya Pradesh - 451224, India
              </p>
            </div>
            <div className="pt-2 text-[11px] font-bold text-rose-800 border-t border-amber-100">
              🏡 Family Home Studio & Handloom Loom
            </div>
          </div>

          {/* Direct Phone & WhatsApp */}
          <div className="bg-white border border-amber-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3">
            <div>
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center mb-3">
                <Phone className="w-6 h-6 text-rose-700" />
              </div>
              <h3 className="font-serif font-bold text-lg text-amber-950">Phone & WhatsApp</h3>
              <div className="space-y-1.5 text-xs text-gray-700 mt-2">
                <p className="flex items-center justify-between">
                  <span className="text-gray-500">Direct Call:</span>
                  <a href="tel:+919617444445" className="font-bold text-amber-950 hover:underline">+91 96174 44445</a>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-gray-500">WhatsApp:</span>
                  <a href="https://wa.me/919617444445" target="_blank" rel="noreferrer" className="font-extrabold text-emerald-700 hover:underline">+91 96174 44445</a>
                </p>
              </div>
            </div>
            <div className="pt-2 text-[11px] text-gray-500 flex items-center gap-1 border-t border-amber-100">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>10:00 AM – 8:30 PM (All Days Open)</span>
            </div>
          </div>

          {/* Email & Support */}
          <div className="bg-white border border-amber-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3">
            <div>
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center mb-3">
                <Mail className="w-6 h-6 text-rose-700" />
              </div>
              <h3 className="font-serif font-bold text-lg text-amber-950">Email Support</h3>
              <p className="text-xs text-gray-600 leading-relaxed mt-1">
                For online order inquiries, custom weaving requests, or boutique wholesale:
              </p>
            </div>
            <a href="mailto:reotihandloom@hotmail.com" className="text-xs font-bold text-rose-800 hover:underline border-t border-amber-100 pt-2 block truncate">
              reotihandloom@hotmail.com
            </a>
          </div>

          {/* Google Ratings & Trust */}
          <div className="bg-gradient-to-br from-amber-900 via-rose-950 to-amber-950 text-amber-100 rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <h3 className="font-serif font-bold text-lg text-white">4.8 Rating on Google</h3>
              <p className="text-xs text-amber-200/80 leading-relaxed">
                Trusted by 10,000+ Maheshwari saree lovers across India & worldwide.
              </p>
            </div>
            <a
              href="https://www.google.com/search?q=reoti+handloom"
              target="_blank"
              rel="noreferrer"
              className="inline-block px-3 py-2 bg-amber-800/80 hover:bg-amber-800 text-center text-xs font-bold text-amber-200 rounded-xl transition-colors"
            >
              View 331+ Google Reviews &rarr;
            </a>
          </div>

        </div>
      </section>

      {/* 3. Enquiry Form Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white border border-amber-200 rounded-3xl p-6 sm:p-10 shadow-lg">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
            <h2 className="font-serif font-extrabold text-2xl sm:text-4xl text-amber-950">
              Submit Your Enquiry
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Complete the form below and our Maheshwar loom team will get back to you shortly.
            </p>
          </div>

          {isSubmitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-gray-900">
                Thank You for Reaching Out!
              </h3>
              <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                Your enquiry has been received. Opening WhatsApp to connect with our Maheshwar support team immediately.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 px-6 py-2.5 bg-amber-950 text-amber-100 font-bold text-xs rounded-xl hover:bg-rose-900 transition-colors"
              >
                Send Another Enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 font-medium text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-800 font-bold mb-1">Your Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                      className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-700 bg-amber-50/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-800 font-bold mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. name@example.com"
                      className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-700 bg-amber-50/20"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-800 font-bold mb-1">Phone / WhatsApp Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-700 bg-amber-50/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-800 font-bold mb-1">Inquiry Topic</label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl py-3 px-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-700 bg-white"
                  >
                    <option value="General Inquiry">General Saree Inquiry</option>
                    <option value="Order Status">Order Tracking / Status</option>
                    <option value="Wholesale & Bulk Order">Wholesale & Bulk Inquiry</option>
                    <option value="Home Studio Visit">Home Studio Visit Appointment</option>
                    <option value="Custom Saree Weaving">Custom Weaving Request</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-800 font-bold mb-1">Your Message *</label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your message or product requirements here..."
                    className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-700 bg-amber-50/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-amber-950 via-rose-950 to-neutral-950 text-amber-100 font-extrabold text-sm uppercase tracking-widest rounded-xl hover:shadow-xl hover:from-black hover:to-rose-950 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>Send Message & Enquiry</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 4. Google Maps Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-8">
        <div className="bg-white border border-amber-200 rounded-3xl overflow-hidden shadow-md">
          <div className="p-6 sm:p-8 bg-amber-50/50 border-b border-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-extrabold text-rose-700 uppercase tracking-widest">
                VISIT OUR MAHESHWAR LOCATION
              </span>
              <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-amber-950 mt-1">
                Find Us On Google Map
              </h2>
            </div>
            <a
              href="https://maps.google.com/?q=Reoti+Handloom+Maheshwar"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-950 text-amber-100 rounded-xl font-bold text-xs hover:bg-rose-950 transition-colors shrink-0"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Open in Google Maps</span>
            </a>
          </div>

          <div className="w-full h-80 sm:h-96 relative bg-gray-100">
            <iframe
              title="Reoti Handloom Maheshwar Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3695.7725902181745!2d75.5802!3d22.1776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962450000000001%3A0x0!2zMjLCsDEwJzM5LjMiTiA3NcKwMzQnNDguOCJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full grayscale-[20%] contrast-105"
            ></iframe>
          </div>
        </div>
      </section>

    </div>
  );
}
