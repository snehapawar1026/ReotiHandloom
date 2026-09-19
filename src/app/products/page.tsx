'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { ProductCard } from '@/components/ProductCard';
import { HandloomMotifDivider } from '@/components/HandloomMotifDivider';
import { WatermarkOverlay } from '@/components/WatermarkOverlay';
import { ProductItem } from '@/context/ShopContext';
import {
  SlidersHorizontal,
  ArrowUpDown,
  RefreshCw,
  X,
  Filter,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Flame,
  Check,
  Palette,
  Tag,
  Layers,
  Sparkle,
  Eye,
  EyeOff,
} from 'lucide-react';

const COLOR_PALETTE = [
  { name: 'Peach', label: 'Peach / Orange', hex: '#f97316' },
  { name: 'Blue', label: 'Sky Blue', hex: '#0284c7' },
  { name: 'Yellow', label: 'Yellow / Mustard', hex: '#eab308' },
  { name: 'Rose', label: 'Dusty Rose / Pink', hex: '#ec4899' },
  { name: 'Lavender', label: 'Lavender / Purple', hex: '#a855f7' },
  { name: 'Olive', label: 'Olive / Green', hex: '#16a34a' },
  { name: 'Red', label: 'Red / Crimson', hex: '#dc2626' },
  { name: 'Black', label: 'Black / Dark', hex: '#18181b' },
  { name: 'Beige', label: 'Beige / Cream', hex: '#d4d4d8' },
];

const CATEGORY_HERO_MAP: Record<string, { title: string; description: string; image: string }> = {
  'maheshwari-sarees': {
    title: 'Maheshwari Sarees',
    description:
      'Explore authentic handcrafted Maheshwari Sarees woven direct from master artisans of Rewa & Maheshwar. Celebrated for iconic Narmada river borders, rich zari work, and timeless royal heritage.',
    image: '/uploads/maheshwari_legacy_banner.png',
  },
  'garbha-reshami-special': {
    title: 'Garbha Reshami Silk Sarees',
    description:
      'Buy Garbha Reshami Silk Sarees online handcrafted by skilled weavers of Rewa situated in Maheshwar, Madhya Pradesh. Garbha Reshami from the name itself 75 percent Mulberry Silk in Garbha (in the womb) and 25 percent Mercerised Cotton, Shop online for authentic Maheshwari Garbha Reshami Sarees made from naturally dyed and pure natural threads on Handloom certified by India Handloom Brand ~ Rewa.',
    image: '/uploads/saree_1789221965397_lf0kg.jpeg',
  },
  'silk-cotton-maheshwari': {
    title: 'Silk Cotton Maheshwari Sarees',
    description:
      'Explore lightweight & comfortable Silk Cotton Maheshwari Sarees woven with pure mulberry silk warp and fine mercerised cotton weft. Handcrafted by master weavers in Maheshwar with traditional Bugdi, Zari, and Narmada river border motifs.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
  },
  'pure-silk-maheshwari': {
    title: 'Pure Silk Maheshwari Sarees',
    description:
      'Indulge in luxurious 100% Pure Silk Maheshwari Sarees adorned with rich golden zari borders and intricate woven butis. Perfect for royal weddings, grand celebrations, and festive occasions.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
  },
  'tissue-zari-maheshwari': {
    title: 'Tissue Zari Maheshwari Sarees',
    description:
      'Experience shimmering elegance with Tissue Zari Maheshwari Sarees featuring silver and gold zari threads woven continuously with pure silk. Delicate, lightweight, and radiant for evening celebrations.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80',
  },
  'katan-silk': {
    title: 'Katan Silk Maheshwari Sarees',
    description:
      'Experience the timeless elegance of authentic Maheshwari handloom in luxurious Katan Silk. Lightweight, graceful and beautifully woven with big traditional butas, reflecting the rich heritage of Maheshwar.',
    image: '/uploads/saree_1789221965397_lf0kg.jpeg',
  },
  'nayantara-maheshwari-handloom-sarees': {
    title: 'Nayantara Maheshwari Handloom Sarees',
    description:
      'Discover the timeless elegance of Nayantara Maheshwari Handloom Sarees, beautifully crafted to bring together traditional artistry and contemporary style. Woven by skilled artisans with Chokha border & detailed butis.',
    image: '/uploads/saree_1789233209397_zszzb.jpeg',
  },
  'semi-maheshwari-sarees': {
    title: 'Semi Maheshwari Sarees',
    description:
      'Lightweight Semi Maheshwari Sarees featuring elegant zari borders and beautiful traditional patterns. These sarees are not handcrafted or handloom, and are made using modern manufacturing techniques while maintaining the classic Maheshwari-inspired look. Perfect for festive occasions, celebrations, and everyday elegance.',
    image: '/uploads/semi_maheshwari_banner.jpg',
  },
};

