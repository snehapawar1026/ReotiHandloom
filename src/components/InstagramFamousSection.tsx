'use client';

import React from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreVertical, ExternalLink } from 'lucide-react';

const INSTA_URL = "https://www.instagram.com/reoti_handloom";

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

interface InstaPost {
  handle: string;
  image: string;
  caption: string;
  likes: string;
}

const INSTA_POSTS: InstaPost[] = [
  {
    handle: 'reoti_handloom',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    caption: 'Royal Crimson Gold Zari Saree • Woven direct from Maheshwar fort looms. Authentic Handloom Mark.',
    likes: '1,842',
  },
  {
    handle: 'reoti_handloom',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    caption: 'Pure Mulberry Silk Peacock Blue Saree • Royal Heritage Maheshwari Collection 2026.',
    likes: '2,490',
  },
  {
    handle: 'reoti_handloom',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    caption: 'Tissue Gold Bugdi Border Ivory Saree • Glimmering Festive & Wedding Wear.',
    likes: '1,924',
  },
  {
    handle: 'reoti_handloom',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    caption: 'Authentic Reversible Chatai Border Saree • Handmade Perfection by Master Artisans.',
    likes: '3,105',
  },
];

export const InstagramFamousSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <InstagramIcon className="w-6 h-6 text-rose-600" />
            <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-gray-900">
              Follow Us On Instagram @reoti_handloom
            </h2>
          </div>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Official Instagram handle • Trending handloom saree collections & loom weaving stories from Maheshwar
          </p>
        </div>

        <a
          href={INSTA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-rose-600 to-purple-600 text-white font-extrabold text-xs px-5 py-2.5 rounded-full hover:opacity-95 transition-opacity shadow-xs shrink-0"
        >
          <InstagramIcon className="w-4 h-4" />
          <span>Follow @reoti_handloom</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Instagram Post Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {INSTA_POSTS.map((post, idx) => (
          <a
            key={idx}
            href={INSTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all group block"
          >
            {/* Instagram Profile Header */}
            <div className="p-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 shrink-0">
                  <img
                    src="/logo.jpg"
                    alt="Reoti Handloom"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-gray-900 group-hover:text-rose-600 transition-colors flex items-center gap-1">
                    <span>@{post.handle}</span>
                    <span className="w-3.5 h-3.5 bg-blue-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold">✓</span>
                  </h4>
                  <p className="text-[10px] text-gray-400 font-medium">Maheshwar, Madhya Pradesh</p>
                </div>
              </div>
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </div>

            {/* Post Image */}
            <div className="aspect-square overflow-hidden bg-slate-100 relative">
              <img
                src={post.image}
                alt={post.handle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <InstagramIcon className="w-3 h-3" />
                <span>Instagram</span>
              </div>
            </div>

            {/* Instagram Action Icons & Likes */}
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between text-gray-700">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  <MessageCircle className="w-5 h-5 hover:text-gray-900 cursor-pointer" />
                  <Send className="w-5 h-5 hover:text-gray-900 cursor-pointer" />
                </div>
                <Bookmark className="w-5 h-5 hover:text-gray-900 cursor-pointer" />
              </div>

              <p className="text-[11px] font-bold text-gray-900">{post.likes} likes</p>

              <p className="text-xs text-gray-800 line-clamp-2 leading-snug">
                <span className="font-extrabold mr-1">@{post.handle}</span>
                {post.caption}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
