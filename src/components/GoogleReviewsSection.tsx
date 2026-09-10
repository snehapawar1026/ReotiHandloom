'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Star, CheckCircle, ExternalLink, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const GOOGLE_MAPS_LINK = "https://www.google.com/search?q=reoti+handloom";

interface GoogleReviewItem {
  id?: string;
  author_name: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  city?: string;
  saree_image?: string;
}

export const GoogleReviewsSection = () => {
  const [rating, setRating] = useState<number>(4.8);
  const [totalReviews, setTotalReviews] = useState<number>(331);
  const [reviews, setReviews] = useState<GoogleReviewItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/google-reviews')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRating(data.rating || 4.8);
          setTotalReviews(data.totalReviews || 331);
          setReviews(data.reviews || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-slate-50 py-12 border-y border-gray-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Live Google Rating & Direct Search Link */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
          
          <a
            href={GOOGLE_MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 group cursor-pointer"
          >
            {/* Google Icon Badge */}
            <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
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
                <span className="text-2xl font-extrabold text-gray-900">{rating}</span>
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-600 underline ml-1 group-hover:text-blue-600 transition-colors">
                  {totalReviews}+ Google Reviews
                </span>
              </div>
              <p className="text-xs text-gray-600 font-medium mt-0.5">
                Reoti Handloom Maheshwari Sarees Manufacturers & Wholesalers • Maheshwar, MP
              </p>
            </div>
          </a>

          <div className="flex items-center gap-3">
            {/* Slider Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={scrollLeft}
                aria-label="Previous Review"
                className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-100 transition-colors shadow-xs"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollRight}
                aria-label="Next Review"
                className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-100 transition-colors shadow-xs"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <a
              href={GOOGLE_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white text-xs font-extrabold px-5 py-3 rounded-xl transition-all shadow-xs shrink-0"
            >
              <span>View All {totalReviews}+ Reviews on Google</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Dynamic Reviews Carousel */}
        {loading ? (
          <div className="py-12 flex items-center justify-center gap-2 text-xs font-bold text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
            <span>Fetching Live Google Business Reviews...</span>
          </div>
        ) : (
          <div
            ref={sliderRef}
            className="flex gap-5 overflow-x-auto scrollbar-none scroll-smooth pb-4 pt-1 px-1"
          >
            {reviews.map((rev, index) => (
              <a
                key={rev.id || index}
                href={GOOGLE_MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-80 sm:w-96 shrink-0 bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-amber-300 transition-all group cursor-pointer"
              >
                <div>
                  {/* User Profile Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      {rev.profile_photo_url ? (
                        <img
                          src={rev.profile_photo_url}
                          alt={rev.author_name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-900 font-bold text-sm flex items-center justify-center shrink-0">
                          {rev.author_name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-extrabold text-xs text-gray-900 flex items-center gap-1 group-hover:text-blue-600 transition-colors">
                          <span>{rev.author_name}</span>
                          <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-50 shrink-0" />
                        </h4>
                        <p className="text-[10px] text-gray-500 font-medium">
                          {rev.city || 'Google Business Customer'}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                      {rev.relative_time_description}
                    </span>
                  </div>

                  {/* Star Rating */}
                  <div className="flex items-center text-amber-400 mb-3">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  {/* Comment Text */}
                  <p className="text-xs text-gray-700 leading-relaxed font-normal mb-4">
                    &quot;{rev.text}&quot;
                  </p>
                </div>

                {/* Customer Saree Image Thumbnail */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {rev.saree_image && (
                      <img
                        src={rev.saree_image}
                        alt="Customer Saree"
                        className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0"
                      />
                    )}
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      <span>Verified Google Review</span>
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700 transition-colors" />
                </div>
              </a>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