const KANGURA_TRIANGLES = [
  { outer: '180.0,100.0 194.54,109.31 178.46,115.61', inner: '182.21,102.42 191.06,108.97 181.11,113.66', dot: [187.83, 108.65] },
  { outer: '178.46,115.61 190.91,127.58 173.91,130.61', inner: '180.16,118.41 187.56,126.56 176.88,129.22', dot: [184.45, 125.62] },
  { outer: '173.91,130.61 183.78,144.78 166.52,144.45', inner: '175.03,133.7 180.7,143.13 169.7,143.66', dot: [177.83, 141.6] },
  { outer: '166.52,144.45 173.44,160.27 156.57,156.57', inner: '167.01,147.69 170.73,158.05 159.85,156.42', dot: [168.22, 155.99] },
  { outer: '156.57,156.57 160.27,173.44 144.45,166.52', inner: '156.42,159.85 158.05,170.73 147.69,167.01', dot: [155.99, 168.22] },
  { outer: '144.45,166.52 144.78,183.78 130.61,173.91', inner: '143.66,169.7 143.13,180.7 133.7,175.03', dot: [141.6, 177.83] },
  { outer: '130.61,173.91 127.58,190.91 115.61,178.46', inner: '129.22,176.88 126.56,187.56 118.41,180.16', dot: [125.62, 184.45] },
  { outer: '115.61,178.46 109.31,194.54 100.0,180.0', inner: '113.66,181.11 108.97,191.06 102.42,182.21', dot: [108.65, 187.83] },
  { outer: '100.0,180.0 90.69,194.54 84.39,178.46', inner: '97.58,182.21 91.03,191.06 86.34,181.11', dot: [91.35, 187.83] },
  { outer: '84.39,178.46 72.42,190.91 69.39,173.91', inner: '81.59,180.16 73.44,187.56 70.78,176.88', dot: [74.38, 184.45] },
  { outer: '69.39,173.91 55.22,183.78 55.55,166.52', inner: '66.3,175.03 56.87,180.7 56.34,169.7', dot: [58.4, 177.83] },
  { outer: '55.55,166.52 39.73,173.44 43.43,156.57', inner: '52.31,167.01 41.95,170.73 43.58,159.85', dot: [44.01, 168.22] },
  { outer: '43.43,156.57 26.56,160.27 33.48,144.45', inner: '40.15,156.42 29.27,158.05 32.99,147.69', dot: [31.78, 155.99] },
  { outer: '33.48,144.45 16.22,144.78 26.09,130.61', inner: '30.3,143.66 19.3,143.13 24.97,133.7', dot: [22.17, 141.6] },
  { outer: '26.09,130.61 9.09,127.58 21.54,115.61', inner: '23.12,129.22 12.44,126.56 19.84,118.41', dot: [15.55, 125.62] },
  { outer: '21.54,115.61 5.46,109.31 20.0,100.0', inner: '18.89,113.66 8.94,108.97 17.79,102.42', dot: [12.17, 108.65] },
  { outer: '20.0,100.0 5.46,90.69 21.54,84.39', inner: '17.79,97.58 8.94,91.03 18.89,86.34', dot: [12.17, 91.35] },
  { outer: '21.54,84.39 9.09,72.42 26.09,69.39', inner: '19.84,81.59 12.44,73.44 23.12,70.78', dot: [15.55, 74.38] },
  { outer: '26.09,69.39 16.22,55.22 33.48,55.55', inner: '24.97,66.3 19.3,56.87 30.3,56.34', dot: [22.17, 58.4] },
  { outer: '33.48,55.55 26.56,39.73 43.43,43.43', inner: '32.99,52.31 29.27,41.95 40.15,43.58', dot: [31.78, 44.01] },
  { outer: '43.43,43.43 39.73,26.56 55.55,33.48', inner: '43.58,40.15 41.95,29.27 52.31,32.99', dot: [44.01, 31.78] },
  { outer: '55.55,33.48 55.22,16.22 69.39,26.09', inner: '56.34,30.3 56.87,19.3 66.3,24.97', dot: [58.4, 22.17] },
  { outer: '69.39,26.09 72.42,9.09 84.39,21.54', inner: '70.78,23.12 73.44,12.44 81.59,19.84', dot: [74.38, 15.55] },
  { outer: '84.39,21.54 90.69,5.46 100.0,20.0', inner: '86.34,18.89 91.03,8.94 97.58,17.79', dot: [91.35, 12.17] },
  { outer: '100.0,20.0 109.31,5.46 115.61,21.54', inner: '102.42,17.79 108.97,8.94 113.66,18.89', dot: [108.65, 12.17] },
  { outer: '115.61,21.54 127.58,9.09 130.61,26.09', inner: '118.41,19.84 126.56,12.44 129.22,23.12', dot: [125.62, 15.55] },
  { outer: '130.61,26.09 144.78,16.22 144.45,33.48', inner: '133.7,24.97 143.13,19.3 143.66,30.3', dot: [141.6, 22.17] },
  { outer: '144.45,33.48 160.27,26.56 156.57,43.43', inner: '147.69,32.99 158.05,29.27 156.42,40.15', dot: [155.99, 31.78] },
  { outer: '156.57,43.43 173.44,39.73 166.52,55.55', inner: '159.85,43.58 170.73,41.95 167.01,52.31', dot: [168.22, 44.01] },
  { outer: '166.52,55.55 183.78,55.22 173.91,69.39', inner: '169.7,56.34 180.7,56.87 175.03,66.3', dot: [177.83, 58.4] },
  { outer: '173.91,69.39 190.91,72.42 178.46,84.39', inner: '176.88,70.78 187.56,73.44 180.16,81.59', dot: [184.45, 74.38] },
  { outer: '178.46,84.39 194.54,90.69 180.0,100.0', inner: '181.11,86.34 191.06,91.03 182.21,97.58', dot: [187.83, 91.35] },
];

