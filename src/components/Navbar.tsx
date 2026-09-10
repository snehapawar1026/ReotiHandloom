'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
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
} from 'lucide-react';

export const Navbar = () => {
  const router = useRouter();
  const { cart, wishlist, user, logout, setIsCartOpen } = useShop();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-amber-100 font-sans transition-all">
      {/* Top Royal Black & Zari Announcement Strip */}
      <div className="bg-gradient-to-r from-amber-950 via-neutral-950 to-rose-950 text-amber-200 text-xs py-1.5 px-4 sm:px-8 flex items-center justify-between font-medium border-b border-amber-900/40">
        <div className="flex items-center gap-6">
          <a
            href="https://www.instagram.com/reoti_handloom"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-amber-100 text-rose-300 font-bold transition-colors"
          >
            <svg className="w-3.5 h-3.5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
            <span>@reoti_handloom</span>
          </a>
          <span className="flex items-center gap-1.5 hover:text-amber-100 cursor-pointer transition-colors">
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span>App Download</span>
          </span>
          <span className="flex items-center gap-1.5 hover:text-amber-100 cursor-pointer transition-colors">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Help & Support</span>
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-amber-300 font-bold tracking-widest uppercase text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>ROYAL MAHESHWARI FESTIVE SALE • UP TO 60% OFF</span>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-6">
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-amber-950 hover:text-rose-700 focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Official Brand Header */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 p-0.5 shadow-md bg-amber-100/50 shrink-0 group-hover:scale-105 transition-transform">
              <img
                src="/logo.jpg"
                alt="Reoti Handloom Official Logo"
                className="w-full h-full object-cover object-top rounded-full"
              />
            </div>

            <div className="flex flex-col">
              <span className="font-serif font-extrabold text-2xl tracking-tight text-amber-950 group-hover:text-rose-800 transition-colors leading-none">
                Reoti Handloom
              </span>
              <span className="text-[10px] font-medium text-amber-800 italic mt-0.5 tracking-tight">
                Something &quot;more&quot; in Maheshwari Handloom
              </span>
            </div>
          </Link>

          {/* Customer Navigation Links (No Admin link for public users) */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-bold tracking-wider text-gray-800 uppercase">
            <Link href="/products" className="hover:text-rose-700 transition-colors py-2 border-b-2 border-transparent hover:border-rose-700">
              Women
            </Link>
            <Link href="/products?category=silk-cotton-maheshwari" className="hover:text-rose-700 transition-colors py-2 border-b-2 border-transparent hover:border-rose-700">
              Silk Cotton
            </Link>
            <Link href="/products?category=pure-silk-maheshwari" className="hover:text-rose-700 transition-colors py-2 border-b-2 border-transparent hover:border-rose-700">
              Pure Silk
            </Link>
            <Link href="/products?category=tissue-zari-maheshwari" className="hover:text-rose-700 transition-colors py-2 border-b-2 border-transparent hover:border-rose-700">
              Tissue Zari
            </Link>
            <Link href="/products?category=chatai-border-special" className="hover:text-rose-700 transition-colors py-2 border-b-2 border-transparent hover:border-rose-700 text-rose-700 font-extrabold">
              Chatai Border ✨
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs relative">
            <input
              type="text"
              placeholder="Search Maheshwari sarees, silk, zari..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-amber-50/50 border border-amber-200/80 rounded-full py-2 pl-10 pr-4 text-xs font-medium text-amber-950 placeholder-amber-800/50 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:bg-white transition-all shadow-2xs"
            />
            <Search className="w-4 h-4 text-amber-800 absolute left-3.5 top-2.5" />
          </form>

          {/* Action Icons */}
          <div className="flex items-center gap-5 sm:gap-6">
            
            {/* Account / Login Icon */}
            {user ? (
              <div className="relative group flex flex-col items-center">
                <Link
                  href={user.role === 'admin' ? '/admin' : '/login'}
                  className="flex flex-col items-center text-amber-950 hover:text-rose-700 transition-colors"
                >
                  <User className="w-5 h-5 text-rose-700" />
                  <span className="text-[10px] font-bold mt-1 tracking-wider uppercase hidden sm:block max-w-[80px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </Link>

                {/* Dropdown Menu on Hover */}
                <div className="absolute right-0 top-full pt-2 hidden group-hover:block w-48 z-50">
                  <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-3 text-xs space-y-2">
                    <p className="font-bold text-gray-900 border-b border-gray-100 pb-1">
                      {user.name}
                    </p>
                    {/* Admin Portal link ONLY visible to authenticated Admin */}
                    {user.role === 'admin' && (
                      <Link href="/admin" className="flex items-center gap-1.5 text-amber-900 font-bold hover:text-rose-700">
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
                  Login
                </span>
              </Link>
            )}

            {/* Wishlist */}
            <Link href="/wishlist" className="flex flex-col items-center text-amber-950 hover:text-rose-700 transition-colors relative group">
              <div className="relative">
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[9px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold mt-1 tracking-wider uppercase hidden sm:block">
                Wishlist
              </span>
            </Link>

            {/* Bag */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex flex-col items-center text-amber-950 hover:text-rose-700 transition-colors relative group"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform text-rose-700" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-700 text-white text-[9px] font-extrabold rounded-full w-4.5 h-4.5 flex items-center justify-center shadow">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold mt-1 tracking-wider uppercase hidden sm:block">
                Bag
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search products, styles, sarees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-amber-50 border border-amber-200 rounded-full py-2 pl-9 pr-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-rose-600"
            />
            <Search className="w-4 h-4 text-amber-800 absolute left-3 top-2.5" />
          </form>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-4 space-y-3 font-bold text-xs uppercase tracking-wider">
          <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 border-b border-gray-100 text-gray-900">
            All Maheshwari Sarees
          </Link>
          <Link href="/products?category=silk-cotton-maheshwari" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 border-b border-gray-100 text-gray-900">
            Silk Cotton
          </Link>
          <Link href="/products?category=pure-silk-maheshwari" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 border-b border-gray-100 text-gray-900">
            Pure Silk
          </Link>
          <Link href="/products?category=tissue-zari-maheshwari" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 border-b border-gray-100 text-gray-900">
            Tissue Zari
          </Link>
          <Link href="/products?category=chatai-border-special" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 border-b border-gray-100 text-rose-700 font-extrabold">
            Chatai Border Special ✨
          </Link>
          <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-amber-900">
            {user ? `Account (${user.name})` : 'Login / Register'}
          </Link>
        </div>
      )}
    </header>
  );
};
