'use client';

import React from 'react';
import Link from 'next/link';

interface ArchCategory {
  title: string;
  subtitle: string;
  image: string;
  link: string;
}

const ARCH_ITEMS: ArchCategory[] = [
  {
    title: 'Festive Sarees',
    subtitle: 'to steal the show',
    image: '/uploads/festival_banner_stairs.jpg',
    link: '/products?category=silk-cotton-maheshwari',
  },
  {
    title: 'Heritage Weaves',
    subtitle: 'for every pooja & ritual',
    image: '/uploads/festival_banner_friends.jpg',
    link: '/products?category=silk-cotton-maheshwari',
  },
  {
    title: 'Maheshwari Suits',
    subtitle: 'for festive gatherings',
    image: '/uploads/saree_1789221965397_lf0kg.jpeg',
    link: '/products?category=maheshwari-suits',
  },
  {
    title: 'Tissue Zari',
    subtitle: 'to shine in evening events',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    link: '/products?category=tissue-zari-maheshwari',
  },
  {
    title: 'Royal Classics',
    subtitle: 'for timeless elegance',
    image: '/uploads/saree_1789233209397_zszzb.jpeg',
    link: '/products?category=pure-silk-maheshwari',
  },
  {
    title: 'Paithani Sarees',
    subtitle: 'for authentic festive vibes',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    link: '/products',
  },
];

export const FestiveArchSection = () => {
  return (
    <section className="my-10 py-12 bg-[#e63956] text-white font-sans overflow-hidden shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-extrabold tracking-[0.25em] uppercase text-amber-200 block mb-1">
            FESTIVE CELEBRATIONS • UPCOMING SPECIAL
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-wide text-white">
            Get Ready For Upcoming Festivals
          </h2>
          <div className="w-24 h-0.5 bg-amber-300/60 mx-auto mt-3 rounded-full" />
        </div>

        {/* Horizontal Arch Door Cards Carousel (Exact Nykaa Screenshot 2 Replica) */}
        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-none">
          {ARCH_ITEMS.map((item, idx) => (
            <Link
              key={idx}
              href={item.link}
              className="shrink-0 w-44 sm:w-52 group text-center space-y-2 cursor-pointer"
            >
              {/* Arch Door Shaped Card Container */}
              <div className="w-full aspect-[9/16] rounded-t-[110px] rounded-b-[40px] overflow-hidden border-2 border-amber-300/90 p-1.5 bg-amber-200/20 group-hover:scale-105 transition-transform duration-500 relative shadow-xl">
                <div className="w-full h-full rounded-t-[105px] rounded-b-[35px] overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Bottom Arch Label Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-4 text-center">
                    <span className="font-serif font-bold text-sm text-white drop-shadow-md">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-amber-200 font-medium line-clamp-1">
                      {item.subtitle}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
