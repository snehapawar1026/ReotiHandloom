'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, Clock, Tag, ArrowRight, Play, Search, Sparkles, ChevronRight, X } from 'lucide-react';

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

const CATEGORIES = ['ALL', 'Weaving Heritage', 'Buyer Guide', 'Care & Maintenance', 'Styling Tips', 'Handloom Stories'];

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

      <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-xs text-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>REEL</span>
      </div>

      <div className="absolute inset-0 bg-black/15 group-hover/vid:bg-black/5 transition-colors flex items-center justify-center pointer-events-none">
        <div className="w-10 h-10 rounded-full bg-[#581C1C]/75 text-amber-100 flex items-center justify-center opacity-75 group-hover/vid:opacity-100 group-hover/vid:scale-110 transition-all shadow-xl border border-amber-300/40">
          <Play className="w-4 h-4 fill-current ml-0.5 text-amber-200" />
        </div>
      </div>
    </div>
  );
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideoModal, setActiveVideoModal] = useState<{
    url: string;
    title?: string;
    slug?: string;
    category?: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/blogs')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.blogs)) {
          setBlogs(data.blogs);
        }
      })
      .catch((err) => console.error('Error loading blogs:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredBlogs = blogs.filter((b) => {
    const matchesCategory = selectedCategory === 'ALL' || (b.category || '').toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Hero Header Banner */}
      <section className="bg-gradient-to-r from-[#4A0E17] via-[#63101E] to-[#4A0E17] text-amber-50 py-16 px-4 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-semibold uppercase tracking-widest">
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>The Maheshwar Journal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-amber-100 tracking-tight leading-tight">
            Handloom Chronicles & Saree Stories
          </h1>

          <p className="text-xs sm:text-sm text-amber-200/90 font-medium max-w-2xl mx-auto leading-relaxed">
            Immerse yourself in centuries of royal weaving heritage, authenticity guides, weaver stories, and saree styling insights directly from the master artisans of Maheshwar.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto pt-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, guides, silk care, history..."
                className="w-full bg-white/95 text-gray-900 placeholder-gray-500 text-xs font-semibold px-4 py-3 pl-10 rounded-full shadow-lg border border-amber-300/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb Path */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-rose-700">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-bold">The Handloom Journal</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filters Pill Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-gray-200 mb-8">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-amber-950 text-amber-100 shadow-md scale-105'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-amber-950 hover:bg-amber-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-gray-500 mt-4">Loading Handloom Stories...</p>
          </div>
        )}

        {/* No Blogs Found */}
        {!loading && filteredBlogs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 max-w-md mx-auto">
            <BookOpen className="w-12 h-12 text-amber-800/40 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-lg text-gray-900">No Articles Found</h3>
            <p className="text-xs text-gray-500 mt-1">Try changing the category or search query.</p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-amber-950 text-white text-xs font-bold rounded-full hover:bg-rose-800 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Blogs Grid */}
        {!loading && filteredBlogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => {
              const isVideo = blog.mediaType === 'video' || (blog.mediaUrl && (blog.mediaUrl.endsWith('.mp4') || blog.mediaUrl.endsWith('.webm')));
              const formattedDate = new Date(blog.publishedAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              return (
                <article
                  key={blog.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-amber-950/15 shadow-xs hover:shadow-xl hover:border-amber-950/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Media Thumbnail Container */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-amber-100 group/vid">
                      {isVideo ? (
                        <BlogLiveVideo
                          src={blog.mediaUrl}
                          poster={getBlogPoster(blog)}
                          title={blog.title}
                          onOpenModal={() =>
                            setActiveVideoModal({
                              url: blog.mediaUrl || blog.videoUrl || '',
                              title: blog.title,
                              slug: blog.slug,
                              category: blog.category,
                            })
                          }
                        />
                      ) : (
                        <Link href={`/blogs/${blog.slug}`} className="block relative w-full h-full cursor-pointer">
                          <img
                            src={blog.mediaUrl || '/uploads/saree_1789923479221_mexzs.jpeg'}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            decoding="async"
                          />
                        </Link>
                      )}

                      {/* Category Pill Tag */}
                      <div className="absolute top-3 left-3 bg-amber-950/90 text-amber-100 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-xs shadow-xs flex items-center gap-1">
                        <Tag className="w-2.5 h-2.5 text-amber-300" />
                        <span>{blog.category}</span>
                      </div>

                      {/* Video Tag Badge */}
                      {isVideo && (
                        <div className="absolute top-3 right-3 bg-rose-700 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          <Play className="w-2.5 h-2.5 fill-current" />
                          <span>Video</span>
                        </div>
                      )}
                    </div>

                    {/* Card Content Body */}
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-[11px] text-amber-900/70 font-semibold mb-2.5">
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

                      <h3 className="font-serif font-bold text-lg text-amber-950 group-hover:text-rose-800 transition-colors line-clamp-2 leading-snug mb-2.5">
                        <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                      </h3>

                      <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 pb-6 pt-3 border-t border-amber-950/10 flex items-center justify-between">
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
            })}
          </div>
        )}
      </div>

      {/* Video Modal */}
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
    </div>
  );
}
