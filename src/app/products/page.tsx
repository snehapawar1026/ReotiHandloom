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
      'Explore authentic handcrafted Maheshwari Sarees woven directly on 3rd generation heritage pit looms by master artisans of Reoti Handloom Maheshwar. Celebrated for iconic Narmada river borders, reversible zari craftsmanship, and timeless royal Holkar heritage.',
    image: '/uploads/maheshwari_legacy_banner.png',
  },
  'garbha-reshami-special': {
    title: 'Garbha Reshami Silk Sarees',
    description:
      'Discover authentic Garbha Reshami Silk Sarees handcrafted by master weavers of Reoti Handloom in Maheshwar. Crafted with 75% pure Mulberry Silk in warp and 25% mercerised fine cotton in weft, delivering exceptional gossamer drape, natural luster, and certified handloom purity.',
    image: '/uploads/saree_1789221965397_lf0kg.jpeg',
  },
  'silk-cotton-maheshwari': {
    title: 'Silk Cotton Maheshwari Sarees',
    description:
      'Explore lightweight & comfortable Silk Cotton Maheshwari Sarees woven with pure mulberry silk warp and fine mercerised cotton weft. Handcrafted by master weavers at Reoti Handloom Maheshwar with traditional Bugdi, Zari, and Narmada river border motifs.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
  },
  'pure-silk-maheshwari': {
    title: 'Pure Silk Maheshwari Sarees',
    description:
      'Indulge in luxurious 100% Pure Silk Maheshwari Sarees adorned with rich golden zari borders and intricate woven butis. Handcrafted by Reoti Handloom for royal weddings, grand celebrations, and festive occasions.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
  },
  'tissue-zari-maheshwari': {
    title: 'Tissue Zari Maheshwari Sarees',
    description:
      'Experience shimmering elegance with Tissue Zari Maheshwari Sarees featuring silver and gold zari threads woven continuously with pure silk. Handcrafted by Reoti Handloom for radiant celebrations.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80',
  },
  'katan-silk': {
    title: 'Katan Silk Maheshwari Sarees',
    description:
      'Experience the timeless elegance of authentic Maheshwari handloom in luxurious Katan Silk. Lightweight, graceful and beautifully woven with big traditional butas by Reoti Handloom master artisans.',
    image: '/uploads/saree_1789221965397_lf0kg.jpeg',
  },
  'nayantara-maheshwari-handloom-sarees': {
    title: 'Nayantara Maheshwari Handloom Sarees',
    description:
      'Discover the timeless elegance of Nayantara Maheshwari Handloom Sarees by Reoti Handloom, beautifully crafted with Chokha borders & detailed butis to blend traditional artistry with modern flair.',
    image: '/uploads/saree_1789233209397_zszzb.jpeg',
  },
  'semi-maheshwari-sarees': {
    title: 'Semi Maheshwari Sarees',
    description:
      'Lightweight Semi Maheshwari Sarees featuring elegant zari borders and beautiful traditional patterns. These sarees are not handcrafted or handloom, and are made using modern manufacturing techniques while maintaining the classic Maheshwari-inspired look. Perfect for festive occasions, celebrations, and everyday elegance.',
    image: '/uploads/semi_maheshwari_banner.jpg',
  },
};

