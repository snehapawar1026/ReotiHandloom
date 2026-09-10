'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Send, Bookmark, MoreVertical } from 'lucide-react';

interface InstaPost {
  handle: string;
  posts: string;
  followers: string;
  image: string;
  caption: string;
  link: string;
}

const INSTA_POSTS: InstaPost[] = [
  {
    handle: 'reoti_maheshwar',
    posts: '1,465',
    followers: '193K',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    caption: 'Royal Crimson Gold Zari Saree • Woven direct from Ahilya Fort looms.',
    link: '/products',
  },
  {
    handle: 'ahilya_fort_weavers',
    posts: '890',
    followers: '124K',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    caption: 'Pure Mulberry Silk Peacock Blue Saree • Royal Heritage Collection.',
    link: '/products',
  },
  {
    handle: 'maheshwari_craft',
    posts: '1,924',
    followers: '85.5K',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    caption: 'Tissue Gold Bugdi Border Ivory Saree • Glimmering Festive Wear.',
    link: '/products',
  },
  {
    handle: 'chatai_border_official',
    posts: '434',
    followers: '50.9K',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    caption: 'Authentic Reversible Chatai Border Saree • Handmade Perfection.',
    link: '/products',
  },
];

export const InstagramFamousSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12 font-sans">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-gray-900">
          Instagram Famous Weavers & Artisans
        </h2>
        <p className="text-xs text-gray-500 font-medium">Trending handloom saree posts handpicked from Maheshwar</p>
      </div>

      {/* Instagram Post Cards Container (Matching Nykaa Screenshot 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {INSTA_POSTS.map((post, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow"
          >
            {/* Instagram Profile Header */}
            <div className="p-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-bold text-xs text-rose-600">
                    {post.handle.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-gray-900 line-clamp-1">
                    @{post.handle}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {post.posts} posts • {post.followers} followers
                  </p>
                </div>
              </div>
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </div>

            {/* Post Image */}
            <Link href={post.link} className="block aspect-square overflow-hidden bg-slate-100">
              <img
                src={post.image}
                alt={post.handle}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </Link>

            {/* Instagram Action Icons */}
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between text-gray-700">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 hover:text-rose-600 cursor-pointer" />
                  <MessageCircle className="w-5 h-5 hover:text-gray-900 cursor-pointer" />
                  <Send className="w-5 h-5 hover:text-gray-900 cursor-pointer" />
                </div>
                <Bookmark className="w-5 h-5 hover:text-gray-900 cursor-pointer" />
              </div>

              <p className="text-xs text-gray-800 line-clamp-2 leading-snug">
                <span className="font-bold mr-1">@{post.handle}</span>
                {post.caption}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
