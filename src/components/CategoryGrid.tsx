'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  _count: { products: number };
}

export const CategoryGrid = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCategories(data.categories);
      })
      .catch((err) => console.error(err));
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-rose-700 block">
            EXPLORE BY WEAVE & FABRIC
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-amber-950 flex items-center gap-2">
            <span>Maheshwari Categories</span>
            <Sparkles className="w-5 h-5 text-amber-600" />
          </h2>
        </div>
        <Link
          href="/products"
          className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1 group"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="group relative bg-amber-50 rounded-xl overflow-hidden border border-amber-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div className="aspect-[4/3] w-full overflow-hidden relative">
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c'}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute bottom-2 right-2 text-[10px] font-bold bg-white/90 text-amber-950 px-2 py-0.5 rounded-full shadow">
                {cat._count?.products || 0} Designs
              </span>
            </div>

            <div className="p-3.5 text-center bg-white flex-1 flex flex-col justify-center">
              <h3 className="font-serif font-bold text-xs sm:text-sm text-amber-950 group-hover:text-rose-700 transition-colors">
                {cat.name}
              </h3>
              <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5 font-medium">
                {cat.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
