'use client';

import React, { useState } from 'react';
import { X, Send, PhoneCall, Building2, User, Mail, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';

interface WholesaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WholesaleModal: React.FC<WholesaleModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    businessName: '',
    categoryInterest: 'Maheshwari Sarees (Bulk)',
    estimatedQuantity: '10-25 Pieces',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // Form submission logic or auto-open WhatsApp
      const text = `*New Wholesale & Bulk Inquiry - Reoti Handloom*\n\n` +
        `*Name:* ${formData.name}\n` +
        `*Phone:* ${formData.phone}\n` +
        `*Business:* ${formData.businessName || 'N/A'}\n` +
        `*Interest:* ${formData.categoryInterest}\n` +
        `*Quantity:* ${formData.estimatedQuantity}\n` +
        `*Message:* ${formData.message || 'N/A'}`;
      
      const whatsappUrl = `https://wa.me/919617444445?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
    }, 800);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-amber-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-rose-950 to-neutral-950 p-5 text-white relative">
          <button
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 text-amber-200/80 hover:text-white bg-white/10 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4" />
            <span>B2B & Bulk Purchasing</span>
          </div>

          <h3 className="font-serif font-extrabold text-2xl text-amber-100">
            Wholesale & Retail Partner Inquiry
          </h3>
          <p className="text-xs text-amber-200/80 mt-1 leading-relaxed">
            Get authentic Maheshwari Sarees directly from our looms at exclusive wholesale prices.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-serif font-extrabold text-xl text-gray-900">
                Inquiry Received!
              </h4>
              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                Opening WhatsApp to connect directly with our Maheshwar Wholesale Desk (+91 96174 44445).
              </p>
              <button
                onClick={handleResetAndClose}
                className="mt-4 px-6 py-2.5 bg-amber-900 text-amber-100 font-bold text-xs rounded-xl hover:bg-rose-900 transition-colors"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Your Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">WhatsApp / Phone *</label>
                  <div className="relative">
                    <PhoneCall className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-amber-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Boutique / Business Name</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      placeholder="e.g. Royal Heritage Silk"
                      className="w-full border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-amber-600"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Category Interest</label>
                  <select
                    value={formData.categoryInterest}
                    onChange={(e) => setFormData({ ...formData, categoryInterest: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white"
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
                  <label className="block text-gray-700 font-bold mb-1">Estimated Order Quantity</label>
                  <select
                    value={formData.estimatedQuantity}
                    onChange={(e) => setFormData({ ...formData, estimatedQuantity: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white"
                  >
                    <option value="10-25 Pieces">10 - 25 Pieces (Trial Lot)</option>
                    <option value="25-50 Pieces">25 - 50 Pieces</option>
                    <option value="50-100 Pieces">50 - 100 Pieces</option>
                    <option value="100+ Pieces">100+ Pieces (Wholesale Distributor)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Additional Requirements / Notes</label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Mention custom colors, design preferences, or delivery timeline..."
                    className="w-full border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-amber-900 via-rose-900 to-amber-950 text-amber-100 font-extrabold text-sm uppercase tracking-wider rounded-xl hover:shadow-lg hover:from-amber-950 hover:to-rose-950 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>Submit Wholesale Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
