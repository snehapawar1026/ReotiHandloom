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

interface HandloomBlogSectionProps {
  initialBlogs?: BlogPost[];
}

interface VideoModalData {
  url: string;
  title?: string;
  slug?: string;
  category?: string;
}

const getBlogPoster = (blog: BlogPost): string => {
  if ((blog as any).posterUrl) return (blog as any).posterUrl;
  if ((blog as any).thumbnailUrl) return (blog as any).thumbnailUrl;
  if (blog.mediaUrl && !blog.mediaUrl.endsWith('.mp4') && !blog.mediaUrl.endsWith('.webm')) {
    return blog.mediaUrl;
  }
  const slug = (blog.slug || '').toLowerCase();
  const title = (blog.title || '').toLowerCase();
  if (slug.includes('identify') || title.includes('identify') || title.includes('fake')) {
    return '/uploads/saree_1789240597301_iy1ww.jpeg';
  }
  if (slug.includes('heritage') || title.includes('heritage') || title.includes('legacy') || title.includes('ahilyabai')) {
    return '/uploads/saree_1789221965397_lf0kg.jpeg';
  }
  if (slug.includes('care') || title.includes('care') || title.includes('maintenance')) {
    return '/uploads/saree_1789233209397_zszzb.jpeg';
  }
  return '/uploads/saree_1789923479221_mexzs.jpeg';
};

function BlogLiveVideo({
  src,
  poster,
  title,
  onOpenModal,
}: {
  src: string;
  poster: string;
  title: string;
  onOpenModal: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    const startPlayback = () => {
      const p = video.play();
      if (p !== undefined) {
        p.catch(() => {
          // If browser policy delays autoplay until user touch, trigger immediately on first touch/click
          const playOnGesture = () => {
            video.play().catch(() => {});
            window.removeEventListener('touchstart', playOnGesture);
            window.removeEventListener('click', playOnGesture);
          };
          window.addEventListener('touchstart', playOnGesture, { once: true });
          window.addEventListener('click', playOnGesture, { once: true });
        });
      }
    };

    startPlayback();
  }, [src]);

  return (
    <div
      onClick={onOpenModal}
      className="block relative w-full h-full cursor-pointer group/vid bg-black"
      role="button"
      tabIndex={0}
      aria-label={`Watch video: ${title}`}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
      />

      {/* Subtle Live Badge */}
      <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-xs text-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>REEL</span>
      </div>

      {/* Subtle Play Overlay on Hover/Tap */}
      <div className="absolute inset-0 bg-black/15 group-hover/vid:bg-black/5 transition-colors flex items-center justify-center pointer-events-none">
        <div className="w-10 h-10 rounded-full bg-[#581C1C]/75 text-amber-100 flex items-center justify-center opacity-75 group-hover/vid:opacity-100 group-hover/vid:scale-110 transition-all shadow-xl border border-amber-300/40">
          <Play className="w-4 h-4 fill-current ml-0.5 text-amber-200" />
        </div>
      </div>
    </div>
  );
}

export function HandloomBlogSection({ initialBlogs }: HandloomBlogSectionProps = {}) {
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs || []);
  const [loading, setLoading] = useState(!initialBlogs || initialBlogs.length === 0);
  const [activeVideoModal, setActiveVideoModal] = useState<VideoModalData | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialBlogs || initialBlogs.length === 0) {
      fetch('/api/blogs')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.blogs) && data.blogs.length > 0) {
            setBlogs(data.blogs);
          }
        })
        .catch((err) => console.error('Error loading blogs:', err))
        .finally(() => setLoading(false));
    }
  }, [initialBlogs]);

  // Manual Nudge Handler
  const scrollManual = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -380 : 380;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (!loading && blogs.length === 0) {
    return null;
  }

  // Duplicate 3x for seamless continuous infinite marquee auto-scroll
  const displayBlogs = blogs.length > 0 ? [...blogs, ...blogs, ...blogs] : [];

  const renderBlogCard = (blog: BlogPost, uniqueKey: string | number) => {
    const isVideo =
      blog.mediaType === 'video' ||
      (blog.mediaUrl && (blog.mediaUrl.endsWith('.mp4') || blog.mediaUrl.endsWith('.webm')));
    const posterSrc = getBlogPoster(blog);
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
          <div className="relative aspect-[16/10] overflow-hidden bg-amber-100 group/vid">
            {isVideo ? (
              <BlogLiveVideo
                src={blog.mediaUrl}
                poster={posterSrc}
                title={blog.title}
                onOpenModal={() => {
                  setActiveVideoModal({
                    url: blog.mediaUrl || blog.videoUrl || '',
                    title: blog.title,
                    slug: blog.slug,
                    category: blog.category,
                  });
                }}
              />
            ) : (
              <Link href={`/blogs/${blog.slug}`} className="block relative w-full h-full cursor-pointer">
                <img
                  src={blog.mediaUrl || '/uploads/saree_1789923479221_mexzs.jpeg'}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </Link>
            )}

            {/* Category Pill Tag */}
            <div className="absolute top-3 left-3 bg-amber-950/90 text-amber-100 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-xs shadow-xs flex items-center gap-1 pointer-events-none">
              <Tag className="w-2.5 h-2.5 text-amber-300" />
              <span>{blog.category}</span>
            </div>

            {/* Media Type Icon Badge */}
            {isVideo && (
              <div className="absolute top-3 right-3 bg-rose-700 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs pointer-events-none">
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
              {(blog.author || 'Reoti').charAt(0).toUpperCase()}
            </div>
            <span className="text-[11px] font-bold text-amber-950/80 truncate max-w-[120px]">
              {blog.author || 'Reoti Handloom'}
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

          {/* Right Action Bar: Clean View All Link */}
          <div className="flex items-center shrink-0">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-950 hover:text-rose-800 transition-colors group bg-amber-100/80 hover:bg-amber-200/90 px-3.5 py-1.5 rounded-full border border-amber-300 shadow-2xs"
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setActiveVideoModal(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-neutral-950 rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border-b border-amber-500/20">
              <div className="min-w-0 pr-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block truncate">
                  {activeVideoModal.category || 'Reoti Handloom Video'}
                </span>
                <h3 className="text-white font-serif font-bold text-sm sm:text-base truncate">
                  {activeVideoModal.title || 'Maheshwar Handloom Video Story'}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Close video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              <video
                src={activeVideoModal.url}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Modal Footer */}
            {activeVideoModal.slug && (
              <div className="p-3.5 bg-neutral-900/90 flex items-center justify-between text-xs text-amber-200 border-t border-white/5">
                <span className="hidden sm:inline">100% Authentic Maheshwar Heritage Looms</span>
                <Link
                  href={`/blogs/${activeVideoModal.slug}`}
                  onClick={() => setActiveVideoModal(null)}
                  className="inline-flex items-center gap-1.5 font-bold text-amber-400 hover:text-white transition-colors bg-amber-950/60 hover:bg-amber-950 px-3 py-1.5 rounded-full border border-amber-500/30"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
