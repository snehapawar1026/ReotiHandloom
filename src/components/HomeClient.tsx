'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeroBanner } from '@/components/HeroBanner';
import { GoogleReviewsSection } from '@/components/GoogleReviewsSection';
import { HandloomBlogSection } from '@/components/HandloomBlogSection';
import { InstagramFamousSection } from '@/components/InstagramFamousSection';
import { FaqSection } from '@/components/FaqSection';
import { BrandCommitmentSection } from '@/components/BrandCommitmentSection';
import { MobileProductSlider } from '@/components/MobileProductSlider';
import { ProductItem } from '@/context/ShopContext';
import { ChevronLeft, ChevronRight, ArrowRight, ChevronDown } from 'lucide-react';

const SAREE_TABS = [
  { id: 'all', name: 'TOP-SELLING' },
  { id: 'lining', name: 'LINING BUTTI' },
  { id: 'lotus', name: 'LOTUS BUTTA' },
  { id: 'garbha-reshami-special', name: 'GARBHA RESHAMI' },
  { id: 'tissue-zari-maheshwari', name: 'TISSUE MAHESHWARI' },
  { id: 'checks', name: 'CHECKS BUTI' },
  { id: 'bagh', name: 'BAGH PRINT' },
  { id: 'pure-silk-maheshwari', name: 'PURE SILK SAREES' },
];

const SUIT_TABS = [
  { id: 'all', name: 'TOP-SELLING' },
  { id: 'maheshwari-suits', name: 'MAHESHWARI SUITS' },
  { id: 'tissue-suits', name: 'TISSUE SUITS' },
  { id: 'bagh-cotton-suits', name: 'BAGH COTTON' },
  { id: 'maheshwari-bagh', name: 'MAHESHWARI BAGH SUITS' },
  { id: 'butta', name: 'BUTTA SUITS' },
  { id: 'indigo-cotton-suit', name: 'BAGH INDIGO' },
  { id: 'handblock', name: 'HANDBLOCK PRINT' },
  { id: 'traditional-border', name: 'TRADITIONAL BORDER' },
];

const UPCOMING_FESTIVE_CARDS = [
  {
    title: 'Festive Silk Sarees',
    sub: 'to steal the show',
    image: '/uploads/festival_banner_stairs.jpg',
    link: '/products?category=maheshwari-sarees',
  },
  {
    title: 'Heritage Looms',
    sub: 'for every pooja & celebration',
    image: '/uploads/festival_banner_friends.jpg',
    link: '/products?category=silk-cotton-maheshwari',
  },
  {
    title: 'Maheshwari Suits',
    sub: 'for family get-togethers',
    image: '/uploads/saree_1789221965397_lf0kg.jpeg',
    link: '/products?category=maheshwari-suits',
  },
  {
    title: 'Tissue Zari',
    sub: 'for grand evening looks',
    image: '/uploads/saree_1789216191174_safby.jpeg',
    link: '/products?category=tissue-zari-maheshwari',
  },
  {
    title: 'Royal Classics',
    sub: 'timeless authentic grace',
    image: '/uploads/saree_1789233209397_zszzb.jpeg',
    link: '/products',
  },
  {
    title: 'Garbha Reshami',
    sub: 'festive signature weaves',
    image: '/uploads/saree_1789225815147_bmxnp.jpeg',
    link: '/products?category=pure-silk-maheshwari',
  },
];

interface HomeClientProps {
  initialCategories: any[];
  initialProducts: ProductItem[];
  initialBanners?: any[];
  initialReviews?: any[];
  initialBlogs?: any[];
  initialRating?: number;
  initialTotalReviews?: number;
}