function getCategoryBadgeTexts(selectedCategory: string, heroTitle: string, isSemiMaheshwariView: boolean) {
  const query = `${selectedCategory} ${heroTitle}`.toLowerCase();

  if (isSemiMaheshwariView || query.includes('semi-maheshwari') || query.includes('semi maheshwari')) {
    return {
      hindi: 'सेमी माहेश्वरी साड़ियाँ',
      subtitle: 'सेमी माहेश्वरी साड़ियाँ ~ Semi Maheshwari Sarees',
    };
  }

  if (query.includes('chanderi') || query.includes('चंदेरी')) {
    if (query.includes('suit') || query.includes('dress') || query.includes('सूट')) {
      return {
        hindi: 'चंदेरी सूट सेट्स',
        subtitle: 'चंदेरी सूट ~ Authentic Handloom',
      };
    }
    return {
      hindi: 'चंदेरी साड़ियाँ',
      subtitle: 'चंदेरी साड़ियाँ ~ Authentic Handloom',
    };
  }

  if (query.includes('katan') || query.includes('कातान')) {
    return {
      hindi: 'कातान सिल्क साड़ियाँ',
      subtitle: 'कातान सिल्क साड़ियाँ ~ Authentic Handloom',
    };
  }

  if (query.includes('garbha') || query.includes('गर्भ')) {
    return {
      hindi: 'गर्भ रेशमी साड़ियाँ',
      subtitle: 'गर्भ रेशमी साड़ियाँ ~ Authentic Handloom',
    };
  }

  if (query.includes('silk cotton') || query.includes('silk-cotton') || query.includes('सिल्क कॉटन')) {
    return {
      hindi: 'सिल्क कॉटन साड़ियाँ',
      subtitle: 'सिल्क कॉटन साड़ियाँ ~ Authentic Handloom',
    };
  }

  if (query.includes('pure silk') || query.includes('pure-silk') || query.includes('प्योर सिल्क')) {
    return {
      hindi: 'प्योर सिल्क साड़ियाँ',
      subtitle: 'प्योर सिल्क साड़ियाँ ~ Authentic Handloom',
    };
  }

  if (query.includes('tissue') || query.includes('टिशू')) {
    return {
      hindi: 'टिशू ज़री साड़ियाँ',
      subtitle: 'टिशू ज़री साड़ियाँ ~ Authentic Handloom',
    };
  }

  if (query.includes('nayantara') || query.includes('नयनतारा')) {
    return {
      hindi: 'नयनतारा साड़ियाँ',
      subtitle: 'नयनतारा साड़ियाँ ~ Authentic Handloom',
    };
  }

  if (query.includes('tussar') || query.includes('टसर')) {
    return {
      hindi: 'टसर सिल्क साड़ियाँ',
      subtitle: 'टसर सिल्क साड़ियाँ ~ Authentic Handloom',
    };
  }

  if (query.includes('linen') || query.includes('लिनन')) {
    return {
      hindi: 'लिनन साड़ियाँ',
      subtitle: 'लिनन साड़ियाँ ~ Authentic Handloom',
    };
  }

  if (query.includes('organza') || query.includes('ऑर्गेंज़ा')) {
    return {
      hindi: 'ऑर्गेंज़ा साड़ियाँ',
      subtitle: 'ऑर्गेंज़ा साड़ियाँ ~ Authentic Handloom',
    };
  }

  if (query.includes('modal') || query.includes('मोडल')) {
    return {
      hindi: 'मोडल सिल्क साड़ियाँ',
      subtitle: 'मोडल सिल्क साड़ियाँ ~ Authentic Handloom',
    };
  }

  if (query.includes('suit') || query.includes('dress') || query.includes('kurta') || query.includes('सूट')) {
    if (query.includes('maheshwari')) {
      return {
        hindi: 'माहेश्वरी सूट सेट्स',
        subtitle: 'माहेश्वरी सूट ~ Maheshwari Suits',
      };
    }
    return {
      hindi: 'सूट सेट्स',
      subtitle: 'हैंडलूम सूट ~ Authentic Handloom',
    };
  }

  if (query.includes('maheshwari') || query.includes('saree') || query.includes('sari')) {
    return {
      hindi: 'माहेश्वरी साड़ियाँ',
      subtitle: 'माहेश्वरी साड़ियाँ ~ Authentic Handloom',
    };
  }

  return {
    hindi: heroTitle,
    subtitle: `${heroTitle} ~ Authentic Handloom`,
  };
}



