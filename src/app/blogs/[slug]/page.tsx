import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogBySlugOrId, getAllBlogs } from '@/lib/storeManager';
import {
  BookOpen,
  Calendar,
  Clock,
  Tag,
  ArrowLeft,
  Share2,
  User,
  Sparkles,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlogBySlugOrId(slug);

  if (!blog) {
    return {
      title: 'Handloom Stories & Craft Journal | Reoti Handloom',
      description: 'Discover authentic stories, weaving techniques, and saree care guides from Maheshwar weavers.',
    };
  }

  const primaryImage = blog.mediaUrl || '/uploads/saree_1789923479221_mexzs.jpeg';
  const absoluteImageUrl = primaryImage.startsWith('http')
    ? primaryImage
    : `https://reotihandloom.com${primaryImage}`;

  const title = `${blog.title} - Reoti Handloom Journal`;
  const description = blog.excerpt || blog.title;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://reotihandloom.com/blogs/${blog.slug || slug}`,
      siteName: 'Reoti Handloom',
      locale: 'en_IN',
      type: 'article',
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteImageUrl],
    },
    other: {
      'og:image:secure_url': absoluteImageUrl,
      image: absoluteImageUrl,
    },
  };
}

export default async function SingleBlogPage({ params }: Props) {
  const { slug } = await params;
  const blog = getBlogBySlugOrId(slug);

  if (!blog) {
    notFound();
  }

  const all = getAllBlogs();
  const relatedBlogs = all.filter((b: any) => b.id !== blog.id).slice(0, 3);
  const isVideo = blog.mediaType === 'video' || (blog.mediaUrl && (blog.mediaUrl.endsWith('.mp4') || blog.mediaUrl.endsWith('.webm')));

  const formattedDate = new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const blogShareUrl = `https://reotihandloom.com/blogs/${blog.slug || slug}`;
  const whatsappShareText = encodeURIComponent(`📖 *${blog.title}*\n${blogShareUrl}\n\nRead this fascinating handloom story from Reoti Handloom Maheshwar! ✨`);

  const primaryImage = blog.mediaUrl || '/uploads/saree_1789923479221_mexzs.jpeg';
  const absoluteImageUrl = primaryImage.startsWith('http')
    ? primaryImage
    : `https://reotihandloom.com${primaryImage.startsWith('/') ? '' : '/'}${primaryImage}`;

  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt || blog.title,
    image: [absoluteImageUrl],
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt || blog.publishedAt || blog.createdAt,
    author: {
      '@type': 'Person',
      name: blog.author || 'Reoti Handloom Master Weavers',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Reoti Handloom',
      logo: {
        '@type': 'ImageObject',
        url: 'https://reotihandloom.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': blogShareUrl,
    },
    articleSection: blog.category || 'Handloom Heritage',
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://reotihandloom.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'The Maheshwar Journal',
        item: 'https://reotihandloom.com/blogs',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: blog.title,
        item: blogShareUrl,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      {/* Breadcrumbs */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-rose-700">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/blogs" className="hover:text-rose-700">The Handloom Journal</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-bold truncate max-w-xs">{blog.title}</span>
        </nav>
      </div>

      {/* Main Article Container */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Article Header */}
        <header className="space-y-4 mb-8 bg-white p-6 sm:p-10 rounded-3xl border border-amber-950/10 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-bold uppercase tracking-wider">
            <Tag className="w-3 h-3 text-amber-700" />
            <span>{blog.category || 'Handloom Heritage'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-amber-950 leading-tight">
            {blog.title}
          </h1>

          {/* Metadata Row & Share Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100 text-xs text-gray-600 font-medium">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-950 text-amber-100 font-bold text-xs flex items-center justify-center">
                  {blog.author.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{blog.author}</p>
                  <p className="text-[10px] text-gray-500">Maheshwar Craft Studio</p>
                </div>
              </div>

              <span className="text-gray-300">|</span>

              <div className="flex items-center gap-1.5 text-gray-500">
                <Calendar className="w-3.5 h-3.5 text-amber-800" />
                <span>{formattedDate}</span>
              </div>

              <span className="text-gray-300 hidden sm:inline">|</span>

              <div className="hidden sm:flex items-center gap-1.5 text-gray-500">
                <Clock className="w-3.5 h-3.5 text-amber-800" />
                <span>{blog.readingTime || '4 min read'}</span>
              </div>
            </div>

            {/* Direct WhatsApp Share Button */}
            <a
              href={`https://api.whatsapp.com/send?text=${whatsappShareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full text-xs font-bold shadow-xs transition-colors"
              title="Share on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>Share Story</span>
            </a>
          </div>
        </header>

        {/* Featured Media (Photo or Video Player) */}
        <div className="mb-10 rounded-3xl overflow-hidden border border-amber-950/15 shadow-lg bg-black aspect-[16/9] relative">
          {isVideo ? (
            <video
              src={blog.mediaUrl}
              poster={blog.mediaUrl.replace(/\.(mp4|webm)$/, '.jpg')}
              controls
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src={blog.mediaUrl || '/uploads/saree_1789923479221_mexzs.jpeg'}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Article Body Content */}
        <div className="bg-white p-6 sm:p-12 rounded-3xl border border-amber-950/10 shadow-xs prose prose-amber max-w-none text-gray-800 leading-relaxed font-sans">
          {blog.excerpt && (
            <p className="text-base sm:text-lg font-medium text-amber-950/90 italic border-l-4 border-amber-700 pl-4 my-6 bg-amber-50/50 py-3 rounded-r-xl">
              "{blog.excerpt}"
            </p>
          )}

          {/* Render Markdown Content Line by Line */}
          <div className="space-y-4 text-sm sm:text-base leading-relaxed whitespace-pre-line text-gray-700">
            {blog.content}
          </div>

          {/* Author Footnote / Weavers Note */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-amber-50/60 p-6 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 p-0.5 shrink-0 bg-white">
                <img src="/logo.jpg" alt="Reoti Handloom" className="w-full h-full object-cover rounded-full" />
              </div>
              <div>
                <h4 className="font-serif font-extrabold text-sm text-amber-950">
                  Reoti Handloom Maheshwar
                </h4>
                <p className="text-xs text-amber-900/80">
                  Handcrafted with generational devotion along the holy Narmada Fort looms.
                </p>
              </div>
            </div>

            <Link
              href="/products"
              className="px-5 py-2.5 bg-amber-950 hover:bg-rose-900 text-amber-100 font-bold text-xs rounded-xl shadow-md transition-all shrink-0"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </article>

      {/* Related Stories Section */}
      {relatedBlogs.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-16 pt-12 border-t border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif font-bold text-2xl text-amber-950">
              More Handloom Chronicles
            </h3>
            <Link
              href="/blogs"
              className="text-xs font-bold text-rose-800 hover:text-amber-950 uppercase tracking-wider"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedBlogs.map((rel) => (
              <div
                key={rel.id}
                className="bg-white rounded-2xl overflow-hidden border border-amber-950/10 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/10] bg-amber-100 overflow-hidden">
                    <img
                      src={rel.mediaUrl || '/uploads/saree_1789923479221_mexzs.jpeg'}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                      {rel.category}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-amber-950 group-hover:text-rose-800 transition-colors line-clamp-2 leading-snug">
                      <Link href={`/blogs/${rel.slug}`}>{rel.title}</Link>
                    </h4>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-gray-500">{rel.readingTime}</span>
                  <Link
                    href={`/blogs/${rel.slug}`}
                    className="font-bold text-rose-800 hover:text-amber-950"
                  >
                    Read →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
