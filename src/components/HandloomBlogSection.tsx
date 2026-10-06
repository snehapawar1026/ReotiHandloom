'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, ArrowRight, Play, Calendar, Tag, ChevronRight, ChevronLeft, X, Pause, Play as PlayIcon } from 'lucide-react';

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
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/blogs')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.blogs) && data.blogs.length > 0) {
          setBlogs(data.blogs);
        }
      })
      .catch((err) => console.error('Error loading blogs:', err))
      .finally(() => setLoading(false));
  }, []);

  // Manual Nudge Handler
  const scrollManual = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -380 : 380;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (!loading && blogs.length === 0) {
    return null;
  }

  // Duplicate for seamless infinite horizontal loop
  const displayBlogs = blogs.length > 0 ? [...blogs, ...blogs, ...blogs] : [];

  const renderBlogCard = (blog: BlogPost, uniqueKey: string | number) => {
    const isVideo =
      blog.mediaType === 'video' ||
      (blog.mediaUrl && (blog.mediaUrl.endsWith('.mp4') || blog.mediaUrl.endsWith('.webm')));
    const formattedDate = new Date(blog.publishedAt || (blog as any).createdAt || Date.now()).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    return (
      <article
        key={uniqueKey}
        className="group w-[82vw] sm:w-[340px] md:w-[370px] lg:w-[390px] shrink-0 bg-white rounded-2xl overflow-hidden border border-amber-950/15 shadow-sm hover:shadow-2xl hover:border-amber-950/40 transition-all duration-300 flex flex-col justify-between select-none"
      >
        <div>
          {/* Media Thumbnail Container */}
          <div className="relative aspect-[16/10] overflow-hidden bg-amber-100">
            {isVideo ? (
              <Link href={`/blogs/${blog.slug}`} className="block relative w-full h-full cursor-pointer">
                <video
                  src={blog.mediaUrl}
                  poster={blog.mediaUrl.replace(/\.(mp4|webm)$/, '.jpg')}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </Link>
            ) : (
              <Link href={`/blogs/${blog.slug}`} className="block relative w-full h-full cursor-pointer">
                <img
                  src={blog.mediaUrl || '/uploads/saree_1789923479221_mexzs.jpeg'}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  draggable={false}
                />
              </Link>
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
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 border-t border-amber-950/10 flex items-center justify-between mt-auto bg-amber-50/30">
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
      {/* Dynamic CSS for GPU Butter-Smooth Continuous Marquee */}
      <style jsx>{`
        @keyframes marqueeScroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-33.3333%, 0, 0);
          }
        }
        .story-marquee-track {
          display: flex;
          gap: 1.5rem;
          width: max-content;
          animation: marqueeScroll 28s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          perspective: 1000px;
        }
        .story-marquee-wrapper:hover .story-marquee-track,
        .story-marquee-track.paused {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* Subtle Background Decorative Watermark */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4">
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

          {/* Right Action Bar: Scroll Arrows & View All */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Live Auto-Scroll Status Indicator */}
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-amber-200/80 text-[11px] font-bold text-amber-900 shadow-2xs hover:bg-amber-50 transition-colors cursor-pointer"
              title={isPaused ? 'Click to Resume Auto-scroll' : 'Click to Pause Auto-scroll'}
            >
              <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-500' : 'bg-emerald-600 animate-pulse'}`} />
              <span>{isPaused ? 'Paused' : 'Auto-Scrolling'}</span>
              {isPaused ? <PlayIcon className="w-3 h-3 fill-current ml-0.5" /> : <Pause className="w-3 h-3 fill-current ml-0.5" />}
            </button>

            {/* Manual Left / Right Navigation Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollManual('left')}
                className="w-9 h-9 rounded-full bg-white border border-amber-950/20 text-amber-950 hover:bg-amber-950 hover:text-white transition-all shadow-xs flex items-center justify-center cursor-pointer active:scale-95"
                aria-label="Scroll Left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollManual('right')}
                className="w-9 h-9 rounded-full bg-white border border-amber-950/20 text-amber-950 hover:bg-amber-950 hover:text-white transition-all shadow-xs flex items-center justify-center cursor-pointer active:scale-95"
                aria-label="Scroll Right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <Link
              href="/blogs"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-950 hover:text-rose-800 transition-colors group border-b border-amber-950/30 hover:border-rose-800 pb-0.5 ml-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Full-width GPU Butter-Smooth Marquee Wrapper */}
      <div
        ref={scrollContainerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => {
          setTimeout(() => setIsPaused(false), 3000);
        }}
        className="story-marquee-wrapper w-full overflow-x-auto py-3 px-4 sm:px-6 lg:px-8 scrollbar-none overscroll-x-contain"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div className={`story-marquee-track ${isPaused ? 'paused' : ''}`}>
          {displayBlogs.map((blog, idx) =>
            renderBlogCard(blog, `${blog.id || blog.slug}_${idx}`)
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