function getHeroContent(
  selectedCategory: string,
  selectedFabric: string,
  selectedColor: string,
  isTrending: boolean,
  isBestSeller: boolean,
  categories: any[]
) {
  if (selectedCategory) {
    const staticHero = CATEGORY_HERO_MAP[selectedCategory];
    const cat = categories.find((c) => c.slug === selectedCategory);
    if (staticHero || cat) {
      return {
        title: staticHero?.title || cat?.name || selectedCategory,
        description: staticHero?.description || cat?.description || `Handcrafted ${cat?.name || ''} online from authentic Maheshwari handloom weavers.`,
        image: staticHero?.image || cat?.bannerImage || cat?.image || '/uploads/maheshwari_legacy_banner.png',
      };
    }
  }

  if (selectedFabric) {
    const matchingKey = Object.keys(CATEGORY_HERO_MAP).find((key) =>
      CATEGORY_HERO_MAP[key].title.toLowerCase().includes(selectedFabric.toLowerCase())
    );
    if (matchingKey) return CATEGORY_HERO_MAP[matchingKey];
    return {
      title: `${selectedFabric} Maheshwari Sarees`,
      description: `Handcrafted ${selectedFabric} Maheshwari sarees woven by skilled artisans in Rewa & Maheshwar.`,
      image: '/uploads/saree_1789221965397_lf0kg.jpeg',
    };
  }

  if (isTrending) {
    return {
      title: '🔥 Trending Maheshwari Collection',
      description:
        'Explore our most sought-after and popular Maheshwari handloom sarees trending among saree connoisseurs across India.',
      image: '/uploads/saree_1789221965397_lf0kg.jpeg',
    };
  }

  if (isBestSeller) {
    return {
      title: '★ Best Seller Maheshwari Sarees',
      description:
        'Discover our highest-rated and most demanded authentic Maheshwari sarees, featuring iconic Narmada borders and fine zari craft.',
      image: '/uploads/saree_1789233209397_zszzb.jpeg',
    };
  }

  if (selectedColor) {
    return {
      title: `${selectedColor} Maheshwari Sarees`,
      description: `Handcrafted ${selectedColor} tone Maheshwari sarees woven with authentic zari borders and pure natural threads.`,
      image: '/uploads/saree_1789221965397_lf0kg.jpeg',
    };
  }

  return {
    title: 'Authentic Maheshwari Handloom Sarees',
    description:
      'Shop handcrafted Maheshwari Sarees directly from Rewa & Maheshwar artisans. Featuring authentic Silk Cotton, Pure Silk, Katan Silk, Garbha Reshami, and Tissue Zari with traditional Narmada and Bugdi borders.',
    image: '/uploads/maheshwari_legacy_banner.png',
  };
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [parentCategories, setParentCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Active URL Filters
  const selectedCategory = searchParams.get('category') || '';
  const selectedFabric = searchParams.get('fabric') || '';
  const selectedBorder = searchParams.get('borderType') || '';
  const selectedColor = searchParams.get('color') || '';
  const selectedSort = searchParams.get('sort') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const searchQuery = searchParams.get('search') || '';
  const isTrending = searchParams.get('trending') === 'true';
  const isBestSeller = searchParams.get('bestSeller') === 'true';
  const isFeatured = searchParams.get('featured') === 'true';
  const inStockOnly = searchParams.get('inStock') === 'true';

  const [isFilterOpenMobile, setIsFilterOpenMobile] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hideCategoryStrip, setHideCategoryStrip] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('reoti_hide_categories');
      if (saved === 'true') setHideCategoryStrip(true);
    }
  }, []);

  const toggleHideCategoryStrip = () => {
    const next = !hideCategoryStrip;
    setHideCategoryStrip(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('reoti_hide_categories', String(next));
    }
  };

  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const subCategoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollSubCategories = (direction: 'left' | 'right') => {
    if (subCategoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      subCategoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const t = Date.now();
    Promise.all([
      fetch(`/api/categories?parentOnly=true&_t=${t}`, { cache: 'no-store' }).then((res) => res.json()),
      fetch(`/api/categories?_t=${t}`, { cache: 'no-store' }).then((res) => res.json()),
    ])
      .then(([parentData, allCatData]) => {
        if (parentData.success) setParentCategories(parentData.categories || []);
        if (allCatData.success) setCategories(allCatData.categories || []);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedFabric) params.set('fabric', selectedFabric);
    if (selectedBorder) params.set('borderType', selectedBorder);
    if (selectedColor) params.set('color', selectedColor);
    if (searchQuery) params.set('search', searchQuery);
    if (selectedSort) params.set('sort', selectedSort);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (isTrending) params.set('trending', 'true');
    if (isBestSeller) params.set('bestSeller', 'true');
    if (isFeatured) params.set('featured', 'true');
    params.set('_t', String(Date.now()));

    fetch(`/api/products?${params.toString()}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.products || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [
    selectedCategory,
    selectedFabric,
    selectedBorder,
    selectedColor,
    searchQuery,
    selectedSort,
    minPrice,
    maxPrice,
    isTrending,
    isBestSeller,
    isFeatured,
  ]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  const setPriceRange = (min: string, max: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set('minPrice', min);
    else params.delete('minPrice');

    if (max) params.set('maxPrice', max);
    else params.delete('maxPrice');

    router.push(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push('/products');
  };

  const activeFiltersCount = [
    selectedCategory,
    selectedFabric,
    selectedBorder,
    selectedColor,
    minPrice,
    maxPrice,
    searchQuery,
    isTrending ? 'trending' : '',
    isBestSeller ? 'bestseller' : '',
    isFeatured ? 'featured' : '',
  ].filter(Boolean).length;

  const currentCategoryObj = categories.find(
    (c) => c.slug === selectedCategory || c.id === selectedCategory
  );
  const effectiveParentCat = currentCategoryObj?.parentId
    ? categories.find((c) => c.id === currentCategoryObj.parentId)
    : currentCategoryObj;

  const isSemiMaheshwariView = Boolean(
    selectedCategory === 'semi-maheshwari-sarees' ||
    selectedCategory === 'semi-maheshwari' ||
    currentCategoryObj?.slug?.includes('semi-maheshwari') ||
    currentCategoryObj?.name?.toLowerCase().includes('semi maheshwari') ||
    effectiveParentCat?.slug?.includes('semi-maheshwari') ||
    effectiveParentCat?.name?.toLowerCase().includes('semi maheshwari')
  );

  const semiParent = categories.find(
    (c) =>
      c.slug === 'semi-maheshwari-sarees' ||
      c.slug === 'semi-maheshwari' ||
      c.id === 'semi-maheshwari-sarees-id' ||
      c.name?.toLowerCase().includes('semi maheshwari')
  ) || {
    id: 'semi-maheshwari-sarees-id',
    slug: 'semi-maheshwari-sarees',
    name: 'Semi Maheshwari',
    image: '/uploads/semi_maheshwari_banner.jpg',
  };

  const semiSubcategories = categories.filter(
    (c) =>
      (c.parentId === semiParent.id ||
        c.slug?.startsWith('semi-maheshwari-') ||
        c.parentId === 'semi-maheshwari-sarees-id' ||
        c.parentId === 'semi-maheshwari-sarees') &&
      c.id !== semiParent.id &&
      c.slug !== 'semi-maheshwari-sarees' &&
      c.slug !== 'semi-maheshwari' &&
      !c.isHidden
  );

  const handloomParentCategories = parentCategories.filter(
    (c) =>
      !c.slug?.includes('semi-maheshwari') &&
      !c.name?.toLowerCase().includes('semi maheshwari') &&
      c.id !== semiParent.id
  );

  const hasCategoryOrFilterSelected = Boolean(
    selectedCategory || selectedFabric || isTrending || isBestSeller || isFeatured || selectedColor
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      {/* Breadcrumb Path & Header Reset Button */}
      <div className="text-xs text-gray-500 mb-4 font-medium flex items-center justify-between">
        <div>
          <span className="hover:text-rose-600 cursor-pointer" onClick={() => router.push('/')}>Home</span>
          <span className="mx-1.5">/</span>
          <span className="hover:text-rose-600 cursor-pointer" onClick={() => router.push('/products')}>Catalog</span>
          <span className="mx-1.5">/</span>
          <span className="text-gray-900 font-bold">
            {selectedCategory
              ? categories.find((c) => c.slug === selectedCategory)?.name || 'Category'
              : 'Maheshwari Sarees'}
          </span>
        </div>

        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs font-extrabold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1 rounded-full transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
          >
            <RefreshCw className="w-3 h-3 text-rose-600" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>

      {/* Full-Width Category Split Hero Banner */}
      {hasCategoryOrFilterSelected && (() => {
        const hero = getHeroContent(
          selectedCategory,
          selectedFabric,
          selectedColor,
          isTrending,
          isBestSeller,
          categories
        );

        const isLegacyAhilyabai = hero.image.includes('maheshwari_legacy_banner');

        return (
          <div className="w-full bg-[#FAF7F2] border border-[#E8DFC8] rounded-2xl overflow-hidden mb-6 shadow-2xs font-sans">
            <div className="grid grid-cols-1 md:grid-cols-12 items-center">
              {/* Left Side: Craft Story & Title */}
              <div className="md:col-span-6 lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-center text-center space-y-3 overflow-hidden">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-serif font-extrabold text-[#581C1C] tracking-tight leading-tight">
                  {hero.title}{' '}
                  <span className="font-serif font-normal text-[#8B4513] text-xl sm:text-2xl lg:text-3xl block sm:inline mt-1 sm:mt-0">
                    {isSemiMaheshwariView
                      ? 'सेमी माहेश्वरी साड़ियाँ'
                      : selectedCategory.includes('suit')
                      ? 'माहेश्वरी सूट सेट्स'
                      : selectedCategory.includes('dupatta')
                      ? 'दुपट्टे'
                      : 'माहेश्वरी साड़ियाँ'}
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-[#8B4513]/80 font-bold tracking-wider uppercase">
                  {isSemiMaheshwariView
                    ? 'सेमी माहेश्वरी साड़ियाँ ~ সেমি মাহেশ্বরী শাড়ি ~ செமி மகேஸ்வரி புடவைகள் ~ સેમી મહેશ્વરી સાડીઓ'
                    : selectedCategory.includes('suit')
                    ? 'माहेश्वरी सूट ~ মাহেশ্বরী স্যুট ~ மகேஸ்வரி சூட்கள் ~ મહેશ્વરી સૂટ'
                    : 'माहेश्वरी साड़ियाँ ~ माहेश्वरी শাড়ি ~ மகேஸ்வரி புடவைகள் ~ મહેશ્વરી સાડીઓ'}
                </p>
                <p className="text-xs sm:text-sm text-amber-950/90 leading-relaxed font-medium max-w-xl mx-auto line-clamp-4 sm:line-clamp-none">
                  {hero.description}
                </p>
              </div>

              {/* Right Side: 100% Filled Image Container */}
              <div className="md:col-span-6 lg:col-span-5 relative w-full h-64 sm:h-72 md:h-[260px] lg:h-[280px] overflow-hidden bg-amber-950 shrink-0">
                <img
                  src={hero.image}
                  alt={hero.title}
                  className={`w-full h-full ${
                    isLegacyAhilyabai
                      ? 'object-cover object-[30%_20%]'
                      : 'object-cover object-center'
                  }`}
                />
                
                {/* Reoti Handloom Watermark Overlay */}
                <WatermarkOverlay variant="pdp" />

                {/* Soft Bottom Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Authentic Reoti Handloom Heritage Watermark Badge */}
                <div className="absolute bottom-3 right-3 bg-black/85 backdrop-blur-md text-amber-100 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border border-amber-400/50 pointer-events-none flex items-center gap-1.5 shadow-lg z-10">
                  <div className="w-4 h-4 rounded-full overflow-hidden border border-amber-300 shrink-0">
                    <img src="/logo.jpg" alt="Reoti Logo" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-serif font-extrabold text-[#FDE68A] tracking-wider text-[10px]">
                    REOTI HANDLOOM
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <div className="w-full">
        {/* Main Content Area (Full-Width Rewa Handloom Style Layout) */}
        <main className="w-full space-y-4">

          {/* Active Filter Chips Pill Bar (Nykaa Screenshot Style) */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 py-2 border-b border-gray-200">
              <span className="text-xs font-extrabold text-gray-900 mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-rose-600" />
                <span>Active Filters:</span>
              </span>

              <button
                onClick={clearAllFilters}
                className="text-xs font-extrabold text-rose-700 hover:text-rose-900 px-3 py-1 bg-rose-100/80 hover:bg-rose-200 rounded-full border border-rose-300 transition-colors shadow-2xs cursor-pointer"
              >
                Reset All
              </button>

              {selectedColor && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-gray-900 border border-gray-300 px-3 py-1 rounded-full shadow-2xs">
                  <span className="w-2.5 h-2.5 rounded-full border border-gray-400" style={{ backgroundColor: COLOR_PALETTE.find(c => c.name.toLowerCase() === selectedColor.toLowerCase())?.hex || '#94a3b8' }} />
                  <span>Color: {selectedColor}</span>
                  <X className="w-3.5 h-3.5 text-gray-500 hover:text-rose-600 cursor-pointer" onClick={() => updateFilter('color', '')} />
                </span>
              )}

              {selectedCategory && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-gray-900 border border-gray-300 px-3 py-1 rounded-full shadow-2xs">
                  <span>Category: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}</span>
                  <X className="w-3.5 h-3.5 text-gray-500 hover:text-rose-600 cursor-pointer" onClick={() => updateFilter('category', '')} />
                </span>
              )}

              {selectedFabric && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-gray-900 border border-gray-300 px-3 py-1 rounded-full shadow-2xs">
                  <span>Fabric: {selectedFabric}</span>
                  <X className="w-3.5 h-3.5 text-gray-500 hover:text-rose-600 cursor-pointer" onClick={() => updateFilter('fabric', '')} />
                </span>
              )}

              {selectedBorder && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-gray-900 border border-gray-300 px-3 py-1 rounded-full shadow-2xs">
                  <span>Border: {selectedBorder}</span>
                  <X className="w-3.5 h-3.5 text-gray-500 hover:text-rose-600 cursor-pointer" onClick={() => updateFilter('borderType', '')} />
                </span>
              )}

              {(minPrice || maxPrice) && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-gray-900 border border-gray-300 px-3 py-1 rounded-full shadow-2xs">
                  <span>Price: {minPrice ? `₹${minPrice}` : 'Min'} - {maxPrice ? `₹${maxPrice}` : 'Max'}</span>
                  <X className="w-3.5 h-3.5 text-gray-500 hover:text-rose-600 cursor-pointer" onClick={() => setPriceRange('', '')} />
                </span>
              )}

              {isTrending && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-orange-50 text-orange-900 border border-orange-200 px-3 py-1 rounded-full shadow-2xs">
                  <span>🔥 Trending</span>
                  <X className="w-3.5 h-3.5 text-orange-600 hover:text-orange-900 cursor-pointer" onClick={() => updateFilter('trending', '')} />
                </span>
              )}

              {isBestSeller && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-rose-50 text-rose-900 border border-rose-200 px-3 py-1 rounded-full shadow-2xs">
                  <span>★ Best Seller</span>
                  <X className="w-3.5 h-3.5 text-rose-600 hover:text-rose-900 cursor-pointer" onClick={() => updateFilter('bestSeller', '')} />
                </span>
              )}

              {isFeatured && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full shadow-2xs">
                  <span>✨ Featured</span>
                  <X className="w-3.5 h-3.5 text-amber-600 hover:text-amber-900 cursor-pointer" onClick={() => updateFilter('featured', '')} />
                </span>
              )}
            </div>
          )}

          {/* Authentic Maheshwari / Semi Maheshwari Circular Scalloped Category Avatars Carousel with Left & Right Arrows */}
          <div className="relative group w-full bg-[#FAF7F2]/80 border-y border-[#E8DFC8] py-5 mb-3">
              
              {/* Left Carousel Arrow Button */}
              <button
                onClick={() => scrollCategories('left')}
                className="hidden sm:flex absolute left-2 top-[42%] -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/95 text-[#581C1C] border border-[#E8DFC8] shadow-lg hover:bg-[#581C1C] hover:text-amber-100 transition-all items-center justify-center cursor-pointer active:scale-95"
                aria-label="Scroll Left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Right Carousel Arrow Button */}
              <button
                onClick={() => scrollCategories('right')}
                className="hidden sm:flex absolute right-2 top-[42%] -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/95 text-[#581C1C] border border-[#E8DFC8] shadow-lg hover:bg-[#581C1C] hover:text-amber-100 transition-all items-center justify-center cursor-pointer active:scale-95"
                aria-label="Scroll Right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Scrollable Container */}
              <div
                ref={categoryScrollRef}
                className="w-full overflow-x-auto scrollbar-none px-6 sm:px-12"
              >
                <div className="flex items-start gap-5 sm:gap-7 min-w-max">
                
                {isSemiMaheshwariView ? (
                  <>
                    {/* ALL SEMI MAHESHWARI Circular Avatar */}
                    {(() => {
                      const isAllSemiSelected =
                        selectedCategory === 'semi-maheshwari-sarees' ||
                        selectedCategory === 'semi-maheshwari' ||
                        selectedCategory === semiParent.slug ||
                        !selectedCategory;
                      return (
                        <button
                          onClick={() => updateFilter('category', 'semi-maheshwari-sarees')}
                          className="flex flex-col items-center group cursor-pointer"
                        >
                          <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 flex items-center justify-center shrink-0">
                            {/* Thin Outline Kangura / Triangular Motif Ring SVG matching user image */}
                            <svg
                              className={`absolute inset-0 w-full h-full transition-all duration-300 ${
                                isAllSemiSelected
                                  ? 'text-[#581C1C] scale-105 drop-shadow-[0_2px_5px_rgba(88,28,28,0.25)]'
                                  : 'text-[#8B4513]/70 group-hover:text-[#581C1C] group-hover:scale-105'
                              }`}
                              viewBox="0 0 200 200"
                            >
                              {/* Inner boundary circle */}
                              <circle
                                cx="100"
                                cy="100"
                                r="80"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={isAllSemiSelected ? "1.2" : "0.9"}
                              />
                              {/* Pointed Kangura Triangles */}
                              {KANGURA_TRIANGLES.map((t, idx) => (
                                <g key={idx}>
                                  <polygon
                                    points={t.outer}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={isAllSemiSelected ? "1.2" : "0.9"}
                                    strokeLinejoin="round"
                                  />
                                  <polygon
                                    points={t.inner}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={isAllSemiSelected ? "0.8" : "0.6"}
                                    strokeLinejoin="round"
                                    opacity="0.8"
                                  />
                                  <circle
                                    cx={t.dot[0]}
                                    cy={t.dot[1]}
                                    r="1.1"
                                    fill="currentColor"
                                  />
                                </g>
                              ))}
                            </svg>
                            {/* Inner Circle Saree Image */}
                            <div className={`w-[84px] h-[84px] sm:w-[96px] sm:h-[96px] md:w-[108px] md:h-[108px] rounded-full overflow-hidden p-1 bg-white border shadow-md flex items-center justify-center ${
                              isAllSemiSelected ? 'border-2 border-[#581C1C] ring-2 ring-rose-300' : 'border-amber-950/20'
                            }`}>
                              <img
                                src={semiParent.image || '/uploads/semi_maheshwari_banner.jpg'}
                                alt="All Semi Maheshwari"
                                className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          </div>
                          <span className={`text-xs sm:text-sm font-serif font-bold mt-2 text-center leading-tight max-w-[110px] sm:max-w-[130px] ${
                            isAllSemiSelected ? 'text-[#581C1C] font-extrabold underline underline-offset-4' : 'text-gray-900 group-hover:text-[#581C1C]'
                          }`}>
                            All Semi Maheshwari
                          </span>
                        </button>
                      );
                    })()}

                    {/* Semi Maheshwari Sub-Categories */}
                    {semiSubcategories.map((cat) => {
                      const isSelected = selectedCategory === cat.slug;
                      const imgUrl = cat.image || cat.bannerImage || semiParent.image || '/uploads/semi_maheshwari_banner.jpg';
                      return (
                        <button
                          key={cat.id || cat.slug}
                          onClick={() => updateFilter('category', isSelected ? 'semi-maheshwari-sarees' : cat.slug)}
                          className="flex flex-col items-center group cursor-pointer"
                        >
                          <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 flex items-center justify-center shrink-0">
                            {/* Thin Outline Kangura / Triangular Motif Ring SVG matching user image */}
                            <svg
                              className={`absolute inset-0 w-full h-full transition-all duration-300 ${
                                isSelected
                                  ? 'text-[#581C1C] scale-105 drop-shadow-[0_2px_5px_rgba(88,28,28,0.25)]'
                                  : 'text-[#8B4513]/70 group-hover:text-[#581C1C] group-hover:scale-105'
                              }`}
                              viewBox="0 0 200 200"
                            >
                              {/* Inner boundary circle */}
                              <circle
                                cx="100"
                                cy="100"
                                r="80"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={isSelected ? "1.2" : "0.9"}
                              />
                              {/* Pointed Kangura Triangles */}
                              {KANGURA_TRIANGLES.map((t, idx) => (
                                <g key={idx}>
                                  <polygon
                                    points={t.outer}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={isSelected ? "1.2" : "0.9"}
                                    strokeLinejoin="round"
                                  />
                                  <polygon
                                    points={t.inner}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={isSelected ? "0.8" : "0.6"}
                                    strokeLinejoin="round"
                                    opacity="0.8"
                                  />
                                  <circle
                                    cx={t.dot[0]}
                                    cy={t.dot[1]}
                                    r="1.1"
                                    fill="currentColor"
                                  />
                                </g>
                              ))}
                            </svg>
                            {/* Inner Circle Saree Image */}
                            <div className={`w-[84px] h-[84px] sm:w-[96px] sm:h-[96px] md:w-[108px] md:h-[108px] rounded-full overflow-hidden p-1 bg-white border shadow-md flex items-center justify-center ${
                              isSelected ? 'border-2 border-[#581C1C] ring-2 ring-rose-300' : 'border-amber-950/20'
                            }`}>
                              <img
                                src={imgUrl}
                                alt={cat.name}
                                className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          </div>
                          <span className={`text-xs sm:text-sm font-serif font-bold mt-2 text-center leading-snug max-w-[110px] sm:max-w-[135px] ${
                            isSelected ? 'text-[#581C1C] font-extrabold underline underline-offset-4' : 'text-gray-900 group-hover:text-[#581C1C]'
                          }`}>
                            {cat.name}
                          </span>
                        </button>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {/* ALL SAREES Circular Avatar */}
                    <button
                      onClick={() => updateFilter('category', '')}
                      className="flex flex-col items-center group cursor-pointer"
                    >
                      <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 flex items-center justify-center shrink-0">
                        <svg
                          className={`absolute inset-0 w-full h-full transition-colors duration-300 ${
                            !selectedCategory ? 'text-[#581C1C]' : 'text-[#8B4513]/70 group-hover:text-[#581C1C]'
                          }`}
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
                          <circle cx="50" cy="50" r="39" stroke="currentColor" strokeWidth={!selectedCategory ? '3' : '2'} />
                        </svg>
                        <div className="w-[96px] h-[96px] sm:w-[110px] sm:h-[110px] md:w-[124px] md:h-[124px] rounded-full overflow-hidden p-1 bg-white border border-amber-950/20 shadow-md">
                          <img
                            src="/uploads/saree_1789221965397_lf0kg.jpeg"
                            alt="All Sarees"
                            className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      </div>
                      <span className={`text-xs sm:text-sm font-serif font-bold mt-2 text-center leading-tight max-w-[110px] sm:max-w-[130px] ${
                        !selectedCategory ? 'text-[#581C1C] font-extrabold underline underline-offset-4' : 'text-gray-900 group-hover:text-[#581C1C]'
                      }`}>
                        All Sarees
                      </span>
                    </button>

                    {/* Dynamic Parent Category Circular Avatars Only */}
                    {handloomParentCategories.map((cat) => {
                      const isSelected = selectedCategory === cat.slug;
                      const imgUrl = cat.image || CATEGORY_HERO_MAP[cat.slug]?.image || '/uploads/saree_1789221965397_lf0kg.jpeg';
                      return (
                        <button
                          key={cat.id}
                          onClick={() => updateFilter('category', isSelected ? '' : cat.slug)}
                          className="flex flex-col items-center group cursor-pointer"
                        >
                          <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 flex items-center justify-center shrink-0">
                            <svg
                              className={`absolute inset-0 w-full h-full transition-colors duration-300 ${
                                isSelected ? 'text-[#581C1C]' : 'text-[#8B4513]/70 group-hover:text-[#581C1C]'
                              }`}
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
                              <circle cx="50" cy="50" r="39" stroke="currentColor" strokeWidth={isSelected ? '3' : '2'} />
                            </svg>
                            <div className="w-[96px] h-[96px] sm:w-[110px] sm:h-[110px] md:w-[124px] md:h-[124px] rounded-full overflow-hidden p-1 bg-white border border-amber-950/20 shadow-md">
                              <img
                                src={imgUrl}
                                alt={cat.name}
                                className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          </div>
                          <span className={`text-xs sm:text-sm font-serif font-bold mt-2 text-center leading-snug max-w-[110px] sm:max-w-[135px] ${
                            isSelected ? 'text-[#581C1C] font-extrabold underline underline-offset-4' : 'text-gray-900 group-hover:text-[#581C1C]'
                          }`}>
                            {cat.name}
                          </span>
                        </button>
                      );
                    })}
                  </>
                )}

              </div>
            </div>
          </div>

          {/* Rewa Handloom Style Horizontal Filter Bar (Matching media_1789234404852.png) */}
          <div className="w-full bg-[#FAF7F2]/90 border border-[#E8DFC8] rounded-xl p-3 shadow-2xs font-sans flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="text-xs font-serif font-extrabold text-[#581C1C] tracking-wide">
              <span>{products.length} {isSemiMaheshwariView ? 'Semi Maheshwari' : 'Maheshwari'} {products.length === 1 ? 'Saree' : 'Sarees'}</span>
            </div>

            {/* Horizontal Filter Pill Dropdowns */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              
              {/* CATEGORY Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
                  className={`px-3 py-1.5 border rounded-lg uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
                    selectedCategory ? 'border-[#581C1C] bg-[#581C1C] text-white font-bold' : 'border-amber-950/40 bg-white hover:border-amber-950 text-amber-950'
                  }`}
                >
                  <span>{selectedCategory ? (categories.find(c => c.slug === selectedCategory)?.name || 'CATEGORY') : 'CATEGORY'}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {openDropdown === 'category' && (
                  <div className="absolute right-0 mt-1 w-56 bg-white border border-amber-200 rounded-xl shadow-xl z-40 p-2 space-y-1">
                    {isSemiMaheshwariView ? (
                      <>
                        <button
                          onClick={() => { updateFilter('category', 'semi-maheshwari-sarees'); setOpenDropdown(null); }}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${selectedCategory === 'semi-maheshwari-sarees' || selectedCategory === semiParent.slug ? 'bg-amber-50 font-extrabold text-[#581C1C]' : 'hover:bg-gray-50 text-gray-700'}`}
                        >
                          All Semi Maheshwari
                        </button>
                        {semiSubcategories.map((cat) => (
                          <button
                            key={cat.id || cat.slug}
                            onClick={() => { updateFilter('category', cat.slug); setOpenDropdown(null); }}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${selectedCategory === cat.slug ? 'bg-amber-50 font-extrabold text-[#581C1C]' : 'hover:bg-gray-50 text-gray-700'}`}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => { updateFilter('category', ''); setOpenDropdown(null); }}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${!selectedCategory ? 'bg-amber-50 font-extrabold text-[#581C1C]' : 'hover:bg-gray-50 text-gray-700'}`}
                        >
                          All Categories
                        </button>
                        {categories
                          .filter((c) => !c.slug?.includes('semi-maheshwari') && !c.name?.toLowerCase().includes('semi maheshwari') && c.parentId !== semiParent.id)
                          .map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => { updateFilter('category', cat.slug); setOpenDropdown(null); }}
                              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${selectedCategory === cat.slug ? 'bg-amber-50 font-extrabold text-[#581C1C]' : 'hover:bg-gray-50 text-gray-700'}`}
                            >
                              {cat.name}
                            </button>
                          ))}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* COLOR Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'color' ? null : 'color')}
                  className={`px-3 py-1.5 border rounded-lg uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
                    selectedColor ? 'border-[#581C1C] bg-[#581C1C] text-white font-bold' : 'border-amber-950/40 bg-white hover:border-amber-950 text-amber-950'
                  }`}
                >
                  <span>{selectedColor ? `COLOR: ${selectedColor}` : 'COLOR'}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {openDropdown === 'color' && (
                  <div className="absolute right-0 mt-1 w-52 bg-white border border-amber-200 rounded-xl shadow-xl z-40 p-2 space-y-1 max-h-60 overflow-y-auto">
                    <button
                      onClick={() => { updateFilter('color', ''); setOpenDropdown(null); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${!selectedColor ? 'bg-amber-50 font-extrabold text-[#581C1C]' : 'hover:bg-gray-50 text-gray-700'}`}
                    >
                      All Colors
                    </button>
                    {COLOR_PALETTE.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => { updateFilter('color', c.name); setOpenDropdown(null); }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 ${selectedColor.toLowerCase() === c.name.toLowerCase() ? 'bg-amber-50 font-extrabold text-[#581C1C]' : 'hover:bg-gray-50 text-gray-700'}`}
                      >
                        <span className="w-3 h-3 rounded-full border shrink-0" style={{ backgroundColor: c.hex }} />
                        <span>{c.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* AVAILABILITY Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'availability' ? null : 'availability')}
                  className={`px-3 py-1.5 border rounded-lg uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
                    inStockOnly ? 'border-[#581C1C] bg-[#581C1C] text-white font-bold' : 'border-amber-950/40 bg-white hover:border-amber-950 text-amber-950'
                  }`}
                >
                  <span>{inStockOnly ? 'IN STOCK' : 'AVAILABILITY'}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {openDropdown === 'availability' && (
                  <div className="absolute right-0 mt-1 w-44 bg-white border border-amber-200 rounded-xl shadow-xl z-40 p-2 space-y-1">
                    <button
                      onClick={() => { updateFilter('inStock', ''); setOpenDropdown(null); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${!inStockOnly ? 'bg-amber-50 font-extrabold text-[#581C1C]' : 'hover:bg-gray-50 text-gray-700'}`}
                    >
                      All Sarees
                    </button>
                    <button
                      onClick={() => { updateFilter('inStock', 'true'); setOpenDropdown(null); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${inStockOnly ? 'bg-amber-50 font-extrabold text-[#581C1C]' : 'hover:bg-gray-50 text-gray-700'}`}
                    >
                      In Stock Only
                    </button>
                  </div>
                )}
              </div>

              {/* PRICE Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}
                  className={`px-3 py-1.5 border rounded-lg uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
                    minPrice || maxPrice ? 'border-[#581C1C] bg-[#581C1C] text-white font-bold' : 'border-amber-950/40 bg-white hover:border-amber-950 text-amber-950'
                  }`}
                >
                  <span>{minPrice || maxPrice ? 'PRICE FILTERED' : 'PRICE'}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {openDropdown === 'price' && (
                  <div className="absolute right-0 mt-1 w-48 bg-white border border-amber-200 rounded-xl shadow-xl z-40 p-2 space-y-1">
                    <button onClick={() => { setPriceRange('', ''); setOpenDropdown(null); }} className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${!minPrice && !maxPrice ? 'bg-amber-50 font-extrabold text-[#581C1C]' : 'hover:bg-gray-50 text-gray-700'}`}>All Prices</button>
                    <button onClick={() => { setPriceRange('', '3000'); setOpenDropdown(null); }} className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${maxPrice === '3000' ? 'bg-amber-50 font-extrabold text-[#581C1C]' : 'hover:bg-gray-50 text-gray-700'}`}>Under ₹3,000</button>
                    <button onClick={() => { setPriceRange('3000', '5000'); setOpenDropdown(null); }} className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${minPrice === '3000' && maxPrice === '5000' ? 'bg-amber-50 font-extrabold text-[#581C1C]' : 'hover:bg-gray-50 text-gray-700'}`}>₹3,000 - ₹5,000</button>
                    <button onClick={() => { setPriceRange('5000', '10000'); setOpenDropdown(null); }} className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${minPrice === '5000' && maxPrice === '10000' ? 'bg-amber-50 font-extrabold text-[#581C1C]' : 'hover:bg-gray-50 text-gray-700'}`}>₹5,000 - ₹10,000</button>
                    <button onClick={() => { setPriceRange('10000', ''); setOpenDropdown(null); }} className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${minPrice === '10000' ? 'bg-amber-50 font-extrabold text-[#581C1C]' : 'hover:bg-gray-50 text-gray-700'}`}>Above ₹10,000</button>
                  </div>
                )}
              </div>

              {/* SHOW ALL / RESET Button (Exact Rewa style) */}
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-3.5 py-1.5 border border-amber-950/60 bg-amber-50 hover:bg-amber-100 text-amber-950 font-extrabold uppercase tracking-wider rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-900" />
                <span>SHOW ALL</span>
              </button>

              {/* SORT BY Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
                  className="px-3 py-1.5 border border-amber-950/40 bg-white hover:border-amber-950 text-amber-950 rounded-lg uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <span>SORT BY</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {openDropdown === 'sort' && (
                  <div className="absolute right-0 mt-1 w-52 bg-white border border-amber-200 rounded-xl shadow-xl z-40 p-2 space-y-1">
                    <button onClick={() => { updateFilter('sort', ''); setOpenDropdown(null); }} className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-amber-50 text-gray-700">Popularity & Newest</button>
                    <button onClick={() => { updateFilter('sort', 'price-low'); setOpenDropdown(null); }} className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-amber-50 text-gray-700">Price: Low to High</button>
                    <button onClick={() => { updateFilter('sort', 'price-high'); setOpenDropdown(null); }} className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-amber-50 text-gray-700">Price: High to Low</button>
                    <button onClick={() => { updateFilter('sort', 'rating'); setOpenDropdown(null); }} className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-amber-50 text-gray-700">Customer Rating</button>
                    <button onClick={() => { updateFilter('sort', 'discount'); setOpenDropdown(null); }} className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-amber-50 text-gray-700">Highest Discount</button>
                  </div>
                )}
              </div>

            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-gray-500 space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-rose-600" />
              <p className="text-xs font-bold">Applying Filters & Fetching Sarees...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center bg-slate-50 rounded-2xl border border-gray-200 p-8 max-w-lg mx-auto space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-gray-900">No Sarees Found Matching Filters</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                No products match the selected color or combination. Try resetting your active filters to see all available Maheshwari sarees!
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-2 px-6 py-2.5 bg-rose-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-sm hover:bg-rose-700 transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Slide-over Drawer Modal */}
      {isFilterOpenMobile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end font-sans md:hidden">
          <div className="w-full max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between animate-fade-in">
            {/* Drawer Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-rose-50">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-rose-600" />
                <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-wider">
                  FILTERS ({products.length})
                </h3>
              </div>
              <button
                onClick={() => setIsFilterOpenMobile(false)}
                className="p-1 rounded-full bg-white border border-gray-300 text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-4 overflow-y-auto space-y-6 flex-1">
              
              {/* Category Filter (TOPMOST FILTER) */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-rose-600" />
                  <span>Select Category</span>
                </h4>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => updateFilter('category', '')}
                    className={`w-full text-left py-2 px-3 rounded-lg border ${
                      !selectedCategory ? 'bg-rose-600 text-white font-extrabold' : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateFilter('category', selectedCategory === cat.slug ? '' : cat.slug)}
                      className={`w-full text-left py-2 px-3 rounded-lg border font-semibold ${
                        selectedCategory === cat.slug ? 'bg-rose-50 border-rose-300 text-rose-900 font-extrabold' : 'border-gray-200 text-gray-700'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Filter Swatches */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-rose-600" />
                  <span>Select Color</span>
                </h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {COLOR_PALETTE.map((c) => {
                    const isSelected = selectedColor.toLowerCase() === c.name.toLowerCase();
                    return (
                      <button
                        key={c.name}
                        onClick={() => updateFilter('color', isSelected ? '' : c.name)}
                        className={`py-2 px-2 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
                          isSelected ? 'border-rose-600 bg-rose-50 text-rose-900 font-extrabold' : 'border-gray-200 text-gray-700'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full border shrink-0" style={{ backgroundColor: c.hex }} />
                        <span className="truncate">{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Collections Filter */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-600" />
                  <span>Collections</span>
                </h4>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => updateFilter('trending', isTrending ? '' : 'true')}
                    className={`w-full text-left py-2 px-3 rounded-lg border font-semibold ${
                      isTrending ? 'bg-orange-50 border-orange-300 text-orange-900 font-extrabold' : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    🔥 Trending Collection
                  </button>
                  <button
                    onClick={() => updateFilter('bestSeller', isBestSeller ? '' : 'true')}
                    className={`w-full text-left py-2 px-3 rounded-lg border font-semibold ${
                      isBestSeller ? 'bg-rose-50 border-rose-300 text-rose-900 font-extrabold' : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    ★ Best Sellers
                  </button>
                  <button
                    onClick={() => updateFilter('featured', isFeatured ? '' : 'true')}
                    className={`w-full text-left py-2 px-3 rounded-lg border font-semibold ${
                      isFeatured ? 'bg-amber-50 border-amber-300 text-amber-900 font-extrabold' : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    ✨ Featured Heritage
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Footer CTA */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3">
              <button
                onClick={() => {
                  clearAllFilters();
                  setIsFilterOpenMobile(false);
                }}
                className="flex-1 py-3 border border-gray-300 rounded-lg text-xs font-bold text-gray-800 bg-white"
              >
                CLEAR ALL
              </button>
              <button
                onClick={() => setIsFilterOpenMobile(false)}
                className="flex-1 py-3 bg-rose-600 text-white rounded-lg text-xs font-extrabold uppercase tracking-wider shadow-md"
              >
                APPLY ({products.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-bold">Loading Sarees catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
