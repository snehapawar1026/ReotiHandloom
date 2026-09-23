'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { WholesaleModal } from '@/components/WholesaleModal';
import { TrackOrderModal } from '@/components/TrackOrderModal';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  Sparkles,
  HelpCircle,
  Smartphone,
  LogOut,
  ShieldCheck,
  ChevronDown,
  RotateCcw,
  Tag,
  Phone,
  Info,
  MapPin,
} from 'lucide-react';

const NavbarContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { cart, wishlist, user, logout, setIsCartOpen } = useShop();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWholesaleModalOpen, setIsWholesaleModalOpen] = useState(false);
  const [isTrackOrderModalOpen, setIsTrackOrderModalOpen] = useState(false);
  const [userLocText, setUserLocText] = useState<string>('');

  React.useEffect(() => {
    const updateFromCache = () => {
      try {
        const cached = localStorage.getItem('rh_exact_loc') || sessionStorage.getItem('rh_exact_loc');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (
            parsed.city?.toLowerCase().includes('ghansoli') ||
            parsed.locationText?.toLowerCase().includes('ghansoli') ||
            (parsed.city?.toLowerCase().includes('mumbai') && parsed.postal?.startsWith('45'))
          ) {
            localStorage.removeItem('rh_exact_loc');
            sessionStorage.removeItem('rh_exact_loc');
            setUserLocText('');
            return;
          }
          if (parsed.city && parsed.city !== 'Unknown') {
            setUserLocText(parsed.postal ? `${parsed.city} (${parsed.postal})` : parsed.city);
          } else if (parsed.region) {
            setUserLocText(parsed.region);
          }
        }
      } catch (e) {}
    };

    updateFromCache();
    window.addEventListener('rh_location_updated', updateFromCache);
    return () => window.removeEventListener('rh_location_updated', updateFromCache);
  }, []);

  // Active dropdown state for mobile accordions & desktop menu on click
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>(null);
  const [activeDesktopMenu, setActiveDesktopMenu] = useState<string | null>(null);
  const desktopNavRef = React.useRef<HTMLElement>(null);

  // Close desktop mega menu when clicking outside nav
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (desktopNavRef.current && !desktopNavRef.current.contains(e.target as Node)) {
        setActiveDesktopMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close desktop mega menu when route changes
  React.useEffect(() => {
    setActiveDesktopMenu(null);
    setIsMobileMenuOpen(false);
  }, [pathname, searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleMobileDropdown = (name: string) => {
    setActiveMobileDropdown(activeMobileDropdown === name ? null : name);
  };

  // Reoti Handloom Official Default Saree Categories
  const defaultSareeCategories = [
    {
      name: 'Garbha Reshami Special',
      slug: 'garbha-reshami-special',
      image: '/uploads/saree_1789231637556_rppic.jpeg',
      tag: 'Festive Special',
    },
    {
      name: 'Nayantara Handloom Sarees',
      slug: 'nayantara-maheshwari-handloom-sarees',
      image: '/uploads/saree_1789233209397_zszzb.jpeg',
      tag: 'Chokha Border',
    },
    {
      name: 'Shaded Maheshwari Handloom',
      slug: 'shaded-maheshwari-handloom-sarees',
      image: '/uploads/saree_1789215518469_xe8m4.jpeg',
      tag: 'Dual Tone / Shaded',
    },
    {
      name: 'Pure Silk Maheshwari',
      slug: 'pure-silk-maheshwari',
      image: '/uploads/saree_1789232225833_5kisn.jpeg',
      tag: '100% Pure Silk',
    },
    {
      name: 'Tissue Zari Shimmer',
      slug: 'tissue-zari-maheshwari',
      image: '/uploads/saree_1789232226193_62n8q.jpeg',
      tag: 'Shimmer Zari',
    },
    {
      name: 'Resham Border Silver Zari',
      slug: 'resham-border-with-siver-zari',
      image: '/uploads/saree_1789240597301_iy1ww.jpeg',
      tag: 'Silver Zari',
    },
    {
      name: 'Classic Maheshwari Sarees',
      slug: 'maheshwari-sarees',
      image: '/uploads/saree_1789059507283_4f5xe.jpeg',
      tag: 'Heritage Weave',
    },
    {
      name: 'Chanderi Handloom Sarees',
      slug: 'chanderi-sarees',
      image: '/uploads/saree_1789244838660_j7b7r.jfif',
      tag: 'Graceful Silk',
    },
    {
      name: 'Premium Bridal Sarees',
      slug: 'premium-sarees',
      image: '/uploads/saree_1789231637562_xzakk.jpeg',
      tag: 'Royal Festivities',
    },
    {
      name: 'Katan Silk Sarees',
      slug: 'katan-silk',
      image: '/uploads/saree_1789221965397_lf0kg.jpeg',
      tag: 'Traditional Buta',
    },
    {
      name: 'Bagh Print Sarees',
      slug: 'bagh-print',
      image: '/uploads/saree_1789232225747_d55bp.jpeg',
      tag: 'Natural Dyes',
    },
  ];

  // Dynamic categories from database / admin panel with periodic refresh & focus re-sync
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchFreshCategories = () => {
      fetch('/api/categories?t=' + Date.now(), { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.categories)) {
            setDbCategories(data.categories);
          }
        })
        .catch(() => {});
    };

    fetchFreshCategories();

    // Periodic auto-refresh every 30 seconds
    const interval = setInterval(fetchFreshCategories, 30000);

    // Refresh when user returns / focuses the tab
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchFreshCategories();
      }
    };

    window.addEventListener('focus', fetchFreshCategories);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', fetchFreshCategories);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  // 1. Pure Handloom Sarees Category Processing (Excludes parent from visual cards)
  const { maheshwariChildCategories, otherSareeCategories, sareeVisualCards } = React.useMemo(() => {
    const parent = dbCategories.find((c: any) =>
      c.slug === 'maheshwari-sarees' ||
      (c.isParent && (c.name || '').toLowerCase() === 'maheshwari sarees') ||
      c.id === 'bced91f5-ab57-419f-8b41-eaa88a28df85'
    );
    const parentId = parent?.id || 'bced91f5-ab57-419f-8b41-eaa88a28df85';

    // Filter out non-saree categories
    const sareeCats = dbCategories.filter((c: any) => {
      const name = (c.name || '').toLowerCase();
      const slug = (c.slug || '').toLowerCase();
      if (c.isHidden) return false;
      if (slug.includes('semi-maheshwari') || name.includes('semi maheshwari') || slug.includes('semi_maheshwari')) return false;
      if (slug.includes('suit') || name.includes('suit')) return false;
      if (slug.includes('dupatta') || name.includes('dupatta')) return false;
      if (slug === 'garbha-reshami' && dbCategories.some((x: any) => x.slug === 'garbha-reshami-special')) return false;
      if (slug === 'pure-silk-sarees' && dbCategories.some((x: any) => x.slug === 'pure-silk-maheshwari')) return false;
      return true;
    });

    const knownMaheshwariSlugs = [
      'garbha-reshami-special',
      'nayantara-maheshwari-handloom-sarees',
      'shaded-maheshwari-handloom-sarees',
      'pure-silk-maheshwari',
      'tissue-zari-maheshwari',
      'resham-border-with-siver-zari',
      'katan-silk',
    ];

    const children: any[] = [];
    const others: any[] = [];

    if (sareeCats.length > 0) {
      sareeCats.forEach((c: any) => {
        if (c.slug === 'maheshwari-sarees' || c.id === parentId) return; // Skip parent from children list

        const defaultMatch = defaultSareeCategories.find(
          (d) => d.slug === c.slug || d.name.toLowerCase() === (c.name || '').toLowerCase()
        );
        const item = {
          ...c,
          name: c.name,
          slug: c.slug,
          image: c.image || defaultMatch?.image || '/uploads/saree_1789059507283_4f5xe.jpeg',
          tag: defaultMatch?.tag || 'Handloom Weave',
        };

        if (c.parentId === parentId || knownMaheshwariSlugs.includes(c.slug)) {
          children.push(item);
        } else {
          others.push(item);
        }
      });
    } else {
      defaultSareeCategories.forEach((item) => {
        if (['chanderi-sarees', 'premium-sarees', 'bagh-print'].includes(item.slug)) {
          others.push(item);
        } else {
          children.push(item);
        }
      });
    }

    // Visual cards ONLY show sub-categories and other categories (Parent category excluded!)
    const visualCards = [...children, ...others];

    return {
      maheshwariChildCategories: children,
      otherSareeCategories: others,
      sareeVisualCards: visualCards,
    };
  }, [dbCategories]);

  // 2. Semi Maheshwari Sarees Category Processing (Dynamic only, no arbitrary filters)
  const { semiSubCategories, semiVisualCards } = React.useMemo(() => {
    const parent = dbCategories.find((c: any) =>
      c.slug === 'semi-maheshwari-sarees' ||
      c.slug === 'semi-maheshwari' ||
      c.id === 'semi-maheshwari-sarees-id' ||
      (c.name || '').toLowerCase().includes('semi maheshwari')
    );
    const parentId = parent?.id || 'semi-maheshwari-sarees-id';

    const subs = dbCategories.filter((c: any) => {
      if (c.isHidden) return false;
      if (c.slug === 'semi-maheshwari-sarees' || c.slug === 'semi-maheshwari' || c.id === parentId) return false;
      return (
        c.parentId === parentId ||
        (c.parentId && c.parentId.includes('semi')) ||
        (c.slug && c.slug.includes('semi-maheshwari')) ||
        (c.name && c.name.toLowerCase().includes('semi maheshwari'))
      );
    }).map((c: any) => ({
      ...c,
      name: c.name,
      slug: c.slug,
      image: c.image || '/uploads/semi_maheshwari_banner.jpg',
      tag: c.tag || 'Semi Handloom Style',
    }));

    const visualCards = subs.length > 0
      ? subs
      : [
          {
            name: 'Semi Maheshwari Sarees',
            slug: 'semi-maheshwari-sarees',
            image: '/uploads/semi_maheshwari_banner.jpg',
            tag: 'Machine-Crafted Collection',
          },
        ];

    return {
      semiSubCategories: subs,
      semiVisualCards: visualCards,
    };
  }, [dbCategories]);

  // 3. Suits & Unstitched Material Category Processing (Dynamic Mega Menu)
  const { suitSubCategories, otherSuitCategories, suitVisualCards } = React.useMemo(() => {
    const suitCats = dbCategories.filter((c: any) => {
      const name = (c.name || '').toLowerCase();
      const slug = (c.slug || '').toLowerCase();
      if (c.isHidden) return false;
      return slug.includes('suit') || name.includes('suit') || slug.includes('unstitched') || name.includes('unstitched');
    });

    const parent = suitCats.find((c: any) => c.slug === 'maheshwari-suits' || (c.isParent && c.slug.includes('suit')));
    const parentId = parent?.id || '62c60ff6-1568-4753-8f73-652dd1efd355';

    const subs: any[] = [];
    const others: any[] = [];

    const defaultSuits = [
      {
        name: 'Bagh Cotton Suits',
        slug: 'bagh-cotton-suits',
        image: '/uploads/saree_1789231637570_fnani.jpeg',
        tag: 'Handblock Bagh Print',
      },
      {
        name: 'Indigo Cotton Suit',
        slug: 'indigo-cotton-suit',
        image: '/uploads/saree_1789232225743_smxhb.jpeg',
        tag: 'Natural Indigo Dye',
      },
    ];

    if (suitCats.length > 0) {
      suitCats.forEach((c: any) => {
        if (c.slug === 'maheshwari-suits' || c.id === parentId) return;
        const item = {
          ...c,
          name: c.name,
          slug: c.slug,
          image: c.image || '/uploads/saree_1789231637552_ggljq.jpeg',
          tag: c.tag || 'Unstitched Suit Set',
        };
        if (c.parentId === parentId) {
          subs.push(item);
        } else {
          others.push(item);
        }
      });
    }

    if (subs.length === 0 && others.length === 0) {
      others.push(...defaultSuits);
    }

    const visualCards = [...subs, ...others];

    return {
      suitSubCategories: subs,
      otherSuitCategories: others,
      suitVisualCards: visualCards,
    };
  }, [dbCategories]);

  // Top Featured Category Cards for Mobile Menu Carousel (Exact match for Screenshot 2)
  const mobileVisualCategoryList = React.useMemo(() => {
    const list: any[] = [];
    maheshwariChildCategories.forEach((c: any) => list.push(c));
    otherSareeCategories.forEach((c: any) => list.push(c));
    semiVisualCards.forEach((c: any) => list.push(c));
    suitVisualCards.forEach((c: any) => list.push(c));
    list.push({
      name: 'Handcrafted Dupattas',
      slug: 'dupattas',
      image: '/uploads/saree_1789231637559_1qq9u.jpeg',
      tag: 'Silk & Zari Dupattas',
    });

    const seen = new Set<string>();
    return list.filter((item) => {
      if (!item.slug || seen.has(item.slug)) return false;
      seen.add(item.slug);
      return true;
    });
  }, [maheshwariChildCategories, otherSareeCategories, semiVisualCards, suitVisualCards]);

  // Active route detection logic using usePathname & useSearchParams
  const sortParam = searchParams ? searchParams.get('sort') : null;
  const categoryParam = searchParams ? searchParams.get('category') : null;

  const isHomeActive = pathname === '/';
  const isNewArrivalsActive = pathname === '/products' && sortParam === 'newest';
  const isSemiMaheshwariActive = pathname === '/products' && categoryParam !== null && (categoryParam === 'semi-maheshwari-sarees' || categoryParam === 'semi-maheshwari');
  const isSuitsActive = pathname === '/products' && categoryParam !== null && (categoryParam.includes('suit') || categoryParam.includes('unstitched'));
  const isOtherActive = pathname === '/products' && categoryParam !== null && (categoryParam.includes('dupatta') || categoryParam.includes('bagh-print') || categoryParam.includes('premium'));
  const isSareesActive = pathname === '/products' && !isNewArrivalsActive && !isSuitsActive && !isOtherActive && !isSemiMaheshwariActive;
  const isBlogsActive = pathname.startsWith('/blogs');
  const isAboutActive = pathname === '/about';
  const isContactActive = pathname === '/contact';
  const isWholesaleActive = pathname === '/wholesale';

  const linkBaseStyle = "py-1.5 transition-all flex items-center gap-1 font-bold text-xs uppercase tracking-wider select-none cursor-pointer";
  const activeLinkStyle = "text-rose-800 font-extrabold border-b-2 border-rose-800 pb-0.5";
  const inactiveLinkStyle = "text-amber-950 hover:text-rose-700";

  // Hide global navbar on checkout page for clean, focused checkout experience
  if (pathname === '/checkout') return null;

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-amber-100 font-sans transition-all">
        
        {/* 1. Top Royal Black & Zari Announcement Strip */}
        <div className="bg-gradient-to-r from-amber-950 via-neutral-950 to-rose-950 text-amber-200 text-[10px] sm:text-xs py-1.5 px-3 sm:px-8 flex items-center justify-between font-medium border-b border-amber-900/40 overflow-hidden">
          <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto no-scrollbar whitespace-nowrap">
            <a
              href="https://www.instagram.com/reoti_handloom"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-amber-100 text-rose-300 font-bold transition-colors shrink-0"
            >
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              <span>@reoti_handloom</span>
            </a>

            {/* Auto Detected Delivery Location Pill */}
            <div
              className="flex items-center gap-1 text-amber-300 font-bold shrink-0 bg-amber-900/40 px-2.5 py-0.5 rounded border border-amber-500/30 select-none"
              title="Delivery Location"
            >
              <MapPin className="w-3 h-3 text-rose-400" />
              <span>{userLocText ? `Deliver to: ${userLocText}` : 'Deliver to: India'}</span>
            </div>

            <Link
              href="/contact"
              className="flex items-center gap-1 hover:text-amber-100 cursor-pointer transition-colors shrink-0"
            >
              <HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
              <span>Help & Support</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-amber-300 font-bold tracking-widest uppercase text-[11px] shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>ROYAL MAHESHWARI FESTIVE SALE • UP TO 60% OFF</span>
            </div>

            {/* Currency / Flag Selector */}
            <div className="flex items-center gap-1 bg-amber-900/60 border border-amber-700/50 px-2 py-0.5 rounded text-[10px] text-amber-200 font-bold shrink-0 cursor-default">
              <span>🇮🇳</span>
              <span>INR ₹</span>
            </div>
          </div>
        </div>

        {/* 2. Main Header Container (Logo, Search, Labeled Action Icons) */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-6">
            
            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 text-amber-950 hover:text-rose-700 focus:outline-none shrink-0"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo & Name */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-amber-400 p-0.5 shadow-md bg-amber-100/50 shrink-0 group-hover:scale-105 transition-transform">
                <img
                  src="/logo.jpg"
                  alt="Reoti Handloom Official Logo"
                  className="w-full h-full object-cover object-top rounded-full"
                />
              </div>

              <div className="flex flex-col">
                <span className="font-serif font-extrabold text-lg sm:text-2xl tracking-tight text-amber-950 group-hover:text-rose-800 transition-colors leading-none">
                  Reoti Handloom
                </span>
                <span className="text-[9px] sm:text-[10px] font-medium text-amber-800 italic mt-0.5 tracking-tight hidden min-[360px]:block">
                  Something &quot;more&quot; in Maheshwari Handloom
                </span>
              </div>
            </Link>

            {/* Search Bar (Center) */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm relative">
              <input
                type="text"
                placeholder="Search Maheshwari sarees, suits, silk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-amber-50/60 border border-amber-200/90 rounded-full py-2 pl-10 pr-4 text-xs font-medium text-amber-950 placeholder-amber-800/50 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:bg-white transition-all shadow-2xs"
              />
              <Search className="w-4 h-4 text-amber-800 absolute left-3.5 top-2.5" />
            </form>

            {/* Right Labeled Action Icons */}
            <div className="flex items-center gap-4 sm:gap-6">
              
              {/* Account / User Profile */}
              {user ? (
                <div className="relative group flex flex-col items-center">
                  <Link
                    href={user.role === 'admin' ? '/reoti-studio-manage' : '/login'}
                    className="flex flex-col items-center text-amber-950 hover:text-rose-700 transition-colors"
                  >
                    <User className="w-5 h-5 text-rose-700" />
                    <span className="text-[10px] font-bold mt-1 tracking-wider uppercase hidden sm:block max-w-[85px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                  </Link>

                  {/* Dropdown Menu on Hover */}
                  <div className="absolute right-0 top-full pt-2 hidden group-hover:block w-52 z-50">
                    <div className="bg-white border border-[#E8DFC8] rounded-2xl shadow-xl p-3 text-xs space-y-2 font-sans">
                      <div className="border-b border-gray-100 pb-2">
                        <p className="font-bold text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-[10px] text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>

                      <Link 
                        href="/login" 
                        className="flex items-center gap-2 text-gray-700 hover:text-[#581C1C] font-medium py-1"
                      >
                        <User className="w-3.5 h-3.5 text-amber-900" />
                        <span>My Account Profile</span>
                      </Link>

                      <Link
                        href="/orders"
                        className="w-full text-left flex items-center gap-2 text-gray-700 hover:text-[#581C1C] font-medium py-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-900" />
                        <span>My Orders & Tracking</span>
                      </Link>

                      <Link 
                        href="/wishlist" 
                        className="flex items-center gap-2 text-gray-700 hover:text-rose-700 font-medium py-1"
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-700" />
                        <span>Saved Wishlist</span>
                      </Link>

                      {user.role === 'admin' && (
                        <Link 
                          href="/reoti-studio-manage" 
                          className="flex items-center gap-2 text-amber-900 font-bold hover:text-rose-700 py-1 bg-amber-50/60 px-2 rounded-lg"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
                          <span>Seller Admin Panel</span>
                        </Link>
                      )}

                      <button
                        onClick={logout}
                        className="w-full text-left flex items-center gap-2 text-rose-600 font-bold hover:underline pt-2 border-t border-gray-100 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>

              ) : (
                <Link href="/login" className="flex flex-col items-center text-amber-950 hover:text-rose-700 transition-colors">
                  <User className="w-5 h-5" />
                  <span className="text-[10px] font-bold mt-1 tracking-wider uppercase hidden sm:block">
                    LOGIN
                  </span>
                </Link>
              )}

              {/* Order Tracking Action Icon */}
              <Link
                href="/orders"
                className="flex flex-col items-center text-amber-950 hover:text-rose-700 transition-colors group"
                title="My Orders & Shipment Tracking"
              >
                <RotateCcw className="w-5 h-5 group-hover:-rotate-45 transition-transform text-amber-900" />
                <span className="text-[10px] font-bold mt-1 tracking-wider uppercase hidden sm:block">
                  ORDERS
                </span>
              </Link>

              {/* Wishlist */}
              <Link href="/wishlist" className="flex flex-col items-center text-amber-950 hover:text-rose-700 transition-colors relative group">
                <div className="relative">
                  <Heart className="w-5 h-5 group-hover:scale-110 transition-transform text-rose-800" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 bg-rose-600 text-white text-[9px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold mt-1 tracking-wider uppercase hidden sm:block">
                  WISHLIST
                </span>
              </Link>

              {/* Shopping Bag */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex flex-col items-center text-amber-950 hover:text-rose-700 transition-colors relative group"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform text-rose-700" />
                  {totalCartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 bg-rose-700 text-white text-[9px] font-extrabold rounded-full w-4.5 h-4.5 flex items-center justify-center shadow">
                      {totalCartCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold mt-1 tracking-wider uppercase hidden sm:block">
                  BAG
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search Maheshwari sarees, suits, silk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-amber-50 border border-amber-200 rounded-full py-2 pl-9 pr-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-rose-600"
              />
              <Search className="w-4 h-4 text-amber-800 absolute left-3 top-2.5" />
            </form>
          </div>
        </div>

        {/* 3. Sub-Navigation Bar Row (Menu Links + Mega Menu + Dropdowns + Wholesale Button) */}
        <nav 
          ref={desktopNavRef}
          className="hidden lg:block bg-amber-50/50 border-t border-amber-200/60 font-sans relative"
        >
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-bold tracking-wider text-amber-950 uppercase">
            
            <div className="flex items-center space-x-7 py-2.5">
              
              {/* Home */}
              <Link
                href="/"
                onClick={() => setActiveDesktopMenu(null)}
                className={`${linkBaseStyle} ${isHomeActive ? activeLinkStyle : inactiveLinkStyle}`}
              >
                Home
              </Link>

              {/* New Arrivals */}
              <Link
                href="/products?sort=newest"
                onClick={() => setActiveDesktopMenu(null)}
                className={`${linkBaseStyle} ${isNewArrivalsActive ? activeLinkStyle : inactiveLinkStyle}`}
              >
                <span>New Arrivals</span>
                <span className="bg-rose-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-extrabold normal-case tracking-normal animate-pulse">
                  New
                </span>
              </Link>

              {/* Maheshwari Sarees Direct Link */}
              <Link
                href="/products"
                onClick={() => setActiveDesktopMenu(null)}
                className={`${linkBaseStyle} ${isSareesActive ? activeLinkStyle : inactiveLinkStyle}`}
              >
                Maheshwari Sarees
              </Link>

              {/* Maheshwari Suits Direct Link */}
              <Link
                href="/products?category=maheshwari-suits"
                onClick={() => setActiveDesktopMenu(null)}
                className={`${linkBaseStyle} ${isSuitsActive ? activeLinkStyle : inactiveLinkStyle}`}
              >
                Maheshwari Suits
              </Link>

              {/* Semi Maheshwari Sarees Direct Link */}
              <Link
                href="/products?category=semi-maheshwari-sarees"
                onClick={() => setActiveDesktopMenu(null)}
                className={`${linkBaseStyle} ${isSemiMaheshwariActive ? activeLinkStyle : inactiveLinkStyle}`}
              >
                Semi Maheshwari Sarees
              </Link>

              {/* Other Collection ▾ Dropdown Trigger (Click-Only) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setActiveDesktopMenu(activeDesktopMenu === 'other' ? null : 'other')}
                  className={`${linkBaseStyle} ${isOtherActive ? activeLinkStyle : inactiveLinkStyle} bg-transparent border-0 outline-none cursor-pointer`}
                >
                  <span>Other Collection</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-amber-700 transition-transform duration-200 ${activeDesktopMenu === 'other' ? 'rotate-180 text-rose-800' : ''}`} />
                </button>

                {/* Other Collection Dropdown */}
                {activeDesktopMenu === 'other' && (
                  <div className="absolute left-0 top-full pt-1.5 w-60 z-50 animate-in fade-in-50 slide-in-from-top-1 duration-150">
                    <div className="bg-white border border-amber-200 rounded-xl shadow-2xl p-3 text-xs space-y-1 font-semibold capitalize tracking-normal text-gray-800">
                      <div className="px-3 py-1 font-bold text-[10px] uppercase tracking-wider text-amber-900 border-b border-amber-100">
                        Artisanal Showcase
                      </div>
                      <Link 
                        href="/products?category=dupattas" 
                        onClick={() => setActiveDesktopMenu(null)}
                        className="block px-3 py-2 hover:bg-amber-50 hover:text-rose-700 rounded-lg transition-colors"
                      >
                        Handcrafted Dupattas
                      </Link>
                      <Link 
                        href="/products?category=bagh-print" 
                        onClick={() => setActiveDesktopMenu(null)}
                        className="block px-3 py-2 hover:bg-amber-50 hover:text-rose-700 rounded-lg transition-colors"
                      >
                        Bagh Print Artisanal Range
                      </Link>
                      <Link 
                        href="/products?category=premium-sarees" 
                        onClick={() => setActiveDesktopMenu(null)}
                        className="block px-3 py-2 hover:bg-amber-50 hover:text-rose-700 rounded-lg transition-colors"
                      >
                        Royal Bridal & Festive Collection
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* About Us */}
              <Link
                href="/about"
                onClick={() => setActiveDesktopMenu(null)}
                className={`${linkBaseStyle} ${isAboutActive ? activeLinkStyle : inactiveLinkStyle}`}
              >
                About Us
              </Link>

              {/* Contact */}
              <Link
                href="/contact"
                onClick={() => setActiveDesktopMenu(null)}
                className={`${linkBaseStyle} ${isContactActive ? activeLinkStyle : inactiveLinkStyle}`}
              >
                Contact
              </Link>
            </div>

            {/* Wholesale Highlighted Pill Button */}
            <Link
              href="/wholesale"
              onClick={() => setActiveDesktopMenu(null)}
              className={`font-extrabold text-[11px] px-4 py-1.5 rounded-full shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 my-1 ${
                isWholesaleActive
                  ? 'bg-rose-950 text-amber-200 ring-2 ring-amber-400'
                  : 'bg-gradient-to-r from-amber-900 via-rose-900 to-amber-950 hover:from-amber-950 hover:to-rose-950 text-amber-100'
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-amber-300" />
              <span>Wholesale / Bulk</span>
            </Link>

          </div>


        </nav>

        {/* 4. Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-amber-200 px-4 sm:px-5 py-4 space-y-3 font-bold text-xs uppercase tracking-wider text-amber-950 animate-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
            
            {/* Mobile Visual Categories Carousel */}
            {mobileVisualCategoryList.length > 0 && (
              <div className="pb-3 border-b border-amber-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-900/80">
                    Explore Collections
                  </span>
                  <Link
                    href="/products"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[10px] text-rose-700 font-bold hover:underline lowercase"
                  >
                    view all &rarr;
                  </Link>
                </div>
                <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x -mx-1 px-1">
                  {mobileVisualCategoryList.map((card: any) => (
                    <Link
                      key={card.slug || card.name}
                      href={`/products?category=${card.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="group/mcard flex-shrink-0 w-24 sm:w-28 relative rounded-xl overflow-hidden aspect-[3/4] bg-neutral-900 border border-amber-300/70 shadow-sm snap-start select-none active:scale-95 transition-all"
                    >
                      <img
                        src={card.image || '/uploads/saree_1789231637552_ggljq.jpeg'}
                        alt={card.name}
                        className="w-full h-full object-cover object-center group-hover/mcard:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-1.5 text-center">
                        <span className="text-white font-serif font-bold text-[10px] sm:text-[11px] leading-tight drop-shadow-md group-hover/mcard:text-amber-300 line-clamp-2">
                          {card.name}
                        </span>
                        <span className="text-[7.5px] sm:text-[8px] text-amber-200 font-sans tracking-tight uppercase truncate mt-0.5 font-semibold">
                          {card.tag || 'Handcrafted'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block py-2 border-b border-gray-100 ${
                isHomeActive ? 'text-rose-700 font-extrabold' : 'text-gray-900 hover:text-rose-700'
              }`}
            >
              Home
            </Link>

            <Link
              href="/products?sort=newest"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center justify-between py-2 border-b border-gray-100 ${
                isNewArrivalsActive ? 'text-rose-700 font-extrabold' : 'text-gray-900 hover:text-rose-700'
              }`}
            >
              <span>New Arrivals</span>
              <span className="bg-rose-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">NEW</span>
            </Link>

            {/* Mobile Sarees Direct Link */}
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block py-2 border-b border-gray-100 ${
                isSareesActive ? 'text-rose-700 font-extrabold' : 'text-gray-900 hover:text-rose-700'
              }`}
            >
              Maheshwari Sarees
            </Link>

            {/* Mobile Suits Direct Link */}
            <Link
              href="/products?category=maheshwari-suits"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block py-2 border-b border-gray-100 ${
                isSuitsActive ? 'text-rose-700 font-extrabold' : 'text-gray-900 hover:text-rose-700'
              }`}
            >
              Maheshwari Suits
            </Link>

            {/* Mobile Semi Maheshwari Sarees Direct Link */}
            <Link
              href="/products?category=semi-maheshwari-sarees"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block py-2 border-b border-gray-100 ${
                isSemiMaheshwariActive ? 'text-rose-700 font-extrabold' : 'text-gray-900 hover:text-rose-700'
              }`}
            >
              Semi Maheshwari Sarees
            </Link>

            {/* Mobile Handcrafted Dupattas Direct Link */}
            <Link
              href="/products?category=dupattas"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block py-2 border-b border-gray-100 ${
                categoryParam === 'dupattas' ? 'text-rose-700 font-extrabold' : 'text-gray-900 hover:text-rose-700'
              }`}
            >
              Handcrafted Dupattas
            </Link>



            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block py-2 border-b border-gray-100 ${
                isAboutActive ? 'text-rose-700 font-extrabold' : 'text-gray-900 hover:text-rose-700'
              }`}
            >
              About Us
            </Link>

            <Link
              href="/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-left py-2 border-b border-gray-100 text-gray-900 hover:text-rose-700 flex items-center justify-between"
            >
              <span>My Orders & Tracking</span>
              <RotateCcw className="w-4 h-4 text-amber-800" />
            </Link>

            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block py-2 border-b border-gray-100 ${
                isContactActive ? 'text-rose-700 font-extrabold' : 'text-gray-900 hover:text-rose-700'
              }`}
            >
              Contact Us
            </Link>

            <Link
              href="/wholesale"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3 bg-gradient-to-r from-amber-900 to-rose-900 text-amber-100 rounded-xl font-extrabold text-center flex items-center justify-center gap-2 shadow-md active:scale-98 transition-transform"
            >
              <Tag className="w-4 h-4 text-amber-300" />
              <span>Wholesale / Bulk Orders</span>
            </Link>

            <div className="pt-2">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-amber-900 font-extrabold"
              >
                {user ? `Account (${user.name})` : 'Login / Register'}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Modals */}
      <WholesaleModal
        isOpen={isWholesaleModalOpen}
        onClose={() => setIsWholesaleModalOpen(false)}
      />

      <TrackOrderModal
        isOpen={isTrackOrderModalOpen}
        onClose={() => setIsTrackOrderModalOpen(false)}
      />
    </>
  );
};

export const Navbar = () => (
  <Suspense fallback={null}>
    <NavbarContent />
  </Suspense>
);
