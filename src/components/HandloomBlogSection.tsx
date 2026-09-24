'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { BookOpen, Sparkles, Clock, ArrowRight, Play, User, Calendar, Tag, ChevronRight, ChevronLeft, X } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  videoUrl?: string | null;
  readingTime: string;
  isFeatured?: boolean;
  publishedAt: string;
}

export function HandloomBlogSection() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch('/api/blogs')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.blogs) && data.blogs.length > 0) {
          // Randomly shuffle blogs so visitors see fresh stories on every visit
          const shuffled = [...data.blogs].sort(() => Math.random() - 0.5);
          setBlogs(shuffled);
        }
      })
      .catch((err) => console.error('Error loading blogs:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    if (clientWidth > 0) {
      const index = Math.round(scrollLeft / (clientWidth * 0.84));
      setActiveIndex(Math.min(Math.max(0, index), blogs.length - 1));
    }
  };

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.clientWidth * 0.84 + 16;
    scrollRef.current.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth',
    });
    setActiveIndex(index);
  };

  const scrollPrev = () => {
    const prev = Math.max(0, activeIndex - 1);
    scrollToIndex(prev);
  };

  const scrollNext = () => {
    const next = Math.min(blogs.length - 1, activeIndex + 1);
    scrollToIndex(next);
  };

  if (!loading && blogs.length === 0) {
    return null;
  }

  const renderBlogCard = (blog: BlogPost, idx: number) => {
    const isVideo = blog.mediaType === 'video' || (blog.mediaUrl && (blog.mediaUrl.endsWith('.mp4') || blog.mediaUrl.endsWith('.webm')));
    const formattedDate = new Date(blog.publishedAt || (blog as any).createdAt || Date.now()).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    return (
      <article
        key={blog.id || idx}
        className="group bg-white rounded-2xl overflow-hidden border border-amber-950/15 shadow-xs hover:shadow-xl hover:border-amber-950/40 transition-all duration-300 flex flex-col justify-between h-full"
      >
        <div>
          {/* Media Thumbnail Container */}
          <div className="relative aspect-[16/10] overflow-hidden bg-amber-100">
            {isVideo ? (
              <Link href={`/blogs/${blog.slug}`} className="block relative w-full h-full cursor-pointer">
                <video
                  src={blog.mediaUrl}
                  poster={blog.mediaUrl.replace(/\.(mp4|webm)$/, '.jpg')}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </Link>
            ) : (
              <img
                src={blog.mediaUrl || '/uploads/saree_1789923479221_mexzs.jpeg'}
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            )}

            {/* Category Pill Tag */}
            <div className="absolute top-3 left-3 bg-amber-950/90 text-amber-100 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-xs shadow-xs flex items-center gap-1">
              <Tag className="w-2.5 h-2.5 text-amber-300" />
              <span>{blog.category}</span>
            </div>

            {/* Media Type Icon Badge */}
            {isVideo && (
              <div className="absolute top-3 right-3 bg-rose-700 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>Video</span>
              </div>
            )}
          </div>

          {/* Card Content Body */}
          <div className="p-5 sm:p-6">
            {/* Metadata Row */}
            <div className="flex items-center gap-3 sm:gap-4 text-[11px] text-amber-900/70 font-semibold mb-2.5">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-700" />
                {formattedDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-700" />
                {blog.readingTime || '4 min read'}
              </span>
            </div>

            {/* Blog Title */}
            <h3 className="font-serif font-bold text-base sm:text-lg text-amber-950 group-hover:text-rose-800 transition-colors line-clamp-2 leading-snug mb-2.5">
              <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
            </h3>

            {/* Blog Excerpt */}
            <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
              {blog.excerpt}
            </p>
          </div>
        </div>

        {/* Card Footer: Author + Read Link */}
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 border-t border-amber-950/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-950 flex items-center justify-center font-bold text-[10px]">
              {blog.author.charAt(0)}
            </div>
            <span className="text-[11px] font-bold text-amber-950/80 truncate max-w-[120px]">
              {blog.author}
            </span>
          </div>

          <Link
            href={`/blogs/${blog.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-rose-800 hover:text-amber-950 transition-colors uppercase tracking-wider"
          >
            <span>Read Story</span>
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </article>
    );
  };

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 border-y border-amber-950/10 font-sans relative overflow-hidden">
      {/* Subtle Background Decorative Watermark */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-950 text-xs font-bold uppercase tracking-widest mb-3 shadow-2xs">
              <BookOpen className="w-3.5 h-3.5 text-amber-800" />
              <span>The Handloom Journal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-amber-950 tracking-tight leading-tight">
              Stories from Maheshwar Looms
            </h2>
            <p className="text-xs sm:text-sm text-amber-900/80 font-medium mt-1.5 max-w-2xl">
              Immerse yourself in 250 years of royal handloom heritage, master weaving secrets, authentic saree care tips, and festive styling guides.
            </p>
          </div>

          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-950 hover:text-rose-800 transition-colors shrink-0 group border-b border-amber-950/30 hover:border-rose-800 pb-0.5"
          >
            <span>View All Articles & Stories</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 1. Desktop View (Grid Layout - 3 columns side-by-side) */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.slice(0, 6).map((blog, idx) => renderBlogCard(blog, idx))}
        </div>

        {/* 2. Mobile View (Smooth Horizontal Swipeable Slider) */}
        <div className="block md:hidden">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-1 pb-4 pt-1 scrollbar-none scroll-smooth overscroll-x-contain"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {blogs.map((blog, idx) => (
              <div
                key={blog.id || idx}
                className="w-[84vw] max-w-[340px] shrink-0 snap-center"
              >
                {renderBlogCard(blog, idx)}
              </div>
            ))}
          </div>

          {/* Mobile Navigation Controls: [ < ] [ - - - ] [ > ] */}
          {blogs.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-2 px-4">
              {/* Prev Button */}
              <button
                type="button"
                onClick={scrollPrev}
                disabled={activeIndex === 0}
                className="w-8 h-8 rounded-full border border-amber-900/20 bg-white flex items-center justify-center text-amber-950 hover:bg-amber-50 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs transition-all cursor-pointer"
                aria-label="Previous story"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Pagination Dash Indicators */}
              <div className="flex items-center gap-1.5">
                {blogs.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => scrollToIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeIndex === idx
                        ? 'w-6 bg-amber-900'
                        : 'w-2 bg-amber-900/25 hover:bg-amber-900/50'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={scrollNext}
                disabled={activeIndex === blogs.length - 1}
                className="w-8 h-8 rounded-full border border-amber-900/20 bg-white flex items-center justify-center text-amber-950 hover:bg-amber-50 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs transition-all cursor-pointer"
                aria-label="Next story"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Video Lightbox Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-3xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            <button
              onClick={() => setActiveVideoModal(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <video
              src={activeVideoModal}
              controls
              autoPlay
              className="w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
