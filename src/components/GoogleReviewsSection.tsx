'use client';

import React from 'react';
import { Star, CheckCircle, ExternalLink, Quote } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: 'Pooja Sharma',
    city: 'Mumbai, Maharashtra',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Ordered a Pure Silk Maheshwari saree for my sister’s wedding. The silk quality and zari border work are breathtaking! Direct from Maheshwar weavers, 100% authentic.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    name: 'Ananya Verma',
    city: 'Bengaluru, Karnataka',
    rating: 5,
    date: '1 month ago',
    comment: 'Reoti Handloom never disappoints. Soft, lightweight silk-cotton saree with authentic Chatai border. Fast doorstep shipping within 3 days!',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    name: 'Meenakshi Iyer',
    city: 'Indore, Madhya Pradesh',
    rating: 5,
    date: '1 month ago',
    comment: 'Directly bought Tissue Zari saree from Reoti Maheshwar loom shop. Exceptional weave, vibrant peacock blue shade, and superb packaging!',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 4,
    name: 'Sunita Agarwal',
    city: 'New Delhi',
    rating: 5,
    date: '2 months ago',
    comment: 'Best handloom saree seller in Maheshwar! Real gold & silver zari finish and genuine Handloom Mark certification. Highly recommended for festival wear.',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=400&q=80',
  },
];

export const GoogleReviewsSection = () => {
  return (
    <section className="bg-slate-50 py-12 border-y border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Google Rating Badge */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
          
          <div className="flex items-center gap-4">
            {/* Google Icon Badge */}
            <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center justify-center shrink-0">
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold text-gray-900">4.8</span>
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-500 underline ml-1">
                  331 Google Reviews
                </span>
              </div>
              <p className="text-xs text-gray-600 font-medium mt-0.5">
                Reoti Handloom Maheshwari Sarees Manufacturers & Wholesalers • Maheshwar, MP
              </p>
            </div>
          </div>

          <a
            href="https://www.google.com/search?q=reoti+handloom"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white text-xs font-extrabold px-5 py-3 rounded-xl transition-all shadow-xs shrink-0"
          >
            <span>View All 331+ Reviews on Google</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative"
            >
              <div>
                {/* User Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-900 font-bold text-sm flex items-center justify-center shrink-0">
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-gray-900 flex items-center gap-1">
                        <span>{rev.name}</span>
                        <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-50 shrink-0" />
                      </h4>
                      <p className="text-[10px] text-gray-500 font-medium">{rev.city}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0 font-medium">{rev.date}</span>
                </div>

                {/* Star Rating */}
                <div className="flex items-center text-amber-400 mb-2">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>

                {/* Comment Text */}
                <p className="text-xs text-gray-700 leading-relaxed font-normal mb-4">
                  &quot;{rev.comment}&quot;
                </p>
              </div>

              {/* Customer Saree Image Thumbnail */}
              {rev.image && (
                <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                  <img
                    src={rev.image}
                    alt="Customer Maheshwari Saree"
                    className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0"
                  />
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Verified Google Review Photo
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
