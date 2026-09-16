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

  // Active dropdown state for mobile accordions & desktop hover
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>(null);

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

  // Active route detection logic using usePathname & useSearchParams
  const sortParam = searchParams ? searchParams.get('sort') : null;
  const categoryParam = searchParams ? searchParams.get('category') : null;

  const isHomeActive = pathname === '/';
  const isNewArrivalsActive = pathname === '/products' && sortParam === 'newest';
  const isSuitsActive = pathname === '/products' && categoryParam !== null && (categoryParam.includes('suit') || categoryParam.includes('unstitched'));
  const isOtherActive = pathname === '/products' && categoryParam !== null && (categoryParam.includes('dupatta') || categoryParam.includes('bagh-print') || categoryParam.includes('premium'));
  const isSareesActive = pathname === '/products' && !isNewArrivalsActive && !isSuitsActive && !isOtherActive;
  const isAboutActive = pathname === '/about';
  const isContactActive = pathname === '/contact';
  const isWholesaleActive = pathname === '/wholesale';

  const linkBaseStyle = "py-1 transition-all flex items-center gap-1 font-bold text-xs uppercase tracking-wider";
  const activeLinkStyle = "text-rose-800 font-extrabold border-b-2 border-rose-800 pb-0.5";
  const inactiveLinkStyle = "text-amber-950 hover:text-rose-700";

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

            <span className="hidden min-[480px]:flex items-center gap-1 hover:text-amber-100 cursor-pointer transition-colors shrink-0">
              <Smartphone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
              <span>App Download</span>
            </span>

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

            {/* Right Labeled Action Icons (Matching Reoti Unique Style) */}
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
                  <div className="absolute right-0 top-full pt-2 hidden group-hover:block w-48 z-50">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-3 text-xs space-y-2">
                      <p className="font-bold text-gray-900 border-b border-gray-100 pb-1">
                        {user.name}
                      </p>
                      {user.role === 'admin' && (
                        <Link href="/reoti-studio-manage" className="flex items-center gap-1.5 text-amber-900 font-bold hover:text-rose-700">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Seller Admin Panel</span>
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="w-full text-left flex items-center gap-1.5 text-rose-600 font-bold hover:underline pt-1 border-t border-gray-100"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Logout</span>
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
              <button
                onClick={() => setIsTrackOrderModalOpen(true)}
                className="flex flex-col items-center text-amber-950 hover:text-rose-700 transition-colors group"
                title="Track your order status"
              >
                <RotateCcw className="w-5 h-5 group-hover:-rotate-45 transition-transform text-amber-900" />
                <span className="text-[10px] font-bold mt-1 tracking-wider uppercase hidden sm:block">
                  ORDERS
                </span>
              </button>

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

        {/* 3. Sub-Navigation Bar Row (Menu Links + Dropdowns + Wholesale Button) */}
        <nav className="hidden lg:block bg-amber-50/50 border-t border-amber-200/60 font-sans">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-bold tracking-wider text-amber-950 uppercase">
            
            <div className="flex items-center space-x-7 py-2.5">
              
              {/* Home */}
              <Link
                href="/"
                className={`${linkBaseStyle} ${isHomeActive ? activeLinkStyle : inactiveLinkStyle}`}
              >
                Home
              </Link>

              {/* New Arrivals */}
              <Link
                href="/products?sort=newest"
                className={`${linkBaseStyle} ${isNewArrivalsActive ? activeLinkStyle : inactiveLinkStyle}`}
              >
                <span>New Arrivals</span>
                <span className="bg-rose-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-extrabold normal-case tracking-normal animate-pulse">
                  New
                </span>
              </Link>

              {/* Sarees ▾ Dropdown */}
              <div className="relative group">
                <Link
                  href="/products"
                  className={`${linkBaseStyle} ${isSareesActive ? activeLinkStyle : inactiveLinkStyle}`}
                >
                  <span>Sarees</span>
                  <ChevronDown className="w-3.5 h-3.5 text-amber-700 group-hover:rotate-180 transition-transform" />
                </Link>

                {/* Dropdown Menu */}
                <div className="absolute left-0 top-full pt-1 hidden group-hover:block w-64 z-50">
                  <div className="bg-white border border-amber-200 rounded-xl shadow-xl p-3 text-xs space-y-1 font-semibold capitalize tracking-normal text-gray-800">
                    <div className="px-3 py-1 font-bold text-[10px] uppercase tracking-wider text-amber-900 border-b border-amber-100">
                      Maheshwari Weaves
                    </div>
                    <Link href="/products?category=silk-cotton-maheshwari" className="block px-3 py-2 hover:bg-amber-50 hover:text-rose-700 rounded-lg transition-colors">
                      Silk Cotton Maheshwari
                    </Link>
                    <Link href="/products?category=pure-silk-maheshwari" className="block px-3 py-2 hover:bg-amber-50 hover:text-rose-700 rounded-lg transition-colors">
                      Pure Silk Maheshwari
                    </Link>
                    <Link href="/products?category=tissue-zari-maheshwari" className="block px-3 py-2 hover:bg-amber-50 hover:text-rose-700 rounded-lg transition-colors">
                      Tissue Zari Shimmer
                    </Link>
                    <Link href="/products?category=garbha-reshami-special" className="block px-3 py-2 hover:bg-rose-50 text-rose-700 font-bold rounded-lg transition-colors flex items-center justify-between">
                      <span>Garbha Reshami Special</span>
                      <span>✨</span>
                    </Link>
                    <Link href="/products?category=nayantara-maheshwari-handloom-sarees" className="block px-3 py-2 hover:bg-amber-50 hover:text-rose-700 rounded-lg transition-colors">
                      Nayantara Handloom Sarees
                    </Link>
                    <Link href="/products?category=chanderi-sarees" className="block px-3 py-2 hover:bg-amber-50 hover:text-rose-700 rounded-lg transition-colors">
                      Chanderi Handloom Sarees
                    </Link>
                    <div className="border-t border-amber-100 pt-1">
                      <Link href="/products" className="block px-3 py-1.5 text-amber-900 font-extrabold text-[11px] uppercase hover:underline">
                        View All Sarees &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suits ▾ Dropdown */}
              <div className="relative group">
                <Link
                  href="/products?category=maheshwari-suits"
                  className={`${linkBaseStyle} ${isSuitsActive ? activeLinkStyle : inactiveLinkStyle}`}
                >
                  <span>Suits</span>
                  <ChevronDown className="w-3.5 h-3.5 text-amber-700 group-hover:rotate-180 transition-transform" />
                </Link>

                <div className="absolute left-0 top-full pt-1 hidden group-hover:block w-60 z-50">
                  <div className="bg-white border border-amber-200 rounded-xl shadow-xl p-3 text-xs space-y-1 font-semibold capitalize tracking-normal text-gray-800">
                    <div className="px-3 py-1 font-bold text-[10px] uppercase tracking-wider text-amber-900 border-b border-amber-100">
                      Unstitched & Dress Sets
                    </div>
                    <Link href="/products?category=maheshwari-suits" className="block px-3 py-2 hover:bg-amber-50 hover:text-rose-700 rounded-lg transition-colors">
                      Maheshwari Suit Sets
                    </Link>
                    <Link href="/products?category=bagh-cotton-suits" className="block px-3 py-2 hover:bg-amber-50 hover:text-rose-700 rounded-lg transition-colors">
                      Bagh Cotton Suits
                    </Link>
                    <Link href="/products?category=indigo-cotton-suit" className="block px-3 py-2 hover:bg-amber-50 hover:text-rose-700 rounded-lg transition-colors">
                      Indigo Cotton Suit Sets
                    </Link>
                    <Link href="/products?category=bagh-print" className="block px-3 py-2 hover:bg-amber-50 hover:text-rose-700 rounded-lg transition-colors">
                      Handblock Printed Suits
                    </Link>
                  </div>
                </div>
              </div>

              {/* Other Collection ▾ Dropdown */}
              <div className="relative group">
                <Link
                  href="/products?category=dupattas"
                  className={`${linkBaseStyle} ${isOtherActive ? activeLinkStyle : inactiveLinkStyle}`}
                >
                  <span>Other Collection</span>
                  <ChevronDown className="w-3.5 h-3.5 text-amber-700 group-hover:rotate-180 transition-transform" />
                </Link>

                <div className="absolute left-0 top-full pt-1 hidden group-hover:block w-56 z-50">
                  <div className="bg-white border border-amber-200 rounded-xl shadow-xl p-3 text-xs space-y-1 font-semibold capitalize tracking-normal text-gray-800">
                    <Link href="/products?category=dupattas" className="block px-3 py-2 hover:bg-amber-50 hover:text-rose-700 rounded-lg transition-colors">
                      Handcrafted Dupattas
                    </Link>
                    <Link href="/products?category=bagh-print" className="block px-3 py-2 hover:bg-amber-50 hover:text-rose-700 rounded-lg transition-colors">
                      Bagh Print Artisanal Range
                    </Link>
                    <Link href="/products?category=premium-sarees" className="block px-3 py-2 hover:bg-amber-50 hover:text-rose-700 rounded-lg transition-colors">
                      Royal Bridal & Festive Collection
                    </Link>
                  </div>
                </div>
              </div>

              {/* About Us */}
              <Link
                href="/about"
                className={`${linkBaseStyle} ${isAboutActive ? activeLinkStyle : inactiveLinkStyle}`}
              >
                About Us
              </Link>

              {/* Contact */}
              <Link
                href="/contact"
                className={`${linkBaseStyle} ${isContactActive ? activeLinkStyle : inactiveLinkStyle}`}
              >
                Contact
              </Link>
            </div>

            {/* Wholesale Highlighted Pill Button */}
            <Link
              href="/wholesale"
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
          <div className="lg:hidden bg-white border-b border-amber-200 px-5 py-5 space-y-4 font-bold text-xs uppercase tracking-wider text-amber-950 animate-in slide-in-from-top-2 duration-200">
            
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
              <span className="bg-rose-600 text-white text-[9px] px-1.5 py-0.5 rounded-full">NEW</span>
            </Link>

            {/* Mobile Sarees Accordion */}
            <div className="border-b border-gray-100 pb-2">
              <button
                onClick={() => toggleMobileDropdown('sarees')}
                className={`w-full flex items-center justify-between py-2 ${
                  isSareesActive ? 'text-rose-700 font-extrabold' : 'text-gray-900'
                }`}
              >
                <span>Sarees</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeMobileDropdown === 'sarees' ? 'rotate-180' : ''}`} />
              </button>
              {activeMobileDropdown === 'sarees' && (
                <div className="pl-4 pt-1 space-y-2 text-xs font-semibold capitalize text-gray-600 tracking-normal border-l-2 border-amber-300 ml-1">
                  <Link href="/products?category=silk-cotton-maheshwari" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">
                    Silk Cotton Maheshwari
                  </Link>
                  <Link href="/products?category=pure-silk-maheshwari" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">
                    Pure Silk Maheshwari
                  </Link>
                  <Link href="/products?category=tissue-zari-maheshwari" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">
                    Tissue Zari Shimmer
                  </Link>
                  <Link href="/products?category=garbha-reshami-special" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 text-rose-700 font-extrabold">
                    Garbha Reshami Special ✨
                  </Link>
                  <Link href="/products?category=nayantara-maheshwari-handloom-sarees" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">
                    Nayantara Handloom Sarees
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Suits Accordion */}
            <div className="border-b border-gray-100 pb-2">
              <button
                onClick={() => toggleMobileDropdown('suits')}
                className={`w-full flex items-center justify-between py-2 ${
                  isSuitsActive ? 'text-rose-700 font-extrabold' : 'text-gray-900'
                }`}
              >
                <span>Suits</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeMobileDropdown === 'suits' ? 'rotate-180' : ''}`} />
              </button>
              {activeMobileDropdown === 'suits' && (
                <div className="pl-4 pt-1 space-y-2 text-xs font-semibold capitalize text-gray-600 tracking-normal border-l-2 border-amber-300 ml-1">
                  <Link href="/products?category=maheshwari-suits" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">
                    Maheshwari Suit Sets
                  </Link>
                  <Link href="/products?category=bagh-cotton-suits" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">
                    Bagh Cotton Suits
                  </Link>
                  <Link href="/products?category=indigo-cotton-suit" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">
                    Indigo Cotton Suit Sets
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Other Collection Accordion */}
            <div className="border-b border-gray-100 pb-2">
              <button
                onClick={() => toggleMobileDropdown('other')}
                className={`w-full flex items-center justify-between py-2 ${
                  isOtherActive ? 'text-rose-700 font-extrabold' : 'text-gray-900'
                }`}
              >
                <span>Other Collection</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeMobileDropdown === 'other' ? 'rotate-180' : ''}`} />
              </button>
              {activeMobileDropdown === 'other' && (
                <div className="pl-4 pt-1 space-y-2 text-xs font-semibold capitalize text-gray-600 tracking-normal border-l-2 border-amber-300 ml-1">
                  <Link href="/products?category=dupattas" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">
                    Handcrafted Dupattas
                  </Link>
                  <Link href="/products?category=bagh-print" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">
                    Bagh Print Collection
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block py-2 border-b border-gray-100 ${
                isAboutActive ? 'text-rose-700 font-extrabold' : 'text-gray-900 hover:text-rose-700'
              }`}
            >
              About Us
            </Link>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsTrackOrderModalOpen(true);
              }}
              className="w-full text-left py-2 border-b border-gray-100 text-gray-900 hover:text-rose-700 flex items-center justify-between"
            >
              <span>Track Order</span>
              <RotateCcw className="w-4 h-4 text-amber-800" />
            </button>

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
              className="w-full py-3 bg-gradient-to-r from-amber-900 to-rose-900 text-amber-100 rounded-xl font-extrabold text-center flex items-center justify-center gap-2"
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