export function HomeClient({
  initialCategories,
  initialProducts,
  initialBanners,
  initialReviews,
  initialBlogs,
  initialRating,
  initialTotalReviews,
}: HomeClientProps) {
  const [categories, setCategories] = useState<any[]>(initialCategories || []);
  const [allProducts, setAllProducts] = useState<ProductItem[]>(initialProducts || []);
  const [sareeTab, setSareeTab] = useState('all');
  const [suitTab, setSuitTab] = useState('all');
  const [loading, setLoading] = useState(false);

  const homeCategoryScrollRef = useRef<HTMLDivElement>(null);
  const festiveScrollRef = useRef<HTMLDivElement>(null);
  const browseCatScrollRef = useRef<HTMLDivElement>(null);

  const scrollBrowseCategories = (direction: 'left' | 'right') => {
    if (browseCatScrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      browseCatScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollHomeCategories = (direction: 'left' | 'right') => {
    if (homeCategoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      homeCategoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Helper to determine if a product is a Suit / Dress material
  const isSuitProduct = (p: ProductItem) => {
    if (!p) return false;
    const catSlug = (p.category?.slug || '').toLowerCase();
    const catName = (p.category?.name || '').toLowerCase();
    const title = (p.title || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();
    const length = (p.lengthWithBlouse || '').toLowerCase();
    const catId = ((p as any).categoryId || (p as any).category?.id || '').toLowerCase();
    return (
      catId === 'maheshwari-suits' ||
      catId === 'suits' ||
      catId.includes('suit') ||
      catSlug.includes('suit') ||
      catSlug.includes('dress-material') ||
      catName.includes('suit') ||
      catName.includes('dress material') ||
      title.includes('suit') ||
      title.includes('dress material') ||
      title.includes('top dupatta') ||
      title.includes('top-dupatta') ||
      title.includes('unstitched') ||
      title.includes('kurta') ||
      desc.includes('suit set') ||
      desc.includes('2-piece') ||
      desc.includes('3-piece') ||
      desc.includes('dress material') ||
      length.includes('top') ||
      length.includes('dupatta') ||
      length.includes('piece set')
    );
  };

  // Filter Sarees based on selected tab (Strictly Sarees only - Suits excluded)
  const getFilteredSarees = () => {
    const sareesOnly = allProducts.filter((p) => !isSuitProduct(p));
    if (sareeTab === 'all') {
      const bestsellers = sareesOnly.filter((p) => p.isBestSeller);
      return (bestsellers.length > 0 ? bestsellers : sareesOnly).slice(0, 8);
    }

    const matched = sareesOnly.filter((p) => {
      const catSlug = (p.category?.slug || '').toLowerCase();
      const catName = (p.category?.name || '').toLowerCase();
      const title = (p.title || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const fabric = (p.fabric || '').toLowerCase();
      const weave = (p.weaveType || '').toLowerCase();
      const border = (p.borderType || '').toLowerCase();

      const foundCat = categories.find((c: any) => c.id === (p as any).categoryId);
      const foundCatSlug = (foundCat?.slug || '').toLowerCase();
      const foundCatName = (foundCat?.name || '').toLowerCase();

      const allText = [title, desc, fabric, weave, border, catSlug, catName, foundCatSlug, foundCatName].join(' ');

      if (sareeTab === 'lining') return allText.includes('lining') || allText.includes('butti') || allText.includes('buti') || allText.includes('stripe');
      if (sareeTab === 'lotus') return allText.includes('lotus') || allText.includes('kamal') || allText.includes('flower') || allText.includes('butta') || allText.includes('buti');
      if (sareeTab === 'garbha-reshami-special' || sareeTab === 'garbha') return allText.includes('garbha') || allText.includes('reshami');
      if (sareeTab === 'tissue-zari-maheshwari' || sareeTab === 'tissue') return allText.includes('tissue') || allText.includes('zari') || allText.includes('shimmer');
      if (sareeTab === 'checks') return allText.includes('check') || allText.includes('chokha') || allText.includes('grid');
      if (sareeTab === 'bagh') return allText.includes('bagh') || allText.includes('block') || allText.includes('indigo') || allText.includes('print');
      if (sareeTab === 'pure-silk-maheshwari' || sareeTab === 'pure-silk') return allText.includes('pure silk') || allText.includes('katan') || (fabric.includes('silk') && !fabric.includes('cotton'));

      const cleanTab = sareeTab.toLowerCase().replace(/-/g, ' ');
      return allText.includes(cleanTab);
    });

    return (matched.length > 0 ? matched : sareesOnly).slice(0, 8);
  };

  // Filter Suits based on selected tab (Strictly Suits only)
  const getFilteredSuits = () => {
    const suitsOnly = allProducts.filter((p) => isSuitProduct(p));
    const fallbackPool = suitsOnly.length > 0 ? suitsOnly : allProducts;

    if (suitTab === 'all') {
      const bestsellers = fallbackPool.filter((p) => p.isBestSeller);
      return (bestsellers.length > 0 ? bestsellers : fallbackPool).slice(0, 8);
    }

    const matched = fallbackPool.filter((p) => {
      const catSlug = (p.category?.slug || '').toLowerCase();
      const catName = (p.category?.name || '').toLowerCase();
      const title = (p.title || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const fabric = (p.fabric || '').toLowerCase();
      const weave = (p.weaveType || '').toLowerCase();
      const border = (p.borderType || '').toLowerCase();

      const foundCat = categories.find((c: any) => c.id === (p as any).categoryId);
      const foundCatSlug = (foundCat?.slug || '').toLowerCase();
      const foundCatName = (foundCat?.name || '').toLowerCase();

      const allText = [title, desc, fabric, weave, border, catSlug, catName, foundCatSlug, foundCatName].join(' ');

      if (suitTab === 'maheshwari-suits') return allText.includes('maheshwari') || allText.includes('suit') || allText.includes('dress');
      if (suitTab === 'tissue-suits') return allText.includes('tissue') || allText.includes('zari') || allText.includes('silk');
      if (suitTab === 'bagh-cotton-suits' || suitTab === 'bagh-cotton') return allText.includes('bagh') || allText.includes('cotton') || allText.includes('block');
      if (suitTab === 'maheshwari-bagh') return allText.includes('bagh') || allText.includes('maheshwari');
      if (suitTab === 'butta') return allText.includes('butta') || allText.includes('buti') || allText.includes('motif');
      if (suitTab === 'indigo-cotton-suit' || suitTab === 'bagh-indigo') return allText.includes('indigo') || allText.includes('blue') || allText.includes('cotton');
      if (suitTab === 'handblock') return allText.includes('handblock') || allText.includes('block') || allText.includes('print');
      if (suitTab === 'traditional-border') return allText.includes('border') || allText.includes('zari') || (p.borderType && p.borderType !== '');

      const cleanTab = suitTab.toLowerCase().replace(/-/g, ' ');
      return allText.includes(cleanTab);
    });

    return (matched.length > 0 ? matched : fallbackPool).slice(0, 8);
  };

  const featuredSarees = React.useMemo(() => {
    const sareesOnly = allProducts.filter((p) => !isSuitProduct(p));
    const featured = sareesOnly.filter((p) => p.isFeatured);
    return (featured.length > 0 ? featured : sareesOnly).slice(0, 8);
  }, [allProducts]);

  const filteredSarees = getFilteredSarees();
  const filteredSuits = getFilteredSuits();

  return (
    <div className="space-y-6 sm:space-y-8 font-sans bg-white pb-16">
      {/* 1. Authentic Scalloped Parent Categories Carousel (Placed at the very Top above Hero Banner) */}
      <section className="w-full bg-[#FAF7F2]/90 border-b border-[#E8DFC8] py-4 relative">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 relative group/carousel">
          {/* Left Scroll Arrow */}
          <button
            onClick={() => scrollHomeCategories('left')}
            className="flex absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white text-[#581C1C] border border-[#E8DFC8] shadow-xl hover:bg-[#581C1C] hover:text-amber-100 transition-all items-center justify-center cursor-pointer active:scale-95 hover:scale-105"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Scroll Arrow */}
          <button
            onClick={() => scrollHomeCategories('right')}
            className="flex absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white text-[#581C1C] border border-[#E8DFC8] shadow-xl hover:bg-[#581C1C] hover:text-amber-100 transition-all items-center justify-center cursor-pointer active:scale-95 hover:scale-105"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            ref={homeCategoryScrollRef}
            className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto pb-3 pt-1 scrollbar-none justify-start px-8 sm:px-12 scroll-smooth w-full overscroll-x-contain"
          >
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                prefetch={true}
                className="flex flex-col items-center group cursor-pointer shrink-0"
              >
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center shrink-0">
                  {/* Authentic Scalloped Bead Ring SVG */}
                  <svg
                    className="absolute inset-0 w-full h-full text-[#8B4513]/70 group-hover:text-[#581C1C] transition-colors duration-300"
                    viewBox="0 0 100 100"
                    fill="none"
                  >
                    {Array.from({ length: 24 }).map((_, i) => {
                      const angle = (i * 360) / 24;
                      const rad = (angle * Math.PI) / 180;
                      const cx = 50 + 44 * Math.cos(rad);
                      const cy = 50 + 44 * Math.sin(rad);
                      return <circle key={i} cx={cx} cy={cy} r="3" fill="currentColor" />;
                    })}
                    <circle cx="50" cy="50" r="39" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <div className="relative w-[80px] h-[80px] sm:w-[92px] sm:h-[92px] rounded-full overflow-hidden p-1 bg-white border border-amber-950/20 shadow-md flex items-center justify-center">
                    <Image
                      src={cat.image || '/uploads/saree_1789221965397_lf0kg.jpeg'}
                      alt={cat.name}
                      fill
                      sizes="92px"
                      className="object-cover rounded-full scale-135 object-[center_88%] group-hover:scale-145 transition-transform duration-500"
                    />
                  </div>
                </div>
                <span className="text-xs font-serif font-bold text-gray-900 group-hover:text-[#581C1C] transition-colors mt-1.5 text-center leading-snug max-w-[100px] sm:max-w-[115px]">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Hero Banner Carousel */}
      <HeroBanner initialBanners={initialBanners} />

      {/* 3. Upcoming Festive Celebrations Section */}
      <section className="max-w-7xl mx-auto px-2 sm:px-6 my-3 sm:my-6">
        <div className="w-full bg-[#E52E4E] text-white py-4 sm:py-10 px-3 sm:px-8 rounded-2xl sm:rounded-[36px] shadow-xl relative overflow-hidden border border-rose-400/30">
          <div className="space-y-3 sm:space-y-6">
            <div className="text-center space-y-0.5 sm:space-y-1">
              <span className="text-[9px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-amber-300">
                FESTIVE CELEBRATIONS • UPCOMING SPECIAL
              </span>
              <h2 className="text-lg sm:text-4xl font-serif font-extrabold text-amber-100 tracking-wide">
                Get Ready For Upcoming Festivals
              </h2>
              <p className="hidden sm:block text-xs sm:text-sm font-medium text-amber-200/90 max-w-xl mx-auto pt-1">
                Authentic handcrafted Maheshwari sarees & suits to celebrate Navratri, Karwa Chauth, Dussehra & Diwali with pure grace.
              </p>
            </div>

            {/* Horizontal Scrollable Festive Cards */}
            <div className="relative group/festive">
              {/* White Scroll Left Button (Desktop only) */}
              <button
                onClick={() => {
                  if (festiveScrollRef.current) {
                    festiveScrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
                  }
                }}
                className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white text-gray-900 shadow-2xl items-center justify-center hover:bg-amber-100 transition-all cursor-pointer border border-gray-200 active:scale-95"
                aria-label="Scroll Left"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>

              <div
                ref={festiveScrollRef}
                className="flex gap-3 sm:gap-6 overflow-x-auto pb-2 sm:pb-6 pt-1 sm:pt-2 scrollbar-none justify-start px-2 sm:px-6 scroll-smooth overscroll-x-contain"
              >
                {UPCOMING_FESTIVE_CARDS.map((card, idx) => (
                  <Link
                    key={idx}
                    href={card.link}
                    prefetch={true}
                    className="group relative w-32 sm:w-60 h-44 sm:h-[380px] shrink-0 rounded-t-full rounded-b-xl sm:rounded-b-2xl overflow-hidden border-2 border-[#D4AF37] shadow-lg hover:scale-105 transition-all duration-500 block bg-[#F4E3B5]"
                  >
                    {/* Damask Floral Wallpaper Backdrop */}
                    <div className="absolute inset-0 bg-[#F4E3B5] bg-[radial-gradient(#D4AF37_1.5px,transparent_1.5px)] [background-size:14px_14px] opacity-60" />

                    {/* Model Image inside Arch */}
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 640px) 130px, 240px"
                      className="object-cover object-top rounded-t-full rounded-b-xl sm:rounded-b-2xl relative z-10 group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Bottom Text Overlay */}
                    <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-6 sm:pt-12 pb-2 sm:pb-4 px-2 sm:px-3 text-center">
                      <h3 className="font-serif font-extrabold text-xs sm:text-xl text-amber-100 group-hover:text-white transition-colors leading-tight drop-shadow-md">
                        {card.title}
                      </h3>
                      <p className="text-[9px] sm:text-xs font-sans font-medium text-amber-300/90 mt-0.5 sm:mt-1 drop-shadow line-clamp-1">
                        {card.sub}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* White Scroll Right Button (Desktop only) */}
              <button
                onClick={() => {
                  if (festiveScrollRef.current) {
                    festiveScrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
                  }
                }}
                className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white text-gray-900 shadow-2xl items-center justify-center hover:bg-amber-100 transition-all cursor-pointer border border-gray-200 active:scale-95"
                aria-label="Scroll Right"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MAHESHWAR HERITAGE - Featured Maheshwari Sarees Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <div className="text-center mb-4 sm:mb-6 relative">
          <span className="text-xs sm:text-sm font-extrabold tracking-[0.25em] text-[#E52E4E] uppercase block mb-1">
            MAHESHWAR HERITAGE
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-extrabold text-[#2D1214] tracking-wide inline-flex items-center justify-center gap-2">
            <span>Featured Maheshwari Sarees</span>
            <span className="text-[#E52E4E]">✨</span>
          </h2>
          <div className="sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 mt-3 sm:mt-0 flex justify-center sm:justify-end">
            <Link
              href="/products"
              prefetch={true}
              className="text-xs font-bold text-[#E52E4E] hover:underline flex items-center gap-1 bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-200/80 shadow-2xs hover:bg-rose-100 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <MobileProductSlider
          products={featuredSarees}
          emptyMessage="Loading Featured Sarees..."
          isFirstSection={true}
          viewAllLink="/products"
        />

        {/* Section View All Button */}
        <div className="flex justify-center mt-6">
          <Link
            href="/products"
            prefetch={true}
            className="px-8 py-3 bg-[#2D1214] hover:bg-[#581C1C] text-amber-100 font-serif font-bold text-xs uppercase tracking-widest rounded transition-colors shadow-sm inline-flex items-center gap-2 group cursor-pointer"
          >
            <span>View All Sarees</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 5. Bestseller Sarees Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <div className="text-center mb-4 sm:mb-6">
          <span className="text-xs sm:text-sm font-extrabold tracking-[0.25em] text-[#E52E4E] uppercase block mb-1">
            ROYAL SELECTION
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-extrabold text-[#2D1214] tracking-wide">
            Bestseller Sarees
          </h2>
        </div>

        {/* Filter Pill Tabs Bar */}
        <div className="w-full overflow-x-auto scrollbar-none mb-4 sm:mb-6">
          <div className="flex items-center justify-start sm:justify-center gap-2 min-w-max pb-2 px-2">
            {SAREE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSareeTab(tab.id)}
                className={`px-4 py-2 text-xs font-serif font-bold uppercase tracking-wider rounded border transition-all cursor-pointer ${
                  sareeTab === tab.id
                    ? 'bg-[#581C1C] text-amber-100 border-[#581C1C] shadow-xs'
                    : 'bg-white text-gray-700 hover:bg-amber-50 border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Saree Slider */}
        <MobileProductSlider
          products={filteredSarees}
          emptyMessage="No sarees found for this category."
        />

        {/* Section View All Button */}
        <div className="flex justify-center mt-6">
          <Link
            href="/products"
            prefetch={true}
            className="px-8 py-3 bg-[#2D1214] hover:bg-[#581C1C] text-amber-100 font-serif font-bold text-xs uppercase tracking-widest rounded transition-colors shadow-sm"
          >
            View All Sarees
          </Link>
        </div>
      </section>

      {/* 6. Bestsellers Suits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <div className="text-center mb-4 sm:mb-6">
          <span className="text-xs sm:text-sm font-extrabold tracking-[0.25em] text-[#E52E4E] uppercase block mb-1">
            HANDLOOM SUITS
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-extrabold text-[#2D1214] tracking-wide">
            Bestsellers Suits
          </h2>
        </div>

        {/* Suit Filter Pill Tabs Bar */}
        <div className="w-full overflow-x-auto scrollbar-none mb-4 sm:mb-6">
          <div className="flex items-center justify-start sm:justify-center gap-2 min-w-max pb-2 px-2">
            {SUIT_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSuitTab(tab.id)}
                className={`px-4 py-2 text-xs font-serif font-bold uppercase tracking-wider rounded border transition-all cursor-pointer ${
                  suitTab === tab.id
                    ? 'bg-[#581C1C] text-amber-100 border-[#581C1C] shadow-xs'
                    : 'bg-white text-gray-700 hover:bg-amber-50 border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Suit Slider */}
        <MobileProductSlider
          products={filteredSuits}
          emptyMessage="No suits found for this category."
        />

        {/* Section View All Button */}
        <div className="flex justify-center mt-6">
          <Link
            href="/products?category=maheshwari-suits"
            prefetch={true}
            className="px-8 py-3 bg-[#2D1214] hover:bg-[#581C1C] text-amber-100 font-serif font-bold text-xs uppercase tracking-widest rounded transition-colors shadow-sm"
          >
            View All Suits
          </Link>
        </div>
      </section>

      {/* 7. Browse By Category Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-xs sm:text-sm font-extrabold tracking-[0.25em] text-[#E52E4E] uppercase block mb-2">
            EXPLORE COLLECTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold text-[#2D1214] tracking-wide">
            Browse by Category
          </h2>
        </div>

        {/* Desktop View */}
        <div className="hidden md:grid md:grid-cols-4 gap-6">
          {[
            { title: 'New Arrivals', link: '/products', image: '/uploads/saree_1789233209397_zszzb.jpeg' },
            { title: 'Maheshwari Suits', link: '/products?category=maheshwari-suits', image: '/uploads/saree_1789221965397_lf0kg.jpeg' },
            { title: 'Dupattas', link: '/products?category=dupattas', image: '/uploads/saree_1789217759929_4m7x6.jpeg' },
            { title: 'Pure Silk Sarees', link: '/products?category=pure-silk-maheshwari', image: '/uploads/saree_1789215518469_xe8m4.jpeg' },
          ].map((cat, i) => (
            <Link
              key={i}
              href={cat.link}
              prefetch={true}
              className="group relative h-80 rounded-2xl overflow-hidden shadow-md border border-amber-950/10 block"
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes="(max-width: 768px) 74vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                <h3 className="font-serif font-extrabold text-xl text-amber-100 group-hover:text-white transition-colors">
                  {cat.title}
                </h3>
                <span className="text-xs font-medium text-amber-200 flex items-center gap-1 mt-1 group-hover:translate-x-1 transition-transform">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View */}
        <div className="block md:hidden relative group/browse">
          <div
            ref={browseCatScrollRef}
            className="flex gap-4 overflow-x-auto pb-4 pt-1 px-2 scrollbar-none snap-x snap-mandatory scroll-smooth overscroll-x-contain"
          >
            {[
              { title: 'New Arrivals', link: '/products', image: '/uploads/saree_1789233209397_zszzb.jpeg' },
              { title: 'Maheshwari Suits', link: '/products?category=maheshwari-suits', image: '/uploads/saree_1789221965397_lf0kg.jpeg' },
              { title: 'Dupattas', link: '/products?category=dupattas', image: '/uploads/saree_1789217759929_4m7x6.jpeg' },
              { title: 'Pure Silk Sarees', link: '/products?category=pure-silk-maheshwari', image: '/uploads/saree_1789215518469_xe8m4.jpeg' },
            ].map((cat, i) => (
              <Link
                key={i}
                href={cat.link}
                className="snap-start shrink-0 w-[74vw] max-w-[280px] h-72 rounded-2xl overflow-hidden shadow-md border border-amber-950/10 block relative group"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="280px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                  <h3 className="font-serif font-extrabold text-lg text-amber-100 group-hover:text-white transition-colors">
                    {cat.title}
                  </h3>
                  <span className="text-xs font-medium text-amber-200 flex items-center gap-1.5 mt-1.5 group-hover:translate-x-1 transition-transform">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile Sliding Controls & Indicator */}
          <div className="flex items-center justify-between px-2 mt-2">
            <div className="flex items-center gap-1 text-[11px] font-bold text-gray-500">
              <span>Swipe to explore</span>
              <ArrowRight className="w-3 h-3 text-[#E52E4E]" />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollBrowseCategories('left')}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-800 active:scale-95 cursor-pointer"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollBrowseCategories('right')}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-800 active:scale-95 cursor-pointer"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Handloom Stories & Blog Journal Section */}
      <HandloomBlogSection initialBlogs={initialBlogs} />

      {/* 9. Official Instagram Showcase (@reoti_handloom) */}
      <InstagramFamousSection />

      {/* 10. Frequently Asked Questions (Sleek Minimalist & Rich SEO Schema) */}
      <FaqSection />

      {/* 11. Google Customer Reviews Section */}
      <GoogleReviewsSection
        initialReviews={initialReviews}
        initialRating={initialRating}
        initialTotalReviews={initialTotalReviews}
      />

      {/* 11. Reoti Handloom Brand Commitment Section (Above Footer) */}
      <BrandCommitmentSection />
    </div>
  );
}
