'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { HeroBanner } from '@/components/HeroBanner';
import { FestiveArchSection } from '@/components/FestiveArchSection';
import { GoogleReviewsSection } from '@/components/GoogleReviewsSection';
import { InstagramFamousSection } from '@/components/InstagramFamousSection';
import { ProductCard } from '@/components/ProductCard';
import { ProductItem } from '@/context/ShopContext';
import { Sparkles, ArrowRight } from 'lucide-react';

const CATEGORY_STRIP = [
  { name: 'Westernwear', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80', link: '/products?category=silk-cotton-maheshwari' },
  { name: 'Indianwear', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80', link: '/products?category=pure-silk-maheshwari' },
  { name: 'Silk Cotton', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80', link: '/products?category=silk-cotton-maheshwari' },
  { name: 'Pure Silk', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80', link: '/products?category=pure-silk-maheshwari' },
  { name: 'Tissue Zari', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80', link: '/products?category=tissue-zari-maheshwari' },
  { name: 'Chatai Border', image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=400&q=80', link: '/products?category=chatai-border-special' },
  { name: 'Festive Sarees', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80', link: '/products' },
  { name: 'Jewellery & Zari', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80', link: '/products' },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductItem[]>([]);
  const [bestSellers, setBestSellers] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/products?featured=true').then((r) => r.json()),
      fetch('/api/products?bestSeller=true').then((r) => r.json()),
    ])
      .then(([featData, bestData]) => {
        if (featData.success) setFeaturedProducts(featData.products);
        if (bestData.success) setBestSellers(bestData.products);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-10 font-sans bg-white pb-16">
      {/* Hero Banner Carousel */}
      <HeroBanner />

      {/* Hot & Happening Categories Strip (Nykaa Screenshot 1 Replica) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h2 className="text-xl font-serif font-extrabold text-gray-900 mb-5">
          Hot & Happening Categories
        </h2>
        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-none">
          {CATEGORY_STRIP.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.link}
              className="shrink-0 w-28 sm:w-36 text-center space-y-2.5 group cursor-pointer"
            >
              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-gray-200 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="block font-bold text-xs text-gray-900 group-hover:text-rose-600 transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Festive Special Oval/Arch Door Section (Nykaa Screenshot 2) */}
      <FestiveArchSection />

      {/* Trending Maheshwari Sarees */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-rose-600 block">
              MAHESHWAR HERITAGE
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-gray-900 flex items-center gap-2">
              <span>Featured Maheshwari Sarees</span>
              <Sparkles className="w-5 h-5 text-rose-500" />
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-extrabold text-rose-600 hover:text-rose-800 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-bold text-gray-400">Loading Sarees...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Instagram Famous Weavers Section (Nykaa Screenshot 3) */}
      <InstagramFamousSection />

      {/* 331+ Google Customer Reviews Section */}
      <GoogleReviewsSection />

      {/* Best Sellers Section */}
      {bestSellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-rose-600 block">
                CUSTOMER FAVORITES
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-gray-900">
                Best Seller Sarees
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-extrabold text-rose-600 hover:text-rose-800 flex items-center gap-1"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
