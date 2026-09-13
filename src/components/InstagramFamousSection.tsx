'use client';

import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreVertical, ExternalLink, Play } from 'lucide-react';

const INSTA_URL = "https://www.instagram.com/reoti_handloom";

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

interface InstaPost {
  id?: string;
  handle?: string;
  image?: string;
  postUrl?: string;
  caption?: string;
  likes?: string;
  isVideo?: boolean;
}

const DEFAULT_POSTS: InstaPost[] = [
  {
    id: 'insta-1',
    handle: 'reoti_handloom',
    image: '/uploads/saree_1789062703690_a4mpx.jpeg',
    postUrl: 'https://www.instagram.com/reoti_handloom',
    caption: 'Bright Yellow & Black Maheshwari Silk Cotton Saree with Silver Zari Border • Woven direct from Maheshwar fort looms. Authentic Handloom Mark.',
    likes: '1,842',
    isVideo: false,
  },
  {
    id: 'insta-2',
    handle: 'reoti_handloom',
    image: '/uploads/saree_1789059507283_4f5xe.jpeg',
    postUrl: 'https://www.instagram.com/reoti_handloom',
    caption: 'Dusty Rose & Black Maheshwari Silk Cotton Saree with Silver Zari Border • Royal Heritage Maheshwari Collection 2026.',
    likes: '2,490',
    isVideo: true,
  },
  {
    id: 'insta-3',
    handle: 'reoti_handloom',
    image: '/uploads/saree_1789150613406_pewc9.jpeg',
    postUrl: 'https://www.instagram.com/reoti_handloom',
    caption: 'Peach Beige & Black Maheshwari Handloom Saree with Silver Zari Border • Glimmering Festive Wear.',
    likes: '1,924',
    isVideo: false,
  },
  {
    id: 'insta-4',
    handle: 'reoti_handloom',
    image: '/uploads/saree_1789062433334_nf5up.jpg',
    postUrl: 'https://www.instagram.com/reoti_handloom',
    caption: 'Authentic Royal Maheshwari Silk Cotton Saree • Handmade Perfection by Master Artisans.',
    likes: '3,105',
    isVideo: true,
  },
];

export const InstagramFamousSection = () => {
  const [posts, setPosts] = useState<InstaPost[]>(DEFAULT_POSTS);

  useEffect(() => {
    fetch('/api/instagram')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.posts && data.posts.length > 0) {
          setPosts(data.posts);
        }
      })
      .catch((err) => console.error('Error fetching instagram posts:', err));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12 font-sans">
      <div className="text-center mb-8">
        <span className="text-xs font-extrabold tracking-[0.25em] uppercase text-rose-600 block mb-1">
          LOOM WEAVING & HERITAGE
        </span>
        <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-gray-900 tracking-wide flex items-center justify-center gap-2">
          <InstagramIcon className="w-7 h-7 text-rose-600" />
          <span>Follow Us On Instagram @reoti_handloom</span>
        </h2>
        <div className="w-20 h-0.5 bg-rose-600/40 mx-auto mt-2.5 rounded-full mb-3" />
        <p className="text-xs sm:text-sm text-gray-600 font-medium text-center mb-4 max-w-2xl mx-auto">
          Official Instagram handle • Trending handloom saree collections & loom weaving stories from Maheshwar
        </p>
        <div className="flex justify-center">
          <a
            href={INSTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-rose-600 to-purple-600 text-white font-extrabold text-xs px-6 py-3 rounded-full hover:opacity-95 transition-opacity shadow-sm shrink-0"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Follow @reoti_handloom</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Grid of Clean Instagram Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.slice(0, 4).map((post, idx) => (
          <a
            key={post.id || idx}
            href={post.postUrl || INSTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all group block"
          >
            {/* Profile Header */}
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
                    <span>@{post.handle || 'reoti_handloom'}</span>
                    <span className="w-3.5 h-3.5 bg-blue-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold">✓</span>
                  </h4>
                  <p className="text-[10px] text-gray-400 font-medium">Maheshwar, Madhya Pradesh</p>
                </div>
              </div>
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </div>

            {/* Photo / Video Container */}
            <div className="aspect-square overflow-hidden bg-slate-100 relative">
              <img
                src={post.image || '/uploads/saree_1789062703690_a4mpx.jpeg'}
                alt={post.caption || 'Reoti Handloom Instagram Post'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {post.isVideo ? (
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-white/90 text-rose-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-rose-600 ml-0.5" />
                  </div>
                </div>
              ) : (
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <InstagramIcon className="w-3 h-3" />
                  <span>Instagram</span>
                </div>
              )}
            </div>

            {/* Actions & Caption */}
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between text-gray-700">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  <MessageCircle className="w-5 h-5 hover:text-gray-900 cursor-pointer" />
                  <Send className="w-5 h-5 hover:text-gray-900 cursor-pointer" />
                </div>
                <Bookmark className="w-5 h-5 hover:text-gray-900 cursor-pointer" />
              </div>

              <p className="text-[11px] font-bold text-gray-900">{post.likes || '1,840'} likes</p>

              <p className="text-xs text-gray-800 line-clamp-2 leading-snug">
                <span className="font-extrabold mr-1">@{post.handle || 'reoti_handloom'}</span>
                {post.caption}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