function getHeroContent(
  selectedCategory: string,
  selectedFabric: string,
  selectedColor: string,
  isTrending: boolean,
  isBestSeller: boolean,
  selectedSort: string,
  categories: any[]
) {
  if (selectedSort === 'newest') {
    return {
      title: 'New Arrivals',
      subtitle: 'Maheshwari silk-cotton, fresh off the loom',
      description:
        'Discover our newest Maheshwari silk sarees, handwoven on traditional pit looms in Maheshwar. Each new arrival features the signature silk-cotton weave, lustrous zari borders, and striped pallu that define this centuries-old craft. Shop authentic Maheshwari silk sarees online, Direct from Master Weavers.\n\nStep into the world of timeless elegance with Reoti’s New Arrivals. Our curated collection celebrates the artistry of Authentic Handwoven Maheshwari Sarees and Dress materials, each piece meticulously crafted by skilled artisans. Known for their delicate textures, vibrant colors, and intricate patterns.',
      image: '/uploads/saree_1789233209397_zszzb.jpeg',
    };
  }

  if (selectedCategory) {
    const cat = categories.find((c) => c.slug === selectedCategory || c.id === selectedCategory);
    const staticHero = CATEGORY_HERO_MAP[selectedCategory];
    if (cat || staticHero) {
      return {
        title: cat?.name || staticHero?.title || selectedCategory,
        description: cat?.description || staticHero?.description || `Handcrafted ${cat?.name || selectedCategory} online from authentic handloom weavers.`,
        image: cat?.bannerImage || cat?.image || staticHero?.image || '/uploads/maheshwari_legacy_banner.png',
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
      description: `Handcrafted ${selectedFabric} Maheshwari sarees woven with generational mastery by skilled master weavers at Reoti Handloom Maheshwar.`,
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
      'Explore authentic handcrafted Maheshwari Sarees woven directly on 3rd generation heritage pit looms by master artisans of Reoti Handloom Maheshwar. Celebrated for iconic Narmada river borders, reversible zari craftsmanship, and timeless royal Holkar heritage.',
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
  const [isCategoryExplorerOpen, setIsCategoryExplorerOpen] = useState<boolean>(false);

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

  const isNewArrivals = selectedSort === 'newest';
  const isCategorySelected = Boolean(selectedCategory);

  const handleSelectCategory = (slug: string) => {
    updateFilter('category', slug);
    setIsCategoryExplorerOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      {/* Breadcrumb Path & Header Actions */}
      <div className="text-xs text-gray-500 mb-4 font-medium flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center flex-wrap">
          <span className="hover:text-rose-600 cursor-pointer" onClick={() => router.push('/')}>Home</span>
          <span className="mx-1.5">/</span>
          {isNewArrivals ? (
            <>
              <span className="hover:text-rose-600 cursor-pointer" onClick={() => router.push('/products')}>Collections</span>
              <span className="mx-1.5">/</span>
              <span className="text-gray-900 font-bold">New Arrivals</span>
            </>
          ) : (
            <>
              <span className="hover:text-rose-600 cursor-pointer" onClick={() => router.push('/products')}>Catalog</span>
              <span className="mx-1.5">/</span>
              <span className="text-gray-900 font-bold">
                {selectedCategory
                  ? categories.find((c) => c.slug === selectedCategory)?.name || 'Category'
                  : 'Maheshwari Sarees'}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
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
      </div>

      {/* When on New Arrivals */}
      {isNewArrivals ? (() => {
        const hero = getHeroContent(
          selectedCategory,
          selectedFabric,
          selectedColor,
          isTrending,
          isBestSeller,
          selectedSort,
          categories
        );
        return (
          <div className="w-full bg-[#FAF7F2] border border-[#E8DFC8] rounded-2xl overflow-hidden mb-6 shadow-2xs font-sans">
            <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
              {/* Left Side: Craft Story & Title */}
              <div className="md:col-span-6 lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-center space-y-3 overflow-hidden">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold text-[#581C1C] tracking-tight leading-tight">
                  {hero.title}
                </h1>
                <p className="font-serif italic text-[#8B4513] text-lg sm:text-xl font-normal">
                  {(hero as any).subtitle || 'Maheshwari silk-cotton, fresh off the loom'}
                </p>
                <div className="w-16 h-0.5 bg-[#8B4513]/40 rounded-full my-1" />
                <p className="text-xs sm:text-sm text-amber-950/90 leading-relaxed font-medium whitespace-pre-line">
                  {hero.description}
                </p>
              </div>

              {/* Right Side: Gracefully Framed Hero Image */}
              <div className="md:col-span-6 lg:col-span-5 relative w-full h-80 sm:h-96 md:h-full min-h-[320px] sm:min-h-[360px] overflow-hidden bg-gradient-to-br from-amber-950 to-stone-900 shrink-0">
                <img
                  src={hero.image}
                  alt={hero.title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                />
                <WatermarkOverlay variant="pdp" imageUrl={hero.image} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 bg-black/85 backdrop-blur-md text-amber-100 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border border-amber-400/50 pointer-events-none flex items-center gap-1.5 shadow-lg z-10">
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
      })() : (
        <>
          {/* Authentic Scalloped Kangura Ring Circular Category Strip (Matching Homepage) */}
          <div className="w-full mb-6 bg-[#FAF7F2]/90 border border-[#E8DFC8] rounded-2xl py-4 px-3 sm:px-6 shadow-2xs relative group/carousel font-sans">
            {/* Left Scroll Arrow */}
            <button
              type="button"
              onClick={() => scrollCategories('left')}
              className="flex absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-[#581C1C] border border-[#E8DFC8] shadow-xl hover:bg-[#581C1C] hover:text-amber-100 transition-all items-center justify-center cursor-pointer active:scale-95 hover:scale-105"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Right Scroll Arrow */}
            <button
              type="button"
              onClick={() => scrollCategories('right')}
              className="flex absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-[#581C1C] border border-[#E8DFC8] shadow-xl hover:bg-[#581C1C] hover:text-amber-100 transition-all items-center justify-center cursor-pointer active:scale-95 hover:scale-105"
              aria-label="Scroll Right"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div
              ref={categoryScrollRef}
              className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto pb-2 pt-1 scrollbar-none justify-start px-6 sm:px-8 scroll-smooth w-full overscroll-x-contain"
            >
              {/* "All" Circular Avatar */}
              <button
                type="button"
                onClick={() =>
                  handleSelectCategory(
                    isSemiMaheshwariView
                      ? 'semi-maheshwari-sarees'
                      : selectedCategory.includes('suit')
                      ? 'maheshwari-suits'
                      : ''
                  )
                }
                className="flex flex-col items-center group cursor-pointer shrink-0 focus:outline-none"
              >
                <div className="relative w-22 h-22 sm:w-26 sm:h-26 flex items-center justify-center shrink-0">
                  {/* Scalloped Bead Ring SVG matching Homepage */}
                  <svg
                    className={`absolute inset-0 w-full h-full transition-colors duration-300 pointer-events-none ${
                      !selectedCategory ||
                      (isSemiMaheshwariView && selectedCategory === 'semi-maheshwari-sarees') ||
                      selectedCategory === 'maheshwari-suits'
                        ? 'text-[#581C1C]'
                        : 'text-[#8B4513]/70 group-hover:text-[#581C1C]'
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
                    <circle cx="50" cy="50" r="39" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <div
                    className={`w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-full overflow-hidden p-1 bg-white border transition-all duration-300 ${
                      !selectedCategory ||
                      (isSemiMaheshwariView && selectedCategory === 'semi-maheshwari-sarees') ||
                      selectedCategory === 'maheshwari-suits'
                        ? 'border-[#581C1C] ring-2 ring-[#581C1C]/40 shadow-lg scale-105'
                        : 'border-amber-950/20 shadow-md group-hover:border-[#581C1C]'
                    }`}
                  >
                    <img
                      src={
                        isSemiMaheshwariView
                          ? '/uploads/semi_maheshwari_banner.jpg'
                          : selectedCategory.includes('suit')
                          ? '/uploads/saree_1789231637552_ggljq.jpeg'
                          : '/uploads/maheshwari_legacy_banner.png'
                      }
                      alt="All"
                      className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                <span
                  className={`text-xs font-serif font-bold text-center mt-1.5 leading-snug max-w-[95px] sm:max-w-[115px] transition-colors ${
                    !selectedCategory ||
                    (isSemiMaheshwariView && selectedCategory === 'semi-maheshwari-sarees') ||
                    selectedCategory === 'maheshwari-suits'
                      ? 'text-[#581C1C] font-black'
                      : 'text-gray-900 group-hover:text-[#581C1C]'
                  }`}
                >
                  {isSemiMaheshwariView ? 'All Semi' : selectedCategory.includes('suit') ? 'All Suits' : 'All Sarees'}
                </span>
              </button>

              {/* Sub-Category Circular Avatars */}
              {(() => {
                let displayedCats: any[] = [];
                if (isSemiMaheshwariView) {
                  displayedCats = semiSubcategories;
                } else if (selectedCategory.includes('suit')) {
                  displayedCats = categories.filter(
                    (c) =>
                      (c.slug?.includes('suit') ||
                        c.name?.toLowerCase().includes('suit') ||
                        c.parentId?.includes('suit') ||
                        c.parentId === '62c60ff6-1568-4753-8f73-652dd1efd355') &&
                      c.slug !== 'maheshwari-suits' &&
                      !c.isHidden
                  );
                  if (displayedCats.length === 0) {
                    displayedCats = [
                      {
                        id: 'bagh-cotton-suits',
                        name: 'Bagh Cotton Suits',
                        slug: 'bagh-cotton-suits',
                        image: '/uploads/saree_1789231637570_fnani.jpeg',
                      },
                      {
                        id: 'indigo-cotton-suit',
                        name: 'Indigo Cotton Suit',
                        slug: 'indigo-cotton-suit',
                        image: '/uploads/saree_1789232225743_smxhb.jpeg',
                      },
                      {
                        id: 'chanderi-suits',
                        name: 'Chanderi Suits',
                        slug: 'chanderi-suits',
                        image: '/uploads/saree_1789231637552_ggljq.jpeg',
                      },
                    ];
                  }
                } else {
                  displayedCats = categories.filter(
                    (c) =>
                      !c.slug?.includes('semi-maheshwari') &&
                      !c.name?.toLowerCase().includes('semi maheshwari') &&
                      !c.slug?.includes('suit') &&
                      !c.name?.toLowerCase().includes('suit') &&
                      c.slug !== 'maheshwari-sarees' &&
                      c.id !== 'maheshwari-sarees-id' &&
                      !c.isHidden
                  );
                }

                return displayedCats.map((cat) => {
                  const isSelected = selectedCategory === cat.slug;
                  const imgUrl =
                    cat.image ||
                    cat.bannerImage ||
                    CATEGORY_HERO_MAP[cat.slug]?.image ||
                    '/uploads/saree_1789221965397_lf0kg.jpeg';

                  return (
                    <button
                      key={cat.id || cat.slug}
                      type="button"
                      onClick={() =>
                        handleSelectCategory(
                          isSelected
                            ? isSemiMaheshwariView
                              ? 'semi-maheshwari-sarees'
                              : selectedCategory.includes('suit')
                              ? 'maheshwari-suits'
                              : ''
                            : cat.slug
                        )
                      }
                      className="flex flex-col items-center group cursor-pointer shrink-0 focus:outline-none"
                    >
                      <div className="relative w-22 h-22 sm:w-26 sm:h-26 flex items-center justify-center shrink-0">
                        {/* Scalloped Bead Ring SVG matching Homepage */}
                        <svg
                          className={`absolute inset-0 w-full h-full transition-colors duration-300 pointer-events-none ${
                            isSelected
                              ? 'text-[#581C1C]'
                              : 'text-[#8B4513]/70 group-hover:text-[#581C1C]'
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
                          <circle cx="50" cy="50" r="39" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <div
                          className={`w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-full overflow-hidden p-1 bg-white border transition-all duration-300 ${
                            isSelected
                              ? 'border-[#581C1C] ring-2 ring-[#581C1C]/40 shadow-lg scale-105'
                              : 'border-amber-950/20 shadow-md group-hover:border-[#581C1C]'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={cat.name}
                            className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      </div>
                      <span
                        className={`text-xs font-serif font-bold text-center mt-1.5 leading-snug max-w-[95px] sm:max-w-[115px] transition-colors ${
                          isSelected
                            ? 'text-[#581C1C] font-black'
                            : 'text-gray-900 group-hover:text-[#581C1C]'
                        }`}
                      >
                        {cat.name}
                      </span>
                    </button>
                  );
                });
              })()}
            </div>
          </div>

          {/* Hero Banner for Selected Category */}
          {(() => {
            const hero = getHeroContent(
              selectedCategory,
              selectedFabric,
              selectedColor,
              isTrending,
              isBestSeller,
              selectedSort,
              categories
            );
            const badgeTexts = getCategoryBadgeTexts(selectedCategory, hero.title, isSemiMaheshwariView);
            return (
              <div className="w-full bg-[#FAF7F2] border border-[#E8DFC8] rounded-2xl overflow-hidden mb-6 shadow-2xs font-sans">
                <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
                  {/* Left Side: Craft Story & Title */}
                  <div className="md:col-span-6 lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-center space-y-3 overflow-hidden">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-extrabold text-[#581C1C] tracking-tight leading-tight">
                      {hero.title}{' '}
                      <span className="font-serif font-normal text-[#8B4513] text-xl sm:text-2xl block sm:inline mt-1 sm:mt-0">
                        {badgeTexts.hindi}
                      </span>
                    </h1>
                    <p className="text-xs sm:text-sm text-[#8B4513]/80 font-bold tracking-wider uppercase">
                      {badgeTexts.subtitle}
                    </p>
                    <div className="w-16 h-0.5 bg-[#8B4513]/40 rounded-full my-0.5" />
                    <p className="text-xs sm:text-sm text-amber-950/90 leading-relaxed font-medium line-clamp-4 sm:line-clamp-none">
                      {hero.description}
                    </p>
                  </div>

                  {/* Right Side: Gracefully Framed Hero Image */}
                  <div className="md:col-span-6 lg:col-span-5 relative w-full h-80 sm:h-96 md:h-full min-h-[320px] sm:min-h-[360px] overflow-hidden bg-gradient-to-br from-amber-950 to-stone-900 shrink-0">
                    <img
                      src={hero.image}
                      alt={hero.title}
                      className="w-full h-full object-cover object-top md:object-center transition-transform duration-700 hover:scale-105"
                    />
                    <WatermarkOverlay variant="pdp" imageUrl={hero.image} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 bg-black/85 backdrop-blur-md text-amber-100 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border border-amber-400/50 pointer-events-none flex items-center gap-1.5 shadow-lg z-10">
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
        </>
      )}

      <div className="w-full">
        {/* Main Content Area (Full-Width Reoti Handloom Style Layout) */}
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

          {/* Reoti Handloom Style Horizontal Filter Bar */}
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

              {/* SHOW ALL / RESET Button (Exact Reoti style) */}
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
