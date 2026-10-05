'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useShop, ProductItem } from '@/context/ShopContext';
import { ProductCard } from '@/components/ProductCard';
import { MobileProductSlider } from '@/components/MobileProductSlider';
import { WatermarkOverlay } from '@/components/WatermarkOverlay';
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Star,
  ChevronRight,
  Check,
  MessageSquare,
  User,
  ThumbsUp,
  Upload,
  Camera,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Feather,
  Leaf,
  Layers,
  Droplets,
  RotateCcw,
  Flame,
  FileText,
  Tag,
  Share2,
  ZoomIn,
  ChevronLeft,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Zap,
  Play,
  Video,
  HelpCircle,
  MessageCircle,
} from 'lucide-react';

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.67-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

// 4 Royal 3D Luxury Emblems for Pure Maheshwari Handloom
const RoyalHandwovenBadge = () => (
  <img
    src="/images/badge_100_handwoven.png"
    alt="100% Handwoven Maheshwar Craft"
    className="w-full h-full object-contain drop-shadow-md transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-xl"
  />
);

const RoyalSilkZariBadge = () => (
  <img
    src="/images/badge_pure_silk_zari.png"
    alt="Pure Silk Cotton Metallic Zari"
    className="w-full h-full object-contain drop-shadow-md transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-xl"
  />
);

const RoyalSustainableBadge = () => (
  <img
    src="/images/badge_100_sustainable.png"
    alt="100% Sustainable Natural Dyes"
    className="w-full h-full object-contain drop-shadow-md transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-xl"
  />
);

const RoyalWeaversBadge = () => (
  <img
    src="/images/badge_direct_weavers.png"
    alt="Direct from Weavers Estd 1960"
    className="w-full h-full object-contain drop-shadow-md transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-xl"
  />
);

// 4 Dedicated 3D Luxury Emblems for Semi Maheshwari
const SemiSilkBadge = () => (
  <img
    src="/images/badge_semi_silk.png"
    alt="Premium Semi Silk Rich Blend"
    className="w-full h-full object-contain drop-shadow-md transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-xl"
  />
);

const SemiZariBadge = () => (
  <img
    src="/images/badge_semi_zari.png"
    alt="Royal Zari Border & Rich Pallu"
    className="w-full h-full object-contain drop-shadow-md transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-xl"
  />
);

const SemiEasyCareBadge = () => (
  <img
    src="/images/badge_semi_easycare.png"
    alt="Easy Care & Wrinkle-Free"
    className="w-full h-full object-contain drop-shadow-md transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-xl"
  />
);

const SemiHubBadge = () => (
  <img
    src="/images/badge_semi_hub.png"
    alt="Direct from Maheshwar Hub"
    className="w-full h-full object-contain drop-shadow-md transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-xl"
  />
);

// 7 Dedicated 3D Luxury Animated Emblems for PDP Accordion Sections
const AccordionWashEmblem = () => (
  <div className="relative w-11 h-11 sm:w-12 sm:h-12 shrink-0 animate-royal-float-1 group-hover:scale-110 transition-transform duration-300">
    <div className="absolute -inset-1 bg-amber-400/30 rounded-full filter blur-xs animate-royal-aura pointer-events-none" />
    <div className="relative w-full h-full overflow-hidden rounded-full drop-shadow-md">
      <svg viewBox="0 0 100 100" className="w-full h-full select-none">
        <defs>
          <radialGradient id="goldRimWash" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFF4B8" />
            <stop offset="35%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#996515" />
            <stop offset="100%" stopColor="#4A3008" />
          </radialGradient>
          <radialGradient id="bgWash" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#7A1C28" />
            <stop offset="70%" stopColor="#3B0910" />
            <stop offset="100%" stopColor="#1A0307" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#goldRimWash)" stroke="#FFE082" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="43" fill="none" stroke="#FFEBA8" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="40" fill="url(#bgWash)" />
        {/* Central Wash Droplet & Silk Ripple */}
        <path d="M50 25 C50 25 35 44 35 55 C35 63.3 41.7 70 50 70 C58.3 70 65 63.3 65 55 C65 44 50 25 50 25 Z" fill="#FFE58F" stroke="#FFF7D6" strokeWidth="1.5" />
        <path d="M43 54 C43 50 47 44 50 40" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9" />
        <circle cx="50" cy="58" r="3.5" fill="#D48806" />
        <path d="M28 48 L30 43 L32 48 L37 50 L32 52 L30 57 L28 52 L23 50 Z" fill="#FFD700" />
        <path d="M72 48 L70 43 L68 48 L63 50 L68 52 L70 57 L72 52 L77 50 Z" fill="#FFD700" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-transparent pointer-events-none animate-royal-shimmer-1" />
    </div>
  </div>
);

const AccordionShippingEmblem = () => (
  <div className="relative w-11 h-11 sm:w-12 sm:h-12 shrink-0 animate-royal-float-2 group-hover:scale-110 transition-transform duration-300">
    <div className="absolute -inset-1 bg-emerald-400/30 rounded-full filter blur-xs animate-royal-aura pointer-events-none" />
    <div className="relative w-full h-full overflow-hidden rounded-full drop-shadow-md">
      <svg viewBox="0 0 100 100" className="w-full h-full select-none">
        <defs>
          <radialGradient id="goldRimShip" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFF4B8" />
            <stop offset="35%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#996515" />
            <stop offset="100%" stopColor="#4A3008" />
          </radialGradient>
          <radialGradient id="bgShip" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#145A32" />
            <stop offset="70%" stopColor="#0B3C1D" />
            <stop offset="100%" stopColor="#051E0E" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#goldRimShip)" stroke="#FFE082" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="43" fill="none" stroke="#FFEBA8" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="40" fill="url(#bgShip)" />
        {/* Express Delivery Truck with Speed Star */}
        <rect x="28" y="42" width="26" height="18" rx="2" fill="#FFE58F" stroke="#FFF7D6" strokeWidth="1" />
        <path d="M54 47 L65 47 L71 53 L71 60 L54 60 Z" fill="#FFD54F" stroke="#FFF7D6" strokeWidth="1" />
        <rect x="57" y="49" width="7" height="5" rx="1" fill="#145A32" />
        <circle cx="38" cy="62" r="5" fill="#4A3008" stroke="#FFE58F" strokeWidth="1.5" />
        <circle cx="63" cy="62" r="5" fill="#4A3008" stroke="#FFE58F" strokeWidth="1.5" />
        <path d="M24 38 L38 34 M22 43 L32 41" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
        <circle cx="48" cy="32" r="2.5" fill="#FFD700" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-transparent pointer-events-none animate-royal-shimmer-2" />
    </div>
  </div>
);

const AccordionReturnsEmblem = () => (
  <div className="relative w-11 h-11 sm:w-12 sm:h-12 shrink-0 animate-royal-float-3 group-hover:scale-110 transition-transform duration-300">
    <div className="absolute -inset-1 bg-amber-400/30 rounded-full filter blur-xs animate-royal-aura pointer-events-none" />
    <div className="relative w-full h-full overflow-hidden rounded-full drop-shadow-md">
      <svg viewBox="0 0 100 100" className="w-full h-full select-none">
        <defs>
          <radialGradient id="goldRimRet" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFF4B8" />
            <stop offset="35%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#996515" />
            <stop offset="100%" stopColor="#4A3008" />
          </radialGradient>
          <radialGradient id="bgRet" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#6C3483" />
            <stop offset="70%" stopColor="#4A154B" />
            <stop offset="100%" stopColor="#240726" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#goldRimRet)" stroke="#FFE082" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="43" fill="none" stroke="#FFEBA8" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="40" fill="url(#bgRet)" />
        {/* 7-Day Guarantee Return Circle */}
        <path d="M50 28 A20 20 0 1 1 32 42" fill="none" stroke="#FFE58F" strokeWidth="4" strokeLinecap="round" />
        <path d="M30 32 L32 44 L44 42" fill="#FFE58F" stroke="#FFF7D6" strokeWidth="1" />
        <text x="50" y="57" fill="#FFF7D6" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="serif">7D</text>
      </svg>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-transparent pointer-events-none animate-royal-shimmer-3" />
    </div>
  </div>
);

const AccordionIronEmblem = () => (
  <div className="relative w-11 h-11 sm:w-12 sm:h-12 shrink-0 animate-royal-float-4 group-hover:scale-110 transition-transform duration-300">
    <div className="absolute -inset-1 bg-amber-400/30 rounded-full filter blur-xs animate-royal-aura pointer-events-none" />
    <div className="relative w-full h-full overflow-hidden rounded-full drop-shadow-md">
      <svg viewBox="0 0 100 100" className="w-full h-full select-none">
        <defs>
          <radialGradient id="goldRimIron" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFF4B8" />
            <stop offset="35%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#996515" />
            <stop offset="100%" stopColor="#4A3008" />
          </radialGradient>
          <radialGradient id="bgIron" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#873600" />
            <stop offset="70%" stopColor="#4D1F00" />
            <stop offset="100%" stopColor="#260F00" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#goldRimIron)" stroke="#FFE082" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="43" fill="none" stroke="#FFEBA8" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="40" fill="url(#bgIron)" />
        {/* Iron Outline with Steam Sparkles */}
        <path d="M30 60 L70 60 C64 48 50 48 50 48 L32 48 C30 48 28 50 28 53 L28 58 C28 59.1 28.9 60 30 60 Z" fill="#FFE58F" stroke="#FFF7D6" strokeWidth="1.5" />
        <path d="M34 48 L34 38 L54 38 L54 44" fill="none" stroke="#FFD54F" strokeWidth="3" strokeLinecap="round" />
        <circle cx="42" cy="30" r="2" fill="#FFE58F" />
        <circle cx="52" cy="27" r="2.5" fill="#FFE58F" />
        <circle cx="62" cy="32" r="2" fill="#FFE58F" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-transparent pointer-events-none animate-royal-shimmer-4" />
    </div>
  </div>
);

const AccordionDetailsEmblem = () => (
  <div className="relative w-11 h-11 sm:w-12 sm:h-12 shrink-0 animate-royal-float-1 group-hover:scale-110 transition-transform duration-300">
    <div className="absolute -inset-1 bg-amber-400/30 rounded-full filter blur-xs animate-royal-aura pointer-events-none" />
    <div className="relative w-full h-full overflow-hidden rounded-full drop-shadow-md">
      <svg viewBox="0 0 100 100" className="w-full h-full select-none">
        <defs>
          <radialGradient id="goldRimDet" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFF4B8" />
            <stop offset="35%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#996515" />
            <stop offset="100%" stopColor="#4A3008" />
          </radialGradient>
          <radialGradient id="bgDet" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#1B263B" />
            <stop offset="70%" stopColor="#0D1B2A" />
            <stop offset="100%" stopColor="#050C14" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#goldRimDet)" stroke="#FFE082" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="43" fill="none" stroke="#FFEBA8" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="40" fill="url(#bgDet)" />
        {/* Handloom Shuttle & Royal Weave Specification Certificate */}
        <rect x="32" y="28" width="36" height="44" rx="3" fill="#FFE58F" stroke="#FFF7D6" strokeWidth="1.5" />
        <line x1="38" y1="38" x2="62" y2="38" stroke="#7A1C28" strokeWidth="2" strokeLinecap="round" />
        <line x1="38" y1="46" x2="62" y2="46" stroke="#7A1C28" strokeWidth="2" strokeLinecap="round" />
        <line x1="38" y1="54" x2="56" y2="54" stroke="#7A1C28" strokeWidth="2" strokeLinecap="round" />
        <circle cx="56" cy="62" r="5" fill="#D4AF37" stroke="#FFF" strokeWidth="1" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-transparent pointer-events-none animate-royal-shimmer-1" />
    </div>
  </div>
);

const AccordionFaqEmblem = () => (
  <div className="relative w-11 h-11 sm:w-12 sm:h-12 shrink-0 animate-royal-float-2 group-hover:scale-110 transition-transform duration-300">
    <div className="absolute -inset-1 bg-amber-400/30 rounded-full filter blur-xs animate-royal-aura pointer-events-none" />
    <div className="relative w-full h-full overflow-hidden rounded-full drop-shadow-md">
      <svg viewBox="0 0 100 100" className="w-full h-full select-none">
        <defs>
          <radialGradient id="goldRimFaq" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFF4B8" />
            <stop offset="35%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#996515" />
            <stop offset="100%" stopColor="#4A3008" />
          </radialGradient>
          <radialGradient id="bgFaq" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#2E1A47" />
            <stop offset="70%" stopColor="#1C0F2D" />
            <stop offset="100%" stopColor="#0B0512" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#goldRimFaq)" stroke="#FFE082" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="43" fill="none" stroke="#FFEBA8" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="40" fill="url(#bgFaq)" />
        {/* Royal Inquiry Crest with Star */}
        <text x="50" y="62" fill="#FFE58F" fontSize="32" fontWeight="900" textAnchor="middle" fontFamily="serif">?</text>
        <circle cx="30" cy="36" r="2.5" fill="#FFD700" />
        <circle cx="70" cy="36" r="2.5" fill="#FFD700" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-transparent pointer-events-none animate-royal-shimmer-2" />
    </div>
  </div>
);

const AccordionTagsEmblem = () => (
  <div className="relative w-11 h-11 sm:w-12 sm:h-12 shrink-0 animate-royal-float-3 group-hover:scale-110 transition-transform duration-300">
    <div className="absolute -inset-1 bg-amber-400/30 rounded-full filter blur-xs animate-royal-aura pointer-events-none" />
    <div className="relative w-full h-full overflow-hidden rounded-full drop-shadow-md">
      <svg viewBox="0 0 100 100" className="w-full h-full select-none">
        <defs>
          <radialGradient id="goldRimTag" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFF4B8" />
            <stop offset="35%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#996515" />
            <stop offset="100%" stopColor="#4A3008" />
          </radialGradient>
          <radialGradient id="bgTag" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#5D4037" />
            <stop offset="70%" stopColor="#3E2723" />
            <stop offset="100%" stopColor="#1B0000" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#goldRimTag)" stroke="#FFE082" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="43" fill="none" stroke="#FFEBA8" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="40" fill="url(#bgTag)" />
        {/* Luxury Gold Label Tag with Silk String */}
        <path d="M36 30 L54 30 L70 46 L52 64 L36 48 Z" fill="#FFE58F" stroke="#FFF7D6" strokeWidth="1.5" />
        <circle cx="44" cy="38" r="3" fill="#3E2723" />
        <path d="M44 38 Q36 24 28 26" stroke="#FFE58F" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-transparent pointer-events-none animate-royal-shimmer-3" />
    </div>
  </div>
);

// 10 Mini Luxury Animated Emblems for Product Specification Rows
const SpecColorIcon = () => (
  <div className="relative w-6 h-6 sm:w-6.5 sm:h-6.5 shrink-0 animate-royal-float-1 group-hover:scale-110 transition-transform duration-300">
    <div className="absolute -inset-0.5 bg-rose-400/30 rounded-full filter blur-[2px] animate-royal-aura pointer-events-none" />
    <div className="relative w-full h-full overflow-hidden rounded-full drop-shadow-xs border border-amber-300/80">
      <svg viewBox="0 0 100 100" className="w-full h-full select-none">
        <defs>
          <radialGradient id="rimMiniColor" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFF4B8" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#7A4E08" />
          </radialGradient>
          <radialGradient id="bgMiniColor" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#BE123C" />
            <stop offset="70%" stopColor="#881337" />
            <stop offset="100%" stopColor="#4C0519" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#rimMiniColor)" />
        <circle cx="50" cy="50" r="41" fill="url(#bgMiniColor)" />
        <circle cx="36" cy="42" r="5" fill="#FFE58F" />
        <circle cx="52" cy="34" r="5" fill="#38BDF8" />
        <circle cx="66" cy="46" r="5" fill="#34D399" />
        <path d="M38 68 C38 60 48 56 56 60 C64 64 68 70 54 74 C44 76 38 74 38 68 Z" fill="#FFE58F" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-transparent pointer-events-none animate-royal-shimmer-1" />
    </div>
  </div>
);

const SpecBlouseIcon = () => (
  <div className="relative w-6 h-6 sm:w-6.5 sm:h-6.5 shrink-0 animate-royal-float-2 group-hover:scale-110 transition-transform duration-300">
    <div className="absolute -inset-0.5 bg-amber-400/30 rounded-full filter blur-[2px] animate-royal-aura pointer-events-none" />
    <div className="relative w-full h-full overflow-hidden rounded-full drop-shadow-xs border border-amber-300/80">
      <svg viewBox="0 0 100 100" className="w-full h-full select-none">
        <defs>
          <radialGradient id="rimMiniBlouse" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFF4B8" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#7A4E08" />
          </radialGradient>
          <radialGradient id="bgMiniBlouse" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#9333EA" />
            <stop offset="70%" stopColor="#6B21A8" />
            <stop offset="100%" stopColor="#3B0764" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#rimMiniBlouse)" />
        <circle cx="50" cy="50" r="41" fill="url(#bgMiniBlouse)" />
        <path d="M30 36 L42 36 L50 48 L58 36 L70 36 L76 50 L66 54 L66 70 L34 70 L34 54 L24 50 Z" fill="#FFE58F" stroke="#FFF7D6" strokeWidth="2" />
        <line x1="50" y1="48" x2="50" y2="70" stroke="#7A1C28" strokeWidth="2" strokeDasharray="3 2" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-transparent pointer-events-none animate-royal-shimmer-2" />
    </div>
  </div>
);

const SpecFabricIcon = () => (
  <div className="relative w-6 h-6 sm:w-6.5 sm:h-6.5 shrink-0 animate-royal-float-3 group-hover:scale-110 transition-transform duration-300">
    <div className="absolute -inset-0.5 bg-sky-400/30 rounded-full filter blur-[2px] animate-royal-aura pointer-events-none" />
    <div className="relative w-full h-full overflow-hidden rounded-full drop-shadow-xs border border-amber-300/80">
      <svg viewBox="0 0 100 100" className="w-full h-full select-none">
        <defs>
          <radialGradient id="rimMiniFabric" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFF4B8" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#7A4E08" />
          </radialGradient>
          <radialGradient id="bgMiniFabric" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#0369A1" />
            <stop offset="70%" stopColor="#075985" />
            <stop offset="100%" stopColor="#082F49" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#rimMiniFabric)" />
        <circle cx="50" cy="50" r="41" fill="url(#bgMiniFabric)" />
        <path d="M28 50 C28 36 72 36 72 50 C72 64 28 64 28 50 Z" fill="none" stroke="#FFE58F" strokeWidth="4" />
        <line x1="40" y1="30" x2="60" y2="70" stroke="#FFE58F" strokeWidth="3" strokeLinecap="round" />
        <line x1="60" y1="30" x2="40" y2="70" stroke="#FFE58F" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-transparent pointer-events-none animate-royal-shimmer-3" />
    </div>
  </div>
);

const SpecBorderIcon = () => (
  <div className="relative w-6 h-6 sm:w-6.5 sm:h-6.5 shrink-0 animate-royal-float-4 group-hover:scale-110 transition-transform duration-300">
    <div className="absolute -inset-0.5 bg-amber-400/30 rounded-full filter blur-[2px] animate-royal-aura pointer-events-none" />
    <div className="relative w-full h-full overflow-hidden rounded-full drop-shadow-xs border border-amber-300/80">
      <svg viewBox="0 0 100 100" className="w-full h-full select-none">
        <defs>
          <radialGradient id="rimMiniBorder" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFF4B8" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#7A4E08" />
          </radialGradient>
          <radialGradient id="bgMiniBorder" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#B45309" />
            <stop offset="70%" stopColor="#78350F" />
            <stop offset="100%" stopColor="#451A03" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#rimMiniBorder)" />
        <circle cx="50" cy="50" r="41" fill="url(#bgMiniBorder)" />
        <path d="M26 62 L38 42 L50 62 L62 42 L74 62 Z" fill="#FFE58F" stroke="#FFF7D6" strokeWidth="1.5" />
        <circle cx="38" cy="38" r="3" fill="#FFD700" />
        <circle cx="50" cy="34" r="3.5" fill="#FFD700" />
        <circle cx="62" cy="38" r="3" fill="#FFD700" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-transparent pointer-events-none animate-royal-shimmer-4" />
    </div>
  </div>
);

const SpecCraftIcon = () => (
  <div className="relative w-6 h-6 sm:w-6.5 sm:h-6.5 shrink-0 animate-royal-float-1 group-hover:scale-110 transition-transform duration-300">
    <div className="absolute -inset-0.5 bg-amber-400/30 rounded-full filter blur-[2px] animate-royal-aura pointer-events-none" />
    <div className="relative w-full h-full overflow-hidden rounded-full drop-shadow-xs border border-amber-300/80">
      <svg viewBox="0 0 100 100" className="w-full h-full select-none">
        <defs>
          <radialGradient id="rimMiniCraft" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFF4B8" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#7A4E08" />
          </radialGradient>
          <radialGradient id="bgMiniCraft" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#831843" />
            <stop offset="70%" stopColor="#500724" />
            <stop offset="100%" stopColor="#280312" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#rimMiniCraft)" />
        <circle cx="50" cy="50" r="41" fill="url(#bgMiniCraft)" />
        <path d="M24 50 Q50 32 76 50 Q50 68 24 50 Z" fill="#FFE58F" stroke="#FFF7D6" strokeWidth="1.5" />
        <ellipse cx="50" cy="50" rx="8" ry="4" fill="#831843" />
        <line x1="50" y1="46" x2="50" y2="54" stroke="#FFD700" strokeWidth="2" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-transparent pointer-events-none animate-royal-shimmer-1" />
    </div>
  </div>
);

const SpecEcoIcon = () => (
  <div className="relative w-6 h-6 sm:w-6.5 sm:h-6.5 shrink-0 animate-royal-float-2 group-hover:scale-110 transition-transform duration-300">
    <div className="absolute -inset-0.5 bg-emerald-400/30 rounded-full filter blur-[2px] animate-royal-aura pointer-events-none" />
    <div className="relative w-full h-full overflow-hidden rounded-full drop-shadow-xs border border-amber-300/80">
      <svg viewBox="0 0 100 100" className="w-full h-full select-none">
        <defs>
          <radialGradient id="rimMiniEco" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFF4B8" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#7A4E08" />
          </radialGradient>
          <radialGradient id="bgMiniEco" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#047857" />
            <stop offset="70%" stopColor="#064E3B" />
            <stop offset="100%" stopColor="#022C22" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#rimMiniEco)" />
        <circle cx="50" cy="50" r="41" fill="url(#bgMiniEco)" />
        <path d="M34 66 C34 40 50 30 70 30 C70 50 60 66 34 66 Z" fill="#FFE58F" stroke="#FFF7D6" strokeWidth="1.5" />
        <path d="M34 66 Q52 48 70 30" stroke="#047857" strokeWidth="2.5" fill="none" />
        <path d="M46 54 Q54 50 56 46" stroke="#047857" strokeWidth="2" fill="none" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-transparent pointer-events-none animate-royal-shimmer-2" />
    </div>
  </div>
);

const SpecDrapeIcon = () => (
  <div className="relative w-6 h-6 sm:w-6.5 sm:h-6.5 shrink-0 animate-royal-float-3 group-hover:scale-110 transition-transform duration-300">
    <div className="absolute -inset-0.5 bg-amber-400/30 rounded-full filter blur-[2px] animate-royal-aura pointer-events-none" />
    <div className="relative w-full h-full overflow-hidden rounded-full drop-shadow-xs border border-amber-300/80">
      <svg viewBox="0 0 100 100" className="w-full h-full select-none">
        <defs>
          <radialGradient id="rimMiniDrape" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFF4B8" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#7A4E08" />
          </radialGradient>
          <radialGradient id="bgMiniDrape" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#7C2D12" />
            <stop offset="70%" stopColor="#451A03" />
            <stop offset="100%" stopColor="#1C0700" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#rimMiniDrape)" />
        <circle cx="50" cy="50" r="41" fill="url(#bgMiniDrape)" />
        <path d="M26 40 Q40 60 50 40 T74 40" stroke="#FFE58F" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M26 60 Q40 80 50 60 T74 60" stroke="#FFE58F" strokeWidth="4" strokeLinecap="round" fill="none" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-transparent pointer-events-none animate-royal-shimmer-3" />
    </div>
  </div>
);

const SpecCareIcon = () => (
  <div className="relative w-6 h-6 sm:w-6.5 sm:h-6.5 shrink-0 animate-royal-float-4 group-hover:scale-110 transition-transform duration-300">
    <div className="absolute -inset-0.5 bg-amber-400/30 rounded-full filter blur-[2px] animate-royal-aura pointer-events-none" />
    <div className="relative w-full h-full overflow-hidden rounded-full drop-shadow-xs border border-amber-300/80">
      <svg viewBox="0 0 100 100" className="w-full h-full select-none">
        <defs>
          <radialGradient id="rimMiniCare" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFF4B8" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#7A4E08" />
          </radialGradient>
          <radialGradient id="bgMiniCare" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="70%" stopColor="#172554" />
            <stop offset="100%" stopColor="#0B132B" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#rimMiniCare)" />
        <circle cx="50" cy="50" r="41" fill="url(#bgMiniCare)" />
        <path d="M50 28 C50 28 36 46 36 56 C36 64 42 70 50 70 C58 70 64 64 64 56 C64 46 50 28 50 28 Z" fill="#FFE58F" stroke="#FFF7D6" strokeWidth="1.5" />
        <circle cx="50" cy="58" r="3" fill="#1E3A8A" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-transparent pointer-events-none animate-royal-shimmer-4" />
    </div>
  </div>
);

const SpecLengthIcon = () => (
  <div className="relative w-6 h-6 sm:w-6.5 sm:h-6.5 shrink-0 animate-royal-float-1 group-hover:scale-110 transition-transform duration-300">
    <div className="absolute -inset-0.5 bg-amber-400/30 rounded-full filter blur-[2px] animate-royal-aura pointer-events-none" />
    <div className="relative w-full h-full overflow-hidden rounded-full drop-shadow-xs border border-amber-300/80">
      <svg viewBox="0 0 100 100" className="w-full h-full select-none">
        <defs>
          <radialGradient id="rimMiniLen" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFF4B8" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#7A4E08" />
          </radialGradient>
          <radialGradient id="bgMiniLen" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="70%" stopColor="#1F2937" />
            <stop offset="100%" stopColor="#111827" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#rimMiniLen)" />
        <circle cx="50" cy="50" r="41" fill="url(#bgMiniLen)" />
        <rect x="28" y="42" width="44" height="16" rx="3" fill="#FFE58F" stroke="#FFF7D6" strokeWidth="1.5" />
        <line x1="36" y1="42" x2="36" y2="48" stroke="#1F2937" strokeWidth="1.5" />
        <line x1="44" y1="42" x2="44" y2="52" stroke="#1F2937" strokeWidth="2" />
        <line x1="52" y1="42" x2="52" y2="48" stroke="#1F2937" strokeWidth="1.5" />
        <line x1="60" y1="42" x2="60" y2="52" stroke="#1F2937" strokeWidth="2" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-transparent pointer-events-none animate-royal-shimmer-1" />
    </div>
  </div>
);

const SpecOriginIcon = () => (
  <div className="relative w-6 h-6 sm:w-6.5 sm:h-6.5 shrink-0 animate-royal-float-2 group-hover:scale-110 transition-transform duration-300">
    <div className="absolute -inset-0.5 bg-amber-400/30 rounded-full filter blur-[2px] animate-royal-aura pointer-events-none" />
    <div className="relative w-full h-full overflow-hidden rounded-full drop-shadow-xs border border-amber-300/80">
      <svg viewBox="0 0 100 100" className="w-full h-full select-none">
        <defs>
          <radialGradient id="rimMiniOrigin" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFF4B8" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#7A4E08" />
          </radialGradient>
          <radialGradient id="bgMiniOrigin" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#4A0E17" />
            <stop offset="70%" stopColor="#2E080E" />
            <stop offset="100%" stopColor="#140205" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#rimMiniOrigin)" />
        <circle cx="50" cy="50" r="41" fill="url(#bgMiniOrigin)" />
        <path d="M30 68 L30 46 L50 32 L70 46 L70 68 Z" fill="#FFE58F" stroke="#FFF7D6" strokeWidth="1.5" />
        <path d="M42 68 L42 52 C42 48 58 48 58 52 L58 68 Z" fill="#4A0E17" />
        <circle cx="50" cy="42" r="3" fill="#FFD700" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-transparent pointer-events-none animate-royal-shimmer-2" />
    </div>
  </div>
);

interface ProductDetailClientProps {
  initialProduct?: ProductItem | null;
  initialRelatedProducts?: ProductItem[];
  initialColorVariants?: ProductItem[];
  initialCandidatePool?: ProductItem[];
  slug: string;
}

export default function ProductDetailClient({
  initialProduct,
  initialRelatedProducts = [],
  initialColorVariants = [],
  initialCandidatePool = [],
  slug: propSlug,
}: ProductDetailClientProps) {
  const params = useParams();
  const router = useRouter();
  const slug = propSlug || (params?.slug as string) || '';

  const { user, addToCart, buyNow, toggleWishlist, isInWishlist, setIsCartOpen } = useShop();

  const [product, setProduct] = useState<ProductItem | null>(initialProduct || null);
  const [relatedProducts, setRelatedProducts] = useState<ProductItem[]>(initialRelatedProducts || []);
  const [colorVariants, setColorVariants] = useState<ProductItem[]>(initialColorVariants || []);
  const [allStoreProducts, setAllStoreProducts] = useState<ProductItem[]>(initialCandidatePool || []);
  const [recommendedProducts, setRecommendedProducts] = useState<ProductItem[]>(() => {
    if (initialCandidatePool && initialCandidatePool.length > 0) {
      const others = initialCandidatePool.filter((p: any) => p.slug !== slug && p.id !== initialProduct?.id);
      return [...others].sort(() => 0.5 - Math.random()).slice(0, 4);
    }
    return [];
  });
  const [reviews, setReviews] = useState<any[]>((initialProduct as any)?.reviews || []);
  const [loading, setLoading] = useState(!initialProduct);
  const [selectedImage, setSelectedImage] = useState<string>(() => {
    if (initialProduct?.images) {
      try {
        const parsed = JSON.parse(initialProduct.images);
        return parsed[0] || '';
      } catch (e) {
        return '';
      }
    }
    return '';
  });

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [pincode, setPincode] = useState('');
  const [deliveryMsg, setDeliveryMsg] = useState('');

  // Fall & Pico bidding & Lightbox state
  const [hasFallPico, setHasFallPico] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeMediaType, setActiveMediaType] = useState<'image' | 'video'>('image');
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  // Nykaa Fashion-style Hover Magnifying Lens Zoom state
  const [isHoverZooming, setIsHoverZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, percentX: 50, percentY: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const percentX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const percentY = Math.max(0, Math.min(100, (y / rect.height) * 100));
    setZoomPos({ x, y, percentX, percentY });
  };

  const handleMouseEnter = () => setIsHoverZooming(true);
  const handleMouseLeave = () => setIsHoverZooming(false);

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!product) return;
    const parsed: string[] = JSON.parse(product.images || '[]');
    if (parsed.length === 0) return;
    if (activeMediaType === 'video') {
      setActiveMediaType('image');
      setCurrentImageIdx(0);
      setSelectedImage(parsed[0]);
      return;
    }
    const nextIdx = (currentImageIdx + 1) % parsed.length;
    setCurrentImageIdx(nextIdx);
    setSelectedImage(parsed[nextIdx]);
    setActiveMediaType('image');
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!product) return;
    const parsed: string[] = JSON.parse(product.images || '[]');
    if (parsed.length === 0) return;
    if (activeMediaType === 'video') {
      setActiveMediaType('image');
      setCurrentImageIdx(parsed.length - 1);
      setSelectedImage(parsed[parsed.length - 1]);
      return;
    }
    const prevIdx = (currentImageIdx - 1 + parsed.length) % parsed.length;
    setCurrentImageIdx(prevIdx);
    setSelectedImage(parsed[prevIdx]);
    setActiveMediaType('image');
  };

  const handleShare = async () => {
    if (!product) return;
    const cleanSlug = product.slug || slug;
    const shareUrl = `https://reotihandloom.com/products/${cleanSlug}`;
    const message = `✨ *${product.title}*\n${shareUrl}\n\n💰 *Price*: ₹${product.price.toLocaleString()} (FREE Express Shipping)\n🧵 *Fabric*: ${product.fabric || 'Maheshwari Handloom'}\n🎨 *Color*: ${product.color || 'As Shown'}`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${product.title} | Reoti Handloom`,
          text: message,
        });
      } catch (err) {
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const handleDirectWhatsAppShare = () => {
    if (!product) return;
    const cleanSlug = product.slug || slug;
    const shareUrl = `https://reotihandloom.com/products/${cleanSlug}`;
    const message = `✨ *${product.title}*\n${shareUrl}\n\n💰 *Price*: ₹${product.price.toLocaleString()} (FREE Express Shipping)\n🧵 *Fabric*: ${product.fabric || 'Maheshwari Handloom'}\n🎨 *Color*: ${product.color || 'As Shown'}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = (url: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 3000);
  };

  // Expandable Accordion Sections State (Matching Design Image)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    wash: true,
    shipping: false,
    returns: false,
    iron: false,
    details: true,
    faqs: false,
    tags: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Customer Review Form state
  const [reviewerName, setReviewerName] = useState(user?.name || '');
  const [reviewerRating, setReviewerRating] = useState(0);
  const [reviewerComment, setReviewerComment] = useState('');
  const [reviewImage, setReviewImage] = useState('');
  const [isUploadingReviewImage, setIsUploadingReviewImage] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    if (user?.name && !reviewerName) {
      setReviewerName(user.name);
    }
  }, [user, reviewerName]);

  const [isRecRotating, setIsRecRotating] = useState(false);

  const isSemiProduct = (prod: any) => {
    if (!prod) return false;
    const catId = prod.categoryId || prod.category?.id;
    const catSlug = (prod.category?.slug || '').toLowerCase();
    const catName = (prod.category?.name || '').toLowerCase();
    const title = (prod.title || '').toLowerCase();
    const fabric = (prod.fabric || '').toLowerCase();
    const design = (prod.designCode || '').toLowerCase();
    const pSlug = (prod.slug || '').toLowerCase();

    return (
      catId === 'semi-maheshwari-sarees-id' ||
      catSlug.includes('semi-maheshwari') ||
      catName.includes('semi maheshwari') ||
      title.includes('semi maheshwari') ||
      title.includes('semi-maheshwari') ||
      title.startsWith('semi ') ||
      fabric.includes('semi') ||
      design.includes('semi') ||
      pSlug.includes('semi-maheshwari')
    );
  };

  const shufflePdpRecommended = (list: ProductItem[]) => {
    if (!list || list.length === 0) return;
    setIsRecRotating(true);
    setTimeout(() => {
      const others = list.filter((p: any) => p.slug !== slug && p.id !== product?.id);
      const shuffled = [...others].sort(() => 0.5 - Math.random());
      setRecommendedProducts(shuffled.slice(0, 4));
      setIsRecRotating(false);
    }, 250);
  };

  useEffect(() => {
    if (!slug) return;

    // Instant SSR Hydration: if product matches slug already, skip blocking network requests!
    if (product && (product.slug === slug || product.id === slug)) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.product) {
          const currentProd = data.product;
          setProduct(currentProd);
          setRelatedProducts(data.relatedProducts || []);
          setColorVariants(data.colorVariants || []);
          setReviews(currentProd.reviews || []);
          const parsedImages = JSON.parse(currentProd.images || '[]');
          if (parsedImages.length > 0) setSelectedImage(parsedImages[0]);

          if (data.relatedProducts && data.relatedProducts.length > 0) {
            setRecommendedProducts(data.relatedProducts.slice(0, 4));
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const handleReviewImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingReviewImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setReviewImage(data.url);
      } else {
        alert('Image upload failed: ' + data.error);
      }
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      setIsUploadingReviewImage(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (reviewerRating === 0) {
      setReviewMsg('Please select rating stars (1 to 5 stars) before submitting.');
      return;
    }
    if (!reviewerName || !reviewerComment) {
      setReviewMsg('Please enter your name and review details.');
      return;
    }

    setIsSubmittingReview(true);
    setReviewMsg('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          userName: reviewerName,
          userEmail: user?.email || '',
          rating: reviewerRating,
          comment: reviewerComment,
          image: reviewImage || null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReviewMsg('✓ Thank you! Your review with photo has been published successfully.');
        setReviewerComment('');
        setReviewImage('');
        setReviewerRating(0);
        
        // Append new review to state
        setReviews((prev) => [data.review, ...prev]);

        // Update product rating and review count live
        setProduct((prevProduct) =>
          prevProduct
            ? {
                ...prevProduct,
                rating: data.newRating,
                reviewCount: data.newReviewCount,
              }
            : null
        );
      } else {
        setReviewMsg('Error submitting review: ' + data.error);
      }
    } catch (err: any) {
      setReviewMsg('Error submitting review: ' + err.message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-sans">
        <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-gray-600 mt-4">Loading Saree details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-sans space-y-4">
        <h2 className="text-2xl font-serif font-bold text-gray-900">Saree Not Found</h2>
        <p className="text-xs text-gray-500">The requested Maheshwari Saree does not exist.</p>
        <button
          onClick={() => router.push('/products')}
          className="px-6 py-2.5 bg-rose-600 text-white font-bold text-xs rounded hover:bg-rose-700"
        >
          Explore All Sarees
        </button>
      </div>
    );
  }

  const isLiked = isInWishlist(product.id);
  const parsedImages: string[] = JSON.parse(product.images || '[]');

  const handleWhatsAppOrder = () => {
    if (!product) return;
    const pageUrl = typeof window !== 'undefined' ? window.location.href : `https://reotihandloom.com/products/${product.slug || slug}`;
    const mainImg = selectedImage || (parsedImages.length > 0 ? parsedImages[0] : '');
    const fullImgUrl = mainImg.startsWith('http')
      ? mainImg
      : (typeof window !== 'undefined' ? `${window.location.origin}${mainImg}` : `https://reotihandloom.com${mainImg}`);

    const fallPicoMsg = hasFallPico ? '\n✂️ *Fall & Pico Binding*: Included (FREE)' : '';
    const finalPrice = product.price;

    const message = `Namaste Reoti Handloom! 🙏\n\nI want to place an order for this authentic Maheshwari saree:\n\n📌 *Product Name*: ${product.title}\n💰 *Price*: ₹${finalPrice.toLocaleString()}${fallPicoMsg} (FREE Delivery)\n🎨 *Color*: ${product.color || 'As Shown'}\n🧵 *Fabric*: ${product.fabric || 'Maheshwari Handloom'}\n\n🔗 *Product Link*: ${pageUrl}\n🖼️ *Picture*: ${fullImgUrl}\n\nPlease confirm availability and share payment & dispatch details!`;

    const whatsappUrl = `https://wa.me/919617444445?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleWhatsAppInquiry = () => {
    if (!product) return;
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const mainImg = selectedImage || (parsedImages.length > 0 ? parsedImages[0] : '');
    const fullImgUrl = mainImg.startsWith('http')
      ? mainImg
      : (typeof window !== 'undefined' ? `${window.location.origin}${mainImg}` : mainImg);

    const fallPicoMsg = hasFallPico ? '\n✂️ *Fall & Pico Binding*: Included (FREE)' : '';
    const finalPrice = product.price;

    const message = `Hello Reoti Handloom! 🙏\n\nI want to make a Wholesale / Bulk Inquiry for this product:\n\n📌 *Product Name*: ${product.title}\n💰 *Price*: ₹${finalPrice.toLocaleString()}${fallPicoMsg}\n🎨 *Color*: ${product.color || 'As Shown'}\n🧵 *Fabric*: ${product.fabric || 'Maheshwari Handloom'}\n\n🔗 *Product Link*: ${pageUrl}\n🖼️ *Product Picture*: ${fullImgUrl}\n\nPlease share wholesale prices, MOQ & catalog details!`;

    const whatsappUrl = `https://wa.me/919617444445?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setDeliveryMsg(`✓ Express Delivery available to ${pincode} in 3-5 business days. FREE Shipping!`);
    } else {
      setDeliveryMsg('Please enter a valid 6-digit Pincode.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      {/* Breadcrumb Path */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 font-medium">
        <span className="cursor-pointer hover:text-rose-600" onClick={() => router.push('/')}>Home</span>
        <ChevronRight className="w-3 h-3" />
        <span className="cursor-pointer hover:text-rose-600" onClick={() => router.push('/products')}>Women</span>
        <ChevronRight className="w-3 h-3" />
        <span className="cursor-pointer hover:text-rose-600" onClick={() => router.push('/products')}>Indianwear</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-bold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* PDP Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Gallery Column: Full Track Stretch with high Z-index stacking context */}
        <div className="lg:col-span-6 relative z-30">
          <div className="lg:sticky lg:top-24 flex flex-col sm:flex-row gap-4 relative z-30">
            
            {/* Desktop Vertical Thumbnail Strip (Left Side) */}
            {(parsedImages.length > 0 || product.videoUrl) && (
              <div className="hidden sm:flex sm:flex-col gap-3 overflow-y-auto shrink-0 max-h-[580px] no-scrollbar">
                {/* 1. All Product Photos First */}
                {parsedImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedImage(imgUrl);
                      setCurrentImageIdx(idx);
                      setActiveMediaType('image');
                    }}
                    className={`w-16 h-20 rounded-lg border-2 overflow-hidden bg-slate-100 transition-all shrink-0 cursor-pointer ${
                      activeMediaType === 'image' && selectedImage === imgUrl ? 'border-rose-600 shadow-md ring-2 ring-rose-200' : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}

                {/* 2. Product Video Thumbnail Last (Live Looping Preview) */}
                {product.videoUrl && (
                  <button
                    onClick={() => setActiveMediaType('video')}
                    className={`w-16 h-20 rounded-lg border-2 overflow-hidden relative bg-neutral-950 transition-all shrink-0 cursor-pointer shadow-md group/vid ${
                      activeMediaType === 'video'
                        ? 'border-amber-500 ring-2 ring-amber-300 scale-105 shadow-amber-900/20'
                        : 'border-neutral-800 opacity-85 hover:opacity-100'
                    }`}
                    title="Watch Saree Draping Video"
                  >
                    {/* Live Looping Video in Thumbnail */}
                    <video
                      src={product.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-black/25 flex flex-col items-center justify-center gap-0.5 pointer-events-none">
                      <div className="w-6 h-6 rounded-full bg-black/70 backdrop-blur-xs flex items-center justify-center text-amber-300 border border-amber-400/70 shadow-sm group-hover/vid:scale-110 transition-transform">
                        <Play className="w-3 h-3 fill-current ml-0.5" />
                      </div>
                      <span className="text-[8px] font-black uppercase text-amber-200 tracking-wider drop-shadow-sm bg-black/60 px-1 py-0.2 rounded">
                        Video
                      </span>
                    </div>
                  </button>
                )}
              </div>
            )}

            {/* Main Large Media Container */}
            <div className="flex-1 flex flex-col gap-3">
              {activeMediaType === 'video' && product.videoUrl ? (
                /* Inline Video Player (Filled, Muted, AutoPlay, Loop, Watermarked, Click to Expand) */
                <div className="w-full h-[460px] sm:h-[560px] max-h-[580px] rounded-xl overflow-hidden bg-neutral-950 relative border border-amber-950/20 shadow-md flex items-center justify-center select-none group">
                  <video
                    key={product.videoUrl}
                    src={product.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover object-center bg-black cursor-zoom-in select-none"
                    onClick={() => setIsLightboxOpen(true)}
                  >
                    Your browser does not support video playback.
                  </video>

                  {/* Diagonal Heritage Watermark Overlay directly on Video */}
                  <WatermarkOverlay variant="pdp" imageUrl={product.videoUrl} />

                  {/* Top Right Controls: Big Screen Zoom & Switch to Photos */}
                  <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsLightboxOpen(true);
                      }}
                      className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-lg shadow-md border border-gray-300 transition-transform active:scale-95 cursor-pointer flex items-center justify-center"
                      title="Full Screen / Big Screen Video"
                    >
                      <ZoomIn className="w-5 h-5 text-gray-800" />
                    </button>

                    <button
                      onClick={() => {
                        setActiveMediaType('image');
                        setSelectedImage(parsedImages[0] || '');
                        setCurrentImageIdx(0);
                      }}
                      className="bg-neutral-900/90 hover:bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-neutral-700 shadow-md backdrop-blur-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Switch to Photos"
                    >
                      <span>✕ View Photos</span>
                    </button>
                  </div>

                  {/* Top Left Video Badge (Click to open Big Screen) */}
                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    className="absolute top-3 left-3 bg-neutral-950/90 hover:bg-neutral-900 text-amber-300 text-[11px] font-bold px-3 py-1.5 rounded-full border border-amber-500/50 shadow-md backdrop-blur-xs flex items-center gap-1.5 z-20 cursor-pointer transition-all"
                    title="Click for Big Screen"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Saree Video (Loop • Muted • Click for Big Screen)</span>
                  </button>

                  {/* Navigation Arrow Buttons */}
                  {parsedImages.length > 0 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2.5 rounded-full shadow-md border border-gray-300 transition-all active:scale-95 cursor-pointer z-20 flex items-center justify-center"
                        title="Previous Photo"
                      >
                        <ArrowLeft className="w-4 h-4 text-gray-900" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2.5 rounded-full shadow-md border border-gray-300 transition-all active:scale-95 cursor-pointer z-20 flex items-center justify-center"
                        title="Next Photo"
                      >
                        <ArrowRight className="w-4 h-4 text-gray-900" />
                      </button>
                    </>
                  )}

                  {/* Reoti Handloom Premium Glass Watermark Seal Overlay (Bottom-Left) */}
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-amber-950 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border border-amber-300/90 shadow-md pointer-events-none flex items-center gap-1.5 z-20">
                    <div className="w-4 h-4 rounded-full overflow-hidden border border-amber-500 shrink-0">
                      <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-serif font-extrabold text-amber-950 text-[11px] tracking-wide">
                      Reoti Handloom
                    </span>
                    <span className="w-1 h-1 rounded-full bg-amber-500 opacity-60" />
                    <span className="text-[9px] text-amber-800 font-semibold tracking-normal lowercase">
                      authentic video
                    </span>
                  </div>
                </div>
              ) : (
                /* Main Large Image Area with Nykaa Hover Magnifying Lens & Click Zoom */
                <div
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => setIsLightboxOpen(true)}
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-full relative cursor-zoom-in select-none group"
                >
                  {/* Inner Clipped Image Container */}
                  <div
                    onContextMenu={(e) => e.preventDefault()}
                    className="w-full h-[460px] sm:h-[560px] max-h-[580px] rounded-xl overflow-hidden bg-slate-100/80 relative border border-slate-200 shadow-sm flex items-center justify-center select-none"
                  >
                    <img
                      src={selectedImage || parsedImages[0]}
                      alt={product.title}
                      draggable="false"
                      onContextMenu={(e) => e.preventDefault()}
                      className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300 select-none pointer-events-none"
                    />

                    {/* Automatic Diagonal Heritage Watermark Overlay */}
                    <WatermarkOverlay variant="pdp" imageUrl={selectedImage || parsedImages[0]} />

                    {/* Nykaa-style Translucent Hover Lens Box over Image */}
                    {isHoverZooming && (
                      <div
                        className="absolute w-44 h-44 border-2 border-white/90 bg-white/30 backdrop-blur-[1px] pointer-events-none rounded shadow-md z-20 hidden lg:block"
                        style={{
                          left: `calc(${zoomPos.percentX}% - 88px)`,
                          top: `calc(${zoomPos.percentY}% - 88px)`,
                        }}
                      />
                    )}

                    {/* Top Right Zoom Plus Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsLightboxOpen(true);
                      }}
                      className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-lg shadow-md border border-gray-300 transition-transform active:scale-95 cursor-pointer z-10 flex items-center justify-center"
                      title="Zoom Full Screen"
                    >
                      <ZoomIn className="w-5 h-5 text-gray-800" />
                    </button>

                    {/* Watch Video Button Badge Overlay on Main Image */}
                    {product.videoUrl && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMediaType('video');
                        }}
                        className="absolute top-3 left-3 bg-neutral-950/85 hover:bg-neutral-950 text-amber-300 text-[11px] font-bold px-3 py-1.5 rounded-full border border-amber-500/50 shadow-md backdrop-blur-xs flex items-center gap-1.5 transition-all cursor-pointer z-20"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Watch Saree Video</span>
                      </button>
                    )}

                    {/* Navigation Arrow Buttons on Image Sides */}
                    {parsedImages.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2.5 rounded-full shadow-md border border-gray-300 transition-all active:scale-95 cursor-pointer z-20 flex items-center justify-center"
                          title="Previous Photo"
                        >
                          <ArrowLeft className="w-4 h-4 text-gray-900" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2.5 rounded-full shadow-md border border-gray-300 transition-all active:scale-95 cursor-pointer z-20 flex items-center justify-center"
                          title="Next Photo"
                        >
                          <ArrowRight className="w-4 h-4 text-gray-900" />
                        </button>
                      </>
                    )}

                    {/* Reoti Handloom Premium Glass Watermark Seal Overlay (Bottom-Left) */}
                    <div className="absolute bottom-3 left-3 sm:left-3 bg-white/95 backdrop-blur-md text-amber-950 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border border-amber-300/90 shadow-md pointer-events-none flex items-center gap-1.5 z-10">
                      <div className="w-4 h-4 rounded-full overflow-hidden border border-amber-500 shrink-0">
                        <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
                      </div>
                      <span className="font-serif font-extrabold text-amber-950 text-[11px] tracking-wide">
                        Reoti Handloom
                      </span>
                      <span className="w-1 h-1 rounded-full bg-amber-500 opacity-60" />
                      <span className="text-[9px] text-amber-800 font-semibold tracking-normal lowercase">
                        authentic
                      </span>
                    </div>
                  </div>

                  {/* Nykaa-style Floating Magnified Zoom Preview Box (Unclipped on Right Side over Details Column) */}
                  {isHoverZooming && (
                    <div className="absolute top-0 left-[calc(100%+1.25rem)] z-50 w-[540px] h-[560px] rounded-xl overflow-hidden border-2 border-gray-300 shadow-2xl bg-white hidden lg:block pointer-events-none transition-opacity duration-200">
                      <div
                        className="w-full h-full bg-no-repeat"
                        style={{
                          backgroundImage: `url(${selectedImage || parsedImages[0]})`,
                          backgroundSize: '280%',
                          backgroundPosition: `${zoomPos.percentX}% ${zoomPos.percentY}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Horizontal Thumbnail Strip (Below Main Image) */}
              {(parsedImages.length > 1 || product.videoUrl) && (
                <div className="flex sm:hidden gap-2.5 overflow-x-auto pb-1 pt-1 no-scrollbar items-center">
                  {/* 1. All Photos First */}
                  {parsedImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedImage(imgUrl);
                        setCurrentImageIdx(idx);
                        setActiveMediaType('image');
                      }}
                      className={`w-14 h-18 rounded-lg border-2 overflow-hidden bg-slate-100 transition-all shrink-0 cursor-pointer ${
                        activeMediaType === 'image' && selectedImage === imgUrl ? 'border-rose-600 shadow-md ring-2 ring-rose-200' : 'border-gray-200 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}

                  {/* 2. Video Thumbnail Last (Live Looping Preview) */}
                  {product.videoUrl && (
                    <button
                      onClick={() => setActiveMediaType('video')}
                      className={`w-14 h-18 rounded-lg border-2 overflow-hidden relative bg-neutral-950 transition-all shrink-0 cursor-pointer shadow-md group/vid ${
                        activeMediaType === 'video'
                          ? 'border-amber-500 ring-2 ring-amber-300'
                          : 'border-neutral-800 opacity-85 hover:opacity-100'
                      }`}
                      title="Watch Saree Video"
                    >
                      <video
                        src={product.videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-black/25 flex flex-col items-center justify-center gap-0.5 pointer-events-none">
                        <div className="w-5 h-5 rounded-full bg-black/70 backdrop-blur-xs flex items-center justify-center text-amber-300 border border-amber-400/70 shadow-sm">
                          <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                        </div>
                        <span className="text-[7px] font-black uppercase text-amber-200 tracking-wider bg-black/60 px-1 rounded">
                          Video
                        </span>
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Details Column */}
        <div className="lg:col-span-6 space-y-5 relative z-10">
          
          {/* BESTSELLER Tag */}
          <div>
            {product.isBestSeller && (
              <span className="inline-block bg-rose-600 text-white font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded tracking-wider mb-2">
                BESTSELLER
              </span>
            )}

            {/* Brand Title with Official Logo Seal & Heritage Badges */}
            <div className="flex items-center justify-between gap-3 mb-2.5 pb-2 border-b border-amber-900/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400 p-0.5 bg-gradient-to-br from-amber-100 to-amber-200 shrink-0 shadow-sm">
                  <img src="/logo.jpg" alt="Reoti Handloom" className="w-full h-full object-cover object-top rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif font-black text-lg sm:text-xl text-[#4A0E17] tracking-tight leading-none">
                      Reoti Handloom
                    </h2>
                    <span className="text-[9px] font-black uppercase text-amber-900 bg-amber-100/90 border border-amber-300/80 px-2 py-0.5 rounded-full shadow-2xs">
                      Authentic
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800 font-medium italic mt-0.5">
                    Something "more" in Maheshwari Handloom • Estd. 1960
                  </p>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleDirectWhatsAppShare}
                  className="px-2.5 py-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-lg font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                  title="Share directly on WhatsApp"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </button>
                <button
                  onClick={handleShare}
                  className="px-2.5 py-1.5 border border-amber-900/30 hover:border-[#8B2635] text-amber-950 hover:bg-amber-50 rounded-lg font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
                  title="Share / Copy product link"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">SHARE</span>
                </button>
              </div>
            </div>

            {shareCopied && (
              <div className="mb-2 p-2 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
                <span>✓</span> Product link copied to clipboard!
              </div>
            )}

            {/* Product Title */}
            <h1 className="font-serif text-lg sm:text-2xl font-bold text-gray-900 leading-snug tracking-tight">
              {product.title}
            </h1>

            {/* Rating & Review Counter */}
            <div className="flex items-center gap-2.5 mt-2.5">
              {reviews.length > 0 || (product.reviewCount && product.reviewCount > 0) ? (
                <>
                  <div className="flex items-center gap-1.5 border border-emerald-400/80 rounded-lg px-2.5 py-0.5 text-xs font-black text-emerald-900 bg-emerald-50/90 shadow-2xs">
                    <span>{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
                    <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                  </div>
                  <span className="text-xs text-gray-600 font-medium">
                    {reviews.length > 0 ? reviews.length : product.reviewCount} Customer Rating{(reviews.length > 1 || (product.reviewCount && product.reviewCount > 1)) ? 's' : ''} • 100% Verified
                  </span>
                </>
              ) : (
                <span className="text-xs text-amber-900 bg-amber-50/90 border border-amber-200/90 px-3 py-1 rounded-lg font-semibold shadow-2xs flex items-center gap-1.5">
                  <span className="text-amber-600">★</span> Authentic Direct from Loom Master Weavers
                </span>
              )}
            </div>
          </div>

          {/* Luxury Pricing Box */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-50/60 via-[#FFFDF9] to-rose-50/40 border border-amber-200/80 shadow-2xs space-y-1.5">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-2xl sm:text-3xl font-serif font-black text-[#4A0E17] tracking-tight">
                ₹{product.price.toLocaleString()}
              </span>
              {product.discountPercent && product.discountPercent > 0 && product.originalPrice && product.originalPrice > product.price ? (
                <span className="text-xs font-black text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                  {product.discountPercent}% OFF
                </span>
              ) : null}
              {hasFallPico && (
                <span className="text-[11px] font-black text-[#8B2635] bg-rose-100/90 px-3 py-0.5 rounded-full border border-rose-300 inline-flex items-center gap-1 shadow-2xs">
                  <span>🎁 Free Fall & Pico Included</span>
                </span>
              )}
            </div>
            {product.originalPrice && product.originalPrice > product.price ? (
              <div className="text-xs text-gray-500 font-medium flex items-center gap-2">
                <span>MRP <span className="line-through font-sans">₹{product.originalPrice.toLocaleString()}</span></span>
                <span className="text-emerald-700 font-bold">• Free All-India Express Shipping</span>
                <span className="text-[11px] text-gray-400">(Inclusive of all taxes)</span>
              </div>
            ) : (
              <div className="text-xs text-emerald-800 font-bold flex items-center gap-2">
                <span>✓ Free All-India Express Delivery</span>
                <span className="text-[11px] text-gray-400 font-normal">(Inclusive of all taxes)</span>
              </div>
            )}
          </div>

          {/* Stock Scarcity Indicator Bar (Matching Reference - Visible ONLY when stock is specified and > 0) */}
          {!product.isOutOfStock && product.stock !== undefined && product.stock !== null && product.stock > 0 && (
            <div className="py-2.5 px-3.5 bg-amber-50/70 border border-amber-200/90 rounded-xl space-y-1.5 shadow-2xs">
              <p className="text-xs text-gray-900 font-medium">
                Only <span className="font-extrabold text-gray-950">{product.stock} {product.stock === 1 ? 'item is' : 'items are'} in stock!</span>
              </p>
              <div className="w-full bg-gray-200/80 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(100, Math.max(12, (product.stock / 10) * 100))}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Fall and Pico Bidding Luxury Box */}
          <div className={`relative overflow-hidden rounded-2xl transition-all duration-300 border ${
            hasFallPico
              ? 'bg-gradient-to-br from-[#FFFDF9] via-[#FAF6F0] to-[#FFF5F5] border-amber-300/90 shadow-sm'
              : 'bg-[#FAF7F2] border-amber-200/70 hover:border-amber-300'
          } p-3.5 sm:p-4 font-sans`}>
            {/* Header with complimentary free tag */}
            <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-amber-200/60">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors shadow-2xs ${
                  hasFallPico ? 'bg-[#8B2635] text-amber-100' : 'bg-amber-100 text-amber-900'
                }`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-gray-900 leading-tight">
                    Fall & Pico Binding
                  </h4>
                  <p className="text-[10px] text-gray-500 font-medium">
                    Tailored ready-to-wear saree finishing
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[11px] text-gray-400 line-through font-semibold">₹200</span>
                <span className="text-[10px] sm:text-[11px] font-black text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                  FREE 🎁
                </span>
              </div>
            </div>

            {/* Checkbox Card Option */}
            <label
              className={`flex items-start gap-3 p-2.5 sm:p-3 rounded-xl cursor-pointer select-none transition-all ${
                hasFallPico
                  ? 'bg-white border-2 border-[#8B2635]/80 shadow-xs ring-2 ring-[#8B2635]/10'
                  : 'bg-white/80 hover:bg-white border border-dashed border-gray-300 hover:border-amber-400'
              }`}
            >
              <div className="pt-0.5">
                <input
                  type="checkbox"
                  checked={hasFallPico}
                  onChange={(e) => setHasFallPico(e.target.checked)}
                  className="w-4 h-4 text-[#8B2635] rounded border-gray-300 focus:ring-[#8B2635] cursor-pointer accent-[#8B2635]"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-bold text-gray-900">
                    Add Complimentary Fall & Pico (₹0 FREE)
                  </span>
                  {hasFallPico && (
                    <span className="text-[10px] font-extrabold text-[#8B2635] bg-rose-50 px-1.5 py-0.5 border border-rose-200 rounded">
                      Selected
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                  Includes matching premium cotton fall stitching and precision border pico finishing.
                </p>
              </div>
            </label>

            {/* Conditional Return Notice Box */}
            <div className="mt-2.5">
              {hasFallPico ? (
                <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-950 transition-all shadow-2xs">
                  <span className="text-base shrink-0 leading-none mt-0.5">⚠️</span>
                  <div className="text-[11px] sm:text-xs leading-relaxed">
                    <span className="font-extrabold text-[#8B2635] uppercase tracking-wider block sm:inline mr-1">No Return / No Exchange:</span>
                    <span className="font-medium text-gray-800">Returns or exchanges cannot be accepted after Pico and Fall work is completed on this customized saree.</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-gray-600 text-[11px] font-medium bg-gray-50/80 rounded-lg border border-gray-200/60">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Delivered in pure handloom raw condition. Standard 7-day return policy applies.</span>
                </div>
              )}
            </div>
          </div>

          {/* Nykaa Fashion-Style Color Selector Swatches */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                <span>SELECT COLOR:</span>
                <span className="text-amber-950 font-serif font-extrabold capitalize text-xs bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{product.color}</span>
              </h3>
              {colorVariants.length > 1 && (
                <span className="text-[11px] text-gray-500 font-semibold">
                  {colorVariants.length} Color Options
                </span>
              )}
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
              {colorVariants.length > 0 ? (
                colorVariants.map((variant) => {
                  const varImgs = JSON.parse(variant.images || '[]');
                  const varImg = varImgs[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c';
                  const isCurrent = variant.id === product.id;

                  return (
                    <button
                      key={variant.id}
                      onClick={() => router.push(`/products/${variant.slug}`)}
                      className={`group relative flex flex-col items-center shrink-0 w-20 rounded-xl overflow-hidden border-2 transition-all p-1 bg-white cursor-pointer ${
                        isCurrent
                          ? 'border-gray-900 ring-2 ring-gray-900/20 shadow-md scale-102'
                          : 'border-gray-200 hover:border-gray-500 opacity-85 hover:opacity-100'
                      }`}
                      title={`${variant.title} - ${variant.color}`}
                    >
                      <div className="w-full h-24 rounded-lg overflow-hidden bg-slate-100 relative">
                        <img src={varImg} alt={variant.color} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        {isCurrent && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-gray-900 rounded-full flex items-center justify-center shadow-md">
                            <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-gray-900 truncate max-w-full mt-1.5 font-sans">
                        {variant.color}
                      </span>
                      <span className="text-[9px] font-extrabold text-amber-950">
                        ₹{variant.price.toLocaleString()}
                      </span>
                    </button>
                  );
                })
              ) : (
                parsedImages.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedColorIdx(idx);
                      setSelectedImage(img);
                    }}
                    className={`w-16 h-20 rounded-lg border-2 overflow-hidden relative transition-all ${
                      selectedColorIdx === idx ? 'border-gray-900 ring-2 ring-gray-900' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img src={img} alt="Color Swatch" className="w-full h-full object-cover" />
                    {selectedColorIdx === idx && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-gray-900 rounded-full flex items-center justify-center shadow">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Out of Stock Alert Banner */}
          {Boolean(product.isOutOfStock) && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 font-bold text-xs flex items-center gap-2 shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping shrink-0" />
              <span>🚫 Currently Out of Stock. Contact us on WhatsApp for loom pre-orders!</span>
            </div>
          )}

          {/* Action Buttons: ADD TO BAG, WISHLIST, BUY IT NOW & WHATSAPP WHOLESALE INQUIRY */}
          <div className="space-y-2.5 pt-2">
            {/* Row 1: Add to Bag & Wishlist */}
            <div className="flex gap-3">
              {product.isOutOfStock ? (
                <button
                  disabled
                  className="flex-1 py-3.5 bg-slate-200 text-slate-500 font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-xs cursor-not-allowed flex items-center justify-center gap-2 border border-slate-300"
                >
                  <span>OUT OF STOCK</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    addToCart(product, { hasFallPico, fallPicoPrice: 0 });
                    setIsCartOpen(true);
                  }}
                  className="flex-1 py-3.5 bg-[#E11D48] hover:bg-[#BE123C] text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Bag</span>
                </button>
              )}

              <button
                onClick={() => toggleWishlist(product)}
                className={`px-5 py-3.5 border rounded-lg font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isLiked ? 'border-rose-600 bg-rose-50 text-rose-600' : 'border-gray-300 text-gray-800 hover:border-gray-900 bg-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                <span>Wishlist</span>
              </button>
            </div>

            {/* Row 2: BUY IT NOW Button (Deep Luxury Royal Maroon / Crimson Button) */}
            {!product.isOutOfStock && (
              <button
                onClick={() => {
                  addToCart(product, { hasFallPico, fallPicoPrice: 0 });
                  setIsCartOpen(false);
                  router.push('/checkout');
                }}
                className="w-full py-3.5 bg-[#4A0E17] hover:bg-[#380A11] text-amber-50 font-black text-xs uppercase tracking-widest rounded-lg shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 border border-amber-900/30 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>BUY IT NOW</span>
              </button>
            )}

            {/* Row 3: Direct 1-Click Order on WhatsApp Button */}
            <button
              onClick={handleWhatsAppOrder}
              className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 border border-emerald-600/30 cursor-pointer"
            >
              <WhatsAppIcon className="w-5 h-5 fill-white text-white" />
              <span>Order Directly on WhatsApp</span>
            </button>

            {/* Row 4: Wholesale & Custom Inquiry Link */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={handleWhatsAppInquiry}
                className="text-[11px] font-bold text-gray-600 hover:text-emerald-700 underline transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Looking for Bulk Wholesale or Custom Weaving? Inquire Here</span>
              </button>
            </div>
          </div>

          {/* Delivery Pincode Checker */}
          <div className="p-4 bg-slate-50 border border-gray-200 rounded-xl space-y-2 text-xs">
            <label className="font-extrabold text-gray-900 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-rose-600" />
              <span>Delivery Options</span>
            </label>
            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-rose-600 font-medium"
              />
              <button type="submit" className="bg-gray-900 hover:bg-black text-white font-bold px-4 py-2 rounded-lg transition-colors">
                Check
              </button>
            </form>
            {deliveryMsg && (
              <p className={`text-[11px] font-semibold ${deliveryMsg.startsWith('✓') ? 'text-emerald-700' : 'text-rose-600'}`}>
                {deliveryMsg}
              </p>
            )}
          </div>

          {/* Reoti Handloom Royal Craftsmanship & Trust Badges */}
          <div className="pt-6 border-t border-amber-200/80 space-y-4 text-xs font-sans">
            
            {/* Top 4 3D Luxury Royal Handloom Animated Emblems Showcase */}
            <div className="relative rounded-2xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF6F0] to-[#FDF8F2] p-4 sm:p-5 border border-amber-200/80 shadow-xs overflow-hidden">
              
              {/* Subtle Luxury Ambient Glows */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-amber-600/10 rounded-full blur-xl pointer-events-none" />

              {/* Luxury Royal Header Bar */}
              <div className="flex items-center justify-between gap-2 mb-4 pb-2.5 border-b border-amber-200/70">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#8B2635] text-amber-200 flex items-center justify-center text-[10px] shadow-2xs font-serif font-bold">
                    ★
                  </div>
                  <h4 className="font-serif font-extrabold text-xs sm:text-sm text-[#4A0E17] uppercase tracking-wider">
                    {isSemiProduct(product) ? 'Premium Semi Maheshwari' : 'Authentic Maheshwari Heritage'}
                  </h4>
                </div>
                <span className="text-[10px] font-black text-amber-900 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-300 shrink-0 uppercase tracking-wider shadow-2xs">
                  {isSemiProduct(product) ? 'Affordable Luxury • Maheshwar' : 'Est. 1960 • Maheshwar'}
                </span>
              </div>

              {/* Embedded CSS for guaranteed cross-browser floating wave & elegant metallic sheen line */}
              <style>{`
                @keyframes royalFloat {
                  0%, 100% {
                    transform: translateY(0px) rotate(0deg);
                  }
                  50% {
                    transform: translateY(-6px) rotate(0.8deg);
                  }
                }
                @keyframes royalShimmer {
                  0% {
                    transform: translateX(-150%) translateY(-150%) rotate(45deg);
                    opacity: 0;
                  }
                  20% {
                    opacity: 0.55;
                  }
                  40% {
                    transform: translateX(150%) translateY(150%) rotate(45deg);
                    opacity: 0;
                  }
                  100% {
                    transform: translateX(150%) translateY(150%) rotate(45deg);
                    opacity: 0;
                  }
                }
                @keyframes royalAura {
                  0%, 100% {
                    transform: scale(0.95);
                    opacity: 0.25;
                  }
                  50% {
                    transform: scale(1.08);
                    opacity: 0.6;
                  }
                }
                .animate-royal-float-1 { animation: royalFloat 3.6s ease-in-out infinite 0s !important; }
                .animate-royal-float-2 { animation: royalFloat 3.6s ease-in-out infinite 0.9s !important; }
                .animate-royal-float-3 { animation: royalFloat 3.6s ease-in-out infinite 1.8s !important; }
                .animate-royal-float-4 { animation: royalFloat 3.6s ease-in-out infinite 2.7s !important; }
                .animate-royal-shimmer-1 { animation: royalShimmer 4s ease-in-out infinite 0.2s !important; }
                .animate-royal-shimmer-2 { animation: royalShimmer 4s ease-in-out infinite 1.2s !important; }
                .animate-royal-shimmer-3 { animation: royalShimmer 4s ease-in-out infinite 2.2s !important; }
                .animate-royal-shimmer-4 { animation: royalShimmer 4s ease-in-out infinite 3.2s !important; }
                .animate-royal-aura { animation: royalAura 3s ease-in-out infinite !important; }
              `}</style>

              {/* 4 Seamless Animated Badges Row (Directly on Warm Ivory Background without Boxes) */}
              <div className="grid grid-cols-4 gap-1.5 sm:gap-4 text-center items-start pt-2">
                
                {/* Badge 1 */}
                <div className="group flex flex-col items-center justify-start cursor-default">
                  <div className="relative w-14 h-14 sm:w-20 sm:h-20 shrink-0 animate-royal-float-1 group-hover:scale-110 transition-transform duration-300">
                    <div className="absolute -inset-1 bg-amber-400/25 rounded-full filter blur-xs animate-royal-aura pointer-events-none" />
                    <div className="relative w-full h-full overflow-hidden rounded-full drop-shadow-md group-hover:drop-shadow-xl transition-all">
                      {isSemiProduct(product) ? <SemiSilkBadge /> : <RoyalHandwovenBadge />}
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-transparent pointer-events-none animate-royal-shimmer-1" />
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-2.5 space-y-0.5 sm:space-y-1">
                    <h5 className="font-serif font-extrabold text-[10px] sm:text-xs text-gray-950 leading-tight group-hover:text-[#8B2635] transition-colors">
                      {isSemiProduct(product) ? (
                        <>Premium Semi Silk<br /> Rich Blend</>
                      ) : (
                        <>100% Pitloom<br /> Handwoven</>
                      )}
                    </h5>
                    <p className="text-[9px] sm:text-[10px] text-amber-900/80 font-medium leading-tight">
                      {isSemiProduct(product) ? 'Soft & Featherlight' : 'Maheshwar Craft'}
                    </p>
                  </div>
                </div>

                {/* Badge 2 */}
                <div className="group flex flex-col items-center justify-start cursor-default">
                  <div className="relative w-14 h-14 sm:w-20 sm:h-20 shrink-0 animate-royal-float-2 group-hover:scale-110 transition-transform duration-300">
                    <div className="absolute -inset-1 bg-amber-400/25 rounded-full filter blur-xs animate-royal-aura pointer-events-none" />
                    <div className="relative w-full h-full overflow-hidden rounded-full drop-shadow-md group-hover:drop-shadow-xl transition-all">
                      {isSemiProduct(product) ? <SemiZariBadge /> : <RoyalSilkZariBadge />}
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-transparent pointer-events-none animate-royal-shimmer-2" />
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-2.5 space-y-0.5 sm:space-y-1">
                    <h5 className="font-serif font-extrabold text-[10px] sm:text-xs text-gray-950 leading-tight group-hover:text-[#8B2635] transition-colors">
                      {isSemiProduct(product) ? (
                        <>Royal Zari Border<br /> & Rich Pallu</>
                      ) : (
                        <>Pure Silk Cotton<br /> & Real Zari</>
                      )}
                    </h5>
                    <p className="text-[9px] sm:text-[10px] text-amber-900/80 font-medium leading-tight">
                      {isSemiProduct(product) ? 'Lustrous Gold Finish' : 'Metallic Zari Sheen'}
                    </p>
                  </div>
                </div>

                {/* Badge 3 */}
                <div className="group flex flex-col items-center justify-start cursor-default">
                  <div className="relative w-14 h-14 sm:w-20 sm:h-20 shrink-0 animate-royal-float-3 group-hover:scale-110 transition-transform duration-300">
                    <div className="absolute -inset-1 bg-emerald-400/25 rounded-full filter blur-xs animate-royal-aura pointer-events-none" />
                    <div className="relative w-full h-full overflow-hidden rounded-full drop-shadow-md group-hover:drop-shadow-xl transition-all">
                      {isSemiProduct(product) ? <SemiEasyCareBadge /> : <RoyalSustainableBadge />}
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-transparent pointer-events-none animate-royal-shimmer-3" />
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-2.5 space-y-0.5 sm:space-y-1">
                    <h5 className="font-serif font-extrabold text-[10px] sm:text-xs text-gray-950 leading-tight group-hover:text-emerald-900 transition-colors">
                      {isSemiProduct(product) ? (
                        <>Easy Care &<br /> Wrinkle-Free</>
                      ) : (
                        <>100% Sustainable<br /> Natural Dyes</>
                      )}
                    </h5>
                    <p className="text-[9px] sm:text-[10px] text-emerald-800 font-medium leading-tight">
                      {isSemiProduct(product) ? 'All-Day Comfortable' : 'Skin-Friendly Colors'}
                    </p>
                  </div>
                </div>

                {/* Badge 4 */}
                <div className="group flex flex-col items-center justify-start cursor-default">
                  <div className="relative w-14 h-14 sm:w-20 sm:h-20 shrink-0 animate-royal-float-4 group-hover:scale-110 transition-transform duration-300">
                    <div className="absolute -inset-1 bg-amber-400/25 rounded-full filter blur-xs animate-royal-aura pointer-events-none" />
                    <div className="relative w-full h-full overflow-hidden rounded-full drop-shadow-md group-hover:drop-shadow-xl transition-all">
                      {isSemiProduct(product) ? <SemiHubBadge /> : <RoyalWeaversBadge />}
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-transparent pointer-events-none animate-royal-shimmer-4" />
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-2.5 space-y-0.5 sm:space-y-1">
                    <h5 className="font-serif font-extrabold text-[10px] sm:text-xs text-gray-950 leading-tight group-hover:text-[#8B2635] transition-colors">
                      {isSemiProduct(product) ? (
                        <>Direct from<br /> Maheshwar Hub</>
                      ) : (
                        <>Direct from<br /> Master Weavers</>
                      )}
                    </h5>
                    <p className="text-[9px] sm:text-[10px] text-amber-900/80 font-medium leading-tight">
                      {isSemiProduct(product) ? 'Estd. 1960 • Best Value' : 'Estd. 1960 • Zero Markup'}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Simple & Attractive Luxury Product Information Accordions */}
            <div className="space-y-3 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6F0] to-[#FDFBF7] p-4 sm:p-5 rounded-2xl border border-amber-200/90 shadow-sm font-sans">
              
              {/* Accordion 1: Wash & Care */}
              <div className="border-b border-amber-900/10 pb-3.5 pt-1">
                <button
                  type="button"
                  onClick={() => toggleSection('wash')}
                  className="w-full flex items-center justify-between font-serif font-bold text-sm sm:text-base text-gray-900 hover:text-[#8B2635] transition-colors py-1.5 text-left cursor-pointer group"
                >
                  <span className="flex items-center gap-3">
                    <AccordionWashEmblem />
                    <span className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                      <span className="tracking-wide text-gray-950 font-serif font-bold text-sm sm:text-base group-hover:text-[#8B2635] transition-colors">
                        Wash & Care
                      </span>
                      <span className="text-[10px] font-sans font-semibold text-amber-800/80 uppercase tracking-wider">
                        • Gentle Care Guide
                      </span>
                    </span>
                  </span>
                  <div className={`w-6 h-6 rounded-full border border-amber-200 flex items-center justify-center transition-all ${
                    openSections.wash ? 'bg-[#8B2635] text-amber-100' : 'bg-amber-100/70 text-amber-950 group-hover:bg-amber-200'
                  }`}>
                    {openSections.wash ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>
                {openSections.wash && (
                  <div className="mt-3 pl-11 sm:pl-12 text-xs sm:text-sm text-gray-800 leading-relaxed space-y-2.5 animate-fadeIn">
                    <div className="p-3.5 bg-white/95 rounded-xl border border-amber-200/80 shadow-2xs space-y-2">
                      <div className="flex items-center gap-2 text-amber-950 font-serif font-bold text-xs sm:text-sm">
                        <span className="w-2 h-2 rounded-full bg-amber-600" />
                        <span>Recommended Washing Method</span>
                      </div>
                      <div className="space-y-1.5 text-xs text-gray-700 pl-4">
                        <p className="flex items-start gap-1.5">
                          <span className="text-amber-700 font-bold">✦</span>
                          <span><strong className="text-gray-950 font-extrabold">Dry Wash Recommended:</strong> Ideal to preserve the natural silk luster and delicate zari shine over time.</span>
                        </p>
                        <p className="flex items-start gap-1.5">
                          <span className="text-amber-700 font-bold">✦</span>
                          <span><strong className="text-gray-950 font-extrabold">Gentle Hand Wash Only:</strong> If washing at home, use cold water and mild liquid detergent. Never machine wash or soak for long durations.</span>
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-gradient-to-r from-amber-50/90 to-rose-50/50 rounded-xl border border-amber-200/70 text-[11px] sm:text-xs text-amber-950 flex items-start gap-2.5 shadow-2xs">
                      <span className="text-amber-800 text-sm shrink-0">☀️</span>
                      <p className="italic leading-relaxed">
                        <strong className="not-italic font-bold text-gray-900 mr-1">Daylight Photography Disclaimer:</strong>
                        All pictures are captured under natural ambient daylight. Minor shade variation may occasionally occur depending on your mobile or screen display brightness.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: Shipping Information */}
              <div className="border-b border-amber-900/10 py-3">
                <button
                  type="button"
                  onClick={() => toggleSection('shipping')}
                  className="w-full flex items-center justify-between font-serif font-bold text-sm sm:text-base text-gray-900 hover:text-[#8B2635] transition-colors py-1.5 text-left cursor-pointer group"
                >
                  <span className="flex items-center gap-3">
                    <AccordionShippingEmblem />
                    <span className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                      <span className="tracking-wide text-gray-950 font-serif font-bold text-sm sm:text-base group-hover:text-[#8B2635] transition-colors">
                        Shipping Information
                      </span>
                      <span className="text-[10px] font-sans font-semibold text-emerald-800 uppercase tracking-wider">
                        • Free Express 4-5 Days
                      </span>
                    </span>
                  </span>
                  <div className={`w-6 h-6 rounded-full border border-amber-200 flex items-center justify-center transition-all ${
                    openSections.shipping ? 'bg-[#8B2635] text-amber-100' : 'bg-amber-100/70 text-amber-950 group-hover:bg-amber-200'
                  }`}>
                    {openSections.shipping ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>
                {openSections.shipping && (
                  <div className="mt-3 pl-11 sm:pl-12 text-xs sm:text-sm text-gray-800 leading-relaxed space-y-3 animate-fadeIn">
                    <div className="p-3.5 bg-white/95 rounded-xl border border-amber-200/80 shadow-2xs space-y-2">
                      <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs sm:text-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        <span>100% Free Express Delivery Across India</span>
                      </div>
                      <div className="space-y-1.5 text-xs text-gray-700 pl-4">
                        <p className="flex items-start gap-1.5">
                          <span className="text-emerald-700 font-bold">✓</span>
                          <span><strong className="text-gray-950 font-extrabold">Delivery Timeline:</strong> Delivered directly to your doorstep within <strong>4 to 5 working days</strong>.</span>
                        </p>
                        <p className="flex items-start gap-1.5">
                          <span className="text-emerald-700 font-bold">✓</span>
                          <span><strong className="text-gray-950 font-extrabold">Dispatch & Tracking:</strong> Hand-packed and dispatched from Maheshwar with end-to-end SMS & WhatsApp tracking updates.</span>
                        </p>
                        <p className="flex items-start gap-1.5">
                          <span className="text-emerald-700 font-bold">✓</span>
                          <span><strong className="text-gray-950 font-extrabold">International Shipping:</strong> Worldwide express shipping available. Please connect with our team on WhatsApp for rates.</span>
                        </p>
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => router.push('/policies/shipping-policy')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FAF3E8] hover:bg-amber-100 text-amber-950 font-bold text-[11px] sm:text-xs uppercase tracking-wider rounded-lg border border-amber-300 cursor-pointer transition-colors shadow-2xs"
                      >
                        <span>View Shipping Policy</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 3: Returns & Exchange */}
              <div className="border-b border-amber-900/10 py-3">
                <button
                  type="button"
                  onClick={() => toggleSection('returns')}
                  className="w-full flex items-center justify-between font-serif font-bold text-sm sm:text-base text-gray-900 hover:text-[#8B2635] transition-colors py-1.5 text-left cursor-pointer group"
                >
                  <span className="flex items-center gap-3">
                    <AccordionReturnsEmblem />
                    <span className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                      <span className="tracking-wide text-gray-950 font-serif font-bold text-sm sm:text-base group-hover:text-[#8B2635] transition-colors">
                        Returns & Exchange
                      </span>
                      <span className="text-[10px] font-sans font-semibold text-amber-800/80 uppercase tracking-wider">
                        • 7-Day Hassle-Free
                      </span>
                    </span>
                  </span>
                  <div className={`w-6 h-6 rounded-full border border-amber-200 flex items-center justify-center transition-all ${
                    openSections.returns ? 'bg-[#8B2635] text-amber-100' : 'bg-amber-100/70 text-amber-950 group-hover:bg-amber-200'
                  }`}>
                    {openSections.returns ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>
                {openSections.returns && (
                  <div className="mt-3 pl-11 sm:pl-12 text-xs sm:text-sm text-gray-800 leading-relaxed space-y-3 animate-fadeIn">
                    <div className="p-3.5 bg-white/95 rounded-xl border border-amber-200/80 shadow-2xs space-y-2.5">
                      <div className="flex items-center gap-2 text-gray-950 font-serif font-bold text-xs sm:text-sm">
                        <span className="w-2 h-2 rounded-full bg-amber-600" />
                        <span>7 Days Return & Exchange Policy</span>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed pl-4">
                        We offer a simple and hassle-free return or exchange process within <strong>7 days of delivery</strong> for all standard handloom sarees in their original unworn condition.
                      </p>

                      <div className="text-[11px] sm:text-xs text-rose-950 bg-rose-50/90 p-3 rounded-xl border border-rose-200/90 leading-relaxed">
                        <strong className="text-rose-900 block mb-0.5">⚠️ Customization Policy Notice:</strong>
                        Sarees customized with complimentary Fall & Pico binding upon customer request are custom-tailored and cannot be returned or exchanged once finishing is completed.
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => router.push('/policies/return-policy')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FAF3E8] hover:bg-amber-100 text-amber-950 font-bold text-[11px] sm:text-xs uppercase tracking-wider rounded-lg border border-amber-300 cursor-pointer transition-colors shadow-2xs"
                      >
                        <span>View Returns Policy</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 4: Iron Instruction */}
              <div className="border-b border-amber-900/10 py-3">
                <button
                  type="button"
                  onClick={() => toggleSection('iron')}
                  className="w-full flex items-center justify-between font-serif font-bold text-sm sm:text-base text-gray-900 hover:text-[#8B2635] transition-colors py-1.5 text-left cursor-pointer group"
                >
                  <span className="flex items-center gap-3">
                    <AccordionIronEmblem />
                    <span className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                      <span className="tracking-wide text-gray-950 font-serif font-bold text-sm sm:text-base group-hover:text-[#8B2635] transition-colors">
                        Iron Instruction
                      </span>
                      <span className="text-[10px] font-sans font-semibold text-amber-800/80 uppercase tracking-wider">
                        • Low Heat with Cloth
                      </span>
                    </span>
                  </span>
                  <div className={`w-6 h-6 rounded-full border border-amber-200 flex items-center justify-center transition-all ${
                    openSections.iron ? 'bg-[#8B2635] text-amber-100' : 'bg-amber-100/70 text-amber-950 group-hover:bg-amber-200'
                  }`}>
                    {openSections.iron ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>
                {openSections.iron && (
                  <div className="mt-3 pl-11 sm:pl-12 text-xs sm:text-sm text-gray-800 leading-relaxed animate-fadeIn">
                    <div className="p-3.5 bg-white/95 rounded-xl border border-amber-200/80 shadow-2xs space-y-2">
                      <div className="flex items-center gap-2 text-amber-950 font-serif font-bold text-xs sm:text-sm">
                        <span className="text-base leading-none">♨️</span>
                        <span>Pressing & Ironing Guidelines</span>
                      </div>
                      <div className="space-y-1.5 text-xs text-gray-700 pl-4">
                        <p className="flex items-start gap-1.5">
                          <span className="text-amber-700 font-bold">✦</span>
                          <span><strong className="text-gray-950 font-extrabold">Low Temperature:</strong> Always iron on low to medium heat (Silk setting).</span>
                        </p>
                        <p className="flex items-start gap-1.5">
                          <span className="text-amber-700 font-bold">✦</span>
                          <span><strong className="text-gray-950 font-extrabold">Protective Cloth Layer:</strong> Keep a thin cotton cloth or muslin over the garment/zari border while ironing to protect the delicate handloom weave.</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 5: Product Details */}
              <div className="border-b border-amber-900/10 py-3">
                <button
                  type="button"
                  onClick={() => toggleSection('details')}
                  className="w-full flex items-center justify-between font-serif font-bold text-sm sm:text-base text-gray-900 hover:text-[#8B2635] transition-colors py-1.5 text-left cursor-pointer group"
                >
                  <span className="flex items-center gap-3">
                    <AccordionDetailsEmblem />
                    <span className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                      <span className="tracking-wide text-gray-950 font-serif font-bold text-sm sm:text-base group-hover:text-[#8B2635] transition-colors">
                        Product Details
                      </span>
                      <span className="text-[10px] font-sans font-semibold text-amber-800/80 uppercase tracking-wider">
                        • Complete Specifications
                      </span>
                    </span>
                  </span>
                  <div className={`w-6 h-6 rounded-full border border-amber-200 flex items-center justify-center transition-all ${
                    openSections.details ? 'bg-[#8B2635] text-amber-100' : 'bg-amber-100/70 text-amber-950 group-hover:bg-amber-200'
                  }`}>
                    {openSections.details ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>
                {openSections.details && (
                  <div className="mt-3 pl-11 sm:pl-12 space-y-3.5 text-xs sm:text-sm text-gray-800 leading-relaxed animate-fadeIn">
                    {/* Luxury Introduction Quote Card */}
                    <div className="p-3 bg-gradient-to-r from-amber-50/80 to-[#FFFDF9] rounded-xl border border-amber-200/70 shadow-2xs">
                      <p className="font-serif italic text-amber-950 font-medium leading-relaxed">
                        “ This {product.title} is an authentic traditional handwoven masterpiece created for connoisseurs of timeless Indian textile heritage. ”
                      </p>
                    </div>

                    {/* High-End Two-Column Specification Grid with Animated Mini-Emblems */}
                    <div className="bg-white/95 rounded-xl border border-amber-200/80 overflow-hidden shadow-2xs divide-y divide-amber-100">
                      
                      {/* 1. Saree Color */}
                      <div className="flex items-center px-3.5 py-2.5 hover:bg-amber-50/40 transition-colors group/row">
                        <span className="font-bold text-gray-950 w-40 sm:w-48 shrink-0 flex items-center gap-2.5">
                          <SpecColorIcon />
                          <span className="text-xs sm:text-sm font-bold text-gray-950">Saree Color:</span>
                        </span>
                        <span className="text-gray-800 font-medium text-xs sm:text-sm">{product.color || 'As Shown'}</span>
                      </div>

                      {/* 2. Blouse Color */}
                      <div className="flex items-center px-3.5 py-2.5 hover:bg-amber-50/40 transition-colors group/row">
                        <span className="font-bold text-gray-950 w-40 sm:w-48 shrink-0 flex items-center gap-2.5">
                          <SpecBlouseIcon />
                          <span className="text-xs sm:text-sm font-bold text-gray-950">Blouse Color:</span>
                        </span>
                        <span className="text-gray-800 font-medium text-xs sm:text-sm">{product.blouseColor || 'Running Blouse (Matching Saree Color)'}</span>
                      </div>

                      {/* 3. Fabric & Weave */}
                      <div className="flex items-center px-3.5 py-2.5 hover:bg-amber-50/40 transition-colors group/row">
                        <span className="font-bold text-gray-950 w-40 sm:w-48 shrink-0 flex items-center gap-2.5">
                          <SpecFabricIcon />
                          <span className="text-xs sm:text-sm font-bold text-gray-950">Fabric & Weave:</span>
                        </span>
                        <span className="text-gray-800 font-medium text-xs sm:text-sm">{product.fabric || 'Silk Cotton'} (Authentic Handwoven)</span>
                      </div>

                      {/* 4. Border Type */}
                      <div className="flex items-center px-3.5 py-2.5 hover:bg-amber-50/40 transition-colors group/row">
                        <span className="font-bold text-gray-950 w-40 sm:w-48 shrink-0 flex items-center gap-2.5">
                          <SpecBorderIcon />
                          <span className="text-xs sm:text-sm font-bold text-gray-950">Border Type:</span>
                        </span>
                        <span className="text-gray-800 font-medium text-xs sm:text-sm">{product.borderType || 'Gold Zari'}</span>
                      </div>

                      {/* 5. Craftsmanship */}
                      <div className="flex items-center px-3.5 py-2.5 hover:bg-amber-50/40 transition-colors group/row">
                        <span className="font-bold text-gray-950 w-40 sm:w-48 shrink-0 flex items-center gap-2.5">
                          <SpecCraftIcon />
                          <span className="text-xs sm:text-sm font-bold text-gray-950">Craftsmanship:</span>
                        </span>
                        <span className="text-gray-800 font-medium text-xs sm:text-sm">Authentic handwoven pitloom craftsmanship</span>
                      </div>

                      {/* 6. Sustainability */}
                      <div className="flex items-center px-3.5 py-2.5 hover:bg-amber-50/40 transition-colors group/row">
                        <span className="font-bold text-gray-950 w-40 sm:w-48 shrink-0 flex items-center gap-2.5">
                          <SpecEcoIcon />
                          <span className="text-xs sm:text-sm font-bold text-gray-950">Sustainability:</span>
                        </span>
                        <span className="text-gray-800 font-medium text-xs sm:text-sm">Eco-friendly; woven with natural threads & safe dyes</span>
                      </div>

                      {/* 7. Texture & Drape */}
                      <div className="flex items-center px-3.5 py-2.5 hover:bg-amber-50/40 transition-colors group/row">
                        <span className="font-bold text-gray-950 w-40 sm:w-48 shrink-0 flex items-center gap-2.5">
                          <SpecDrapeIcon />
                          <span className="text-xs sm:text-sm font-bold text-gray-950">Texture & Drape:</span>
                        </span>
                        <span className="text-gray-800 font-medium text-xs sm:text-sm">Soft in feel with featherlight, graceful drape</span>
                      </div>

                      {/* 8. Care */}
                      <div className="flex items-center px-3.5 py-2.5 hover:bg-amber-50/40 transition-colors group/row">
                        <span className="font-bold text-gray-950 w-40 sm:w-48 shrink-0 flex items-center gap-2.5">
                          <SpecCareIcon />
                          <span className="text-xs sm:text-sm font-bold text-gray-950">Care:</span>
                        </span>
                        <span className="text-gray-800 font-medium text-xs sm:text-sm">Dry clean recommended</span>
                      </div>

                      {/* 9. Total Length */}
                      <div className="flex items-center px-3.5 py-2.5 hover:bg-amber-50/40 transition-colors group/row">
                        <span className="font-bold text-gray-950 w-40 sm:w-48 shrink-0 flex items-center gap-2.5">
                          <SpecLengthIcon />
                          <span className="text-xs sm:text-sm font-bold text-gray-950">Total Length:</span>
                        </span>
                        <span className="text-gray-800 font-medium text-xs sm:text-sm">{product.lengthWithBlouse || '6.3 Meters (With 0.8m Blouse Piece)'}</span>
                      </div>

                      {/* 10. Loom Origin */}
                      <div className="flex items-center px-3.5 py-2.5 hover:bg-amber-50/40 transition-colors group/row">
                        <span className="font-bold text-gray-950 w-40 sm:w-48 shrink-0 flex items-center gap-2.5">
                          <SpecOriginIcon />
                          <span className="text-xs sm:text-sm font-bold text-gray-950">Loom Origin:</span>
                        </span>
                        <span className="text-gray-800 font-medium text-xs sm:text-sm">Maheshwar, Madhya Pradesh (Estd. 1960)</span>
                      </div>
                    </div>

                    {product.description && (
                      <div className="p-3.5 bg-white/95 rounded-xl border border-amber-200/80 text-gray-700 font-medium whitespace-pre-line leading-relaxed text-xs sm:text-sm shadow-2xs">
                        {product.description}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Accordion 6: Frequently Asked Questions */}
              <div className="border-b border-amber-900/10 py-3">
                <button
                  type="button"
                  onClick={() => toggleSection('faqs')}
                  className="w-full flex items-center justify-between font-serif font-bold text-sm sm:text-base text-gray-900 hover:text-[#8B2635] transition-colors py-1.5 text-left cursor-pointer group"
                >
                  <span className="flex items-center gap-3">
                    <AccordionFaqEmblem />
                    <span className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                      <span className="tracking-wide text-gray-950 font-serif font-bold text-sm sm:text-base group-hover:text-[#8B2635] transition-colors">
                        Frequently Asked Questions
                      </span>
                      <span className="text-[10px] font-sans font-semibold text-amber-800/80 uppercase tracking-wider">
                        • Verified Answers
                      </span>
                    </span>
                  </span>
                  <div className={`w-6 h-6 rounded-full border border-amber-200 flex items-center justify-center transition-all ${
                    openSections.faqs ? 'bg-[#8B2635] text-amber-100' : 'bg-amber-100/70 text-amber-950 group-hover:bg-amber-200'
                  }`}>
                    {openSections.faqs ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>
                {openSections.faqs && (
                  <div className="mt-3 pl-11 sm:pl-12 space-y-2.5 text-xs sm:text-sm text-gray-800 leading-relaxed animate-fadeIn">
                    <div className="p-3 bg-white/95 rounded-xl border border-amber-200/80 space-y-1 shadow-2xs">
                      <p className="font-bold text-amber-950 flex items-center gap-1.5">
                        <span className="text-[#8B2635] font-black">Q:</span> Is this 100% authentic handloom?
                      </p>
                      <p className="text-gray-700 pl-4 text-xs">Yes, authentically handwoven on traditional pit looms by master weavers in Maheshwar, Madhya Pradesh (Estd. 1960).</p>
                    </div>
                    <div className="p-3 bg-white/95 rounded-xl border border-amber-200/80 space-y-1 shadow-2xs">
                      <p className="font-bold text-amber-950 flex items-center gap-1.5">
                        <span className="text-[#8B2635] font-black">Q:</span> Is a blouse piece included?
                      </p>
                      <p className="text-gray-700 pl-4 text-xs">Yes, every saree includes a matching ~80cm unstitched running blouse piece attached.</p>
                    </div>
                    <div className="p-3 bg-white/95 rounded-xl border border-amber-200/80 space-y-1 shadow-2xs">
                      <p className="font-bold text-amber-950 flex items-center gap-1.5">
                        <span className="text-[#8B2635] font-black">Q:</span> What are the shipping charges and timeline?
                      </p>
                      <p className="text-gray-700 pl-4 text-xs">We offer 100% Free Express Delivery across India. Orders are delivered in 4 to 5 working days.</p>
                    </div>
                    <div className="p-3 bg-white/95 rounded-xl border border-amber-200/80 space-y-1 shadow-2xs">
                      <p className="font-bold text-amber-950 flex items-center gap-1.5">
                        <span className="text-[#8B2635] font-black">Q:</span> What is your return & exchange policy?
                      </p>
                      <p className="text-gray-700 pl-4 text-xs">We provide a 7-day hassle-free return and exchange guarantee on standard handloom items. Please note that customized sarees with Fall & Pico binding cannot be returned or exchanged.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 7: Tags & Styles (Explore Matching Handloom Collections) */}
              <div className="pt-2 pb-1">
                <button
                  type="button"
                  onClick={() => toggleSection('tags')}
                  className="w-full flex items-center justify-between font-serif font-bold text-sm sm:text-base text-gray-900 hover:text-[#8B2635] transition-colors py-1.5 text-left cursor-pointer group"
                >
                  <span className="flex items-center gap-3">
                    <AccordionTagsEmblem />
                    <span className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                      <span className="tracking-wide text-gray-950 font-serif font-bold text-sm sm:text-base group-hover:text-[#8B2635] transition-colors">
                        Tags & Styles
                      </span>
                      <span className="text-[10px] font-sans font-semibold text-amber-800/80 uppercase tracking-wider">
                        • Explore Matching Collections
                      </span>
                    </span>
                  </span>
                  <div className={`w-6 h-6 rounded-full border border-amber-200 flex items-center justify-center transition-all ${
                    openSections.tags ? 'bg-[#8B2635] text-amber-100' : 'bg-amber-100/70 text-amber-950 group-hover:bg-amber-200'
                  }`}>
                    {openSections.tags ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>
                {openSections.tags && (
                  <div className="mt-3 pl-11 sm:pl-12 space-y-3.5 text-xs animate-fadeIn">
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Maheshwari Saree',
                        'Pure Maheshwari Silk Saree',
                        'Original Maheshwari Handloom Saree',
                        'Maheshwari Silk Cotton Saree',
                        `${product.color || 'Royal'} Maheshwari Saree`,
                        `${product.fabric || 'Silk Cotton'} Handloom Saree`,
                        'Buy Maheshwari Saree Online',
                        'Maheshwari Saree Maheshwar',
                        'Zari Border Saree',
                        'Authentic Pitloom Handwoven Saree',
                        'Ahilya Bai Holkar Maheshwari Saree',
                        'Handwoven Saree with Blouse Piece',
                        'Direct from Weavers Maheshwar',
                        'Traditional Zari Pallu Saree',
                        'Festive Wear Handloom Saree',
                        'Wedding Maheshwari Saree',
                        'Pure Handloom Sarees India',
                        'Lightweight Silk Cotton Saree',
                        'Soft Draping Pure Saree',
                        'Eco-Friendly Handcrafted Textile',
                        'Best Maheshwari Sarees Online',
                        'Reoti Handloom Estd. 1960',
                        'Wholesale Maheshwari Sarees Manufacturer',
                        'Maheshwar Saree Shop Online',
                      ].map((tag, idx) => (
                        <Link
                          key={idx}
                          href={`/products?q=${encodeURIComponent(tag)}`}
                          title={`Explore ${tag} at Reoti Handloom`}
                          rel="tag"
                          className="bg-white hover:bg-amber-100/90 text-amber-950 hover:text-[#8B2635] px-3 py-1.5 rounded-full font-bold border border-amber-200 hover:border-amber-400 shadow-2xs transition-all hover:scale-103 flex items-center gap-1.5"
                        >
                          <span className="text-amber-600 text-[10px]">✦</span>
                          <span>{tag}</span>
                        </Link>
                      ))}
                    </div>

                    <div className="p-3 bg-gradient-to-r from-amber-50/90 to-[#FFFDF9] rounded-xl border border-amber-200/70 text-[11px] sm:text-xs text-amber-950 flex items-start gap-2.5 shadow-2xs">
                      <span className="text-amber-700 text-sm shrink-0">✨</span>
                      <p className="leading-relaxed">
                        <strong className="text-gray-950 font-bold mr-1">Explore Related Weaves:</strong>
                        Click any style tag above to discover matching handloom sarees, pure silk cotton fabrics, and exclusive Maheshwari royal patterns directly from our looms.
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Customer Ratings & Reviews Section */}
      <section className="mt-16 pt-8 border-t border-gray-200 font-sans">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="w-5 h-5 text-rose-600" />
          <h2 className="text-xl font-serif font-extrabold text-gray-900">
            Customer Ratings & Reviews
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Overall Rating Badge & Review Summary */}
          <div className="lg:col-span-4 bg-amber-50/40 p-6 rounded-2xl border border-amber-200/70 space-y-4 text-center">
            <p className="text-xs font-extrabold uppercase text-amber-900 tracking-wider">
              Overall Product Rating
            </p>
            
            {reviews.length > 0 ? (
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl font-extrabold text-gray-900">
                  {product.rating ? product.rating.toFixed(1) : (reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1)}
                </span>
                <div className="flex flex-col items-start">
                  <div className="flex items-center text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(product.rating || (reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length))
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-500 font-medium mt-0.5">
                    {reviews.length} Verified Customer Review{reviews.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-2 space-y-1">
                <div className="flex items-center justify-center gap-1 text-gray-300">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-gray-300 fill-gray-200" />
                  ))}
                </div>
                <p className="text-xs font-semibold text-amber-950">No customer ratings yet</p>
                <p className="text-[11px] text-gray-500 font-medium">Be the first to rate & review this saree!</p>
              </div>
            )}

            <div className="pt-2 border-t border-amber-200/60 text-xs text-amber-950 font-medium space-y-1">
              <p className="flex items-center justify-center gap-1 text-[11px] text-emerald-800 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Authentic Maheshwari Handloom Craft</span>
              </p>
            </div>
          </div>

          {/* Right Column: Write a Review Form */}
          <div className="lg:col-span-8 bg-white border border-gray-200 p-6 rounded-2xl shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Rate this Saree & Share Your Experience</span>
            </h3>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              {/* Interactive Star Selection */}
              <div>
                <label className="block text-gray-700 font-bold mb-1.5">Select Rating *</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewerRating(star)}
                      className="p-1 hover:scale-115 transition-transform cursor-pointer"
                      title={`Rate ${star} out of 5 stars`}
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          reviewerRating > 0 && star <= reviewerRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300 hover:text-amber-400'
                        }`}
                      />
                    </button>
                  ))}
                  <span className={`ml-2 font-bold text-xs px-2.5 py-1 rounded-md transition-colors ${reviewerRating > 0 ? 'bg-amber-100 text-amber-950 border border-amber-300' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                    {reviewerRating > 0 ? `${reviewerRating} / 5 Stars` : 'Click stars to rate (1-5)'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anjali Sharma"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-rose-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Your Detailed Review *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share details about saree fabric quality, border finish, drape, and overall buying experience..."
                  value={reviewerComment}
                  onChange={(e) => setReviewerComment(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-rose-600 font-medium"
                />
              </div>

              {/* Customer Photo Upload Option */}
              <div className="p-3 bg-slate-50 border border-gray-200 rounded-xl space-y-2">
                <label className="block text-gray-700 font-bold flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-rose-600" />
                    <span>Attach Photo of Received Saree (Optional)</span>
                  </span>
                  {isUploadingReviewImage && <span className="text-rose-600 animate-pulse text-[11px]">Uploading photo...</span>}
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleReviewImageUpload}
                  className="block w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-gray-900 file:text-white hover:file:bg-black cursor-pointer"
                />

                {reviewImage && (
                  <div className="pt-2 flex items-center gap-3">
                    <div className="w-16 h-20 rounded-lg border border-gray-300 overflow-hidden relative shadow-xs bg-white">
                      <img src={reviewImage} alt="Uploaded Customer Photo" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setReviewImage('')}
                        className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Saree photo attached successfully!</span>
                    </div>
                  </div>
                )}
              </div>

              {reviewMsg && (
                <p className={`text-xs font-bold ${reviewMsg.startsWith('✓') ? 'text-emerald-700 bg-emerald-50 p-2.5 rounded' : 'text-rose-600'}`}>
                  {reviewMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-lg uppercase tracking-wider shadow-sm transition-all flex items-center gap-2"
              >
                <span>{isSubmittingReview ? 'Submitting Review...' : 'SUBMIT CUSTOMER REVIEW'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Customer Reviews List */}
        <div className="mt-8 space-y-4">
          <h3 className="font-bold text-sm text-gray-900">
            Recent Customer Reviews ({reviews.length})
          </h3>

          {reviews.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-gray-200 text-xs text-gray-500">
              No customer reviews written yet. Be the first to rate this saree!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((r) => (
                <div key={r.id} className="p-4 border border-gray-200 rounded-xl bg-white space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center justify-center text-xs">
                        {r.userName?.charAt(0).toUpperCase() || 'C'}
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                          <span>{r.userName}</span>
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Verified Buyer</span>
                          </span>
                        </h5>
                        <p className="text-[10px] text-gray-400">
                          {new Date(r.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Star Rating Badge */}
                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-bold text-xs text-amber-900">
                      <span>{r.rating}</span>
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed font-normal bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                    "{r.comment}"
                  </p>

                  {/* Customer Uploaded Photo */}
                  {r.image && (
                    <div className="pt-1">
                      <p className="text-[10px] font-bold text-gray-500 mb-1 flex items-center gap-1">
                        <Camera className="w-3 h-3 text-rose-600" />
                        <span>Customer Photo:</span>
                      </p>
                      <div className="w-20 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-2xs bg-slate-50">
                        <img src={r.image} alt="Customer Received Saree" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Related Sarees Section (Customers Also Liked) */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-8 border-t border-gray-200">
          <div className="text-center mb-8">
            <span className="text-xs font-extrabold tracking-[0.25em] uppercase text-rose-600 block mb-1">
              YOU MAY ALSO LIKE
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-gray-900 tracking-wide">
              Customers Also Liked
            </h2>
            <div className="w-20 h-0.5 bg-rose-600/40 mx-auto mt-2.5 rounded-full" />
          </div>
          <MobileProductSlider products={relatedProducts} />
        </section>
      )}

      {/* Recommended Products Section (Matching Reference Screenshot 2 - Auto Rotating Every 8 Seconds) */}
      {recommendedProducts.length > 0 && (
        <section className="mt-12 mb-24 lg:mb-12 py-10 px-4 sm:px-8 bg-[#FAF7F2] border border-stone-200/80 rounded-3xl shadow-xs relative overflow-hidden">
          <div className="text-center mb-8">
            <span className="text-xs font-extrabold tracking-[0.25em] uppercase text-amber-800 flex items-center justify-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
              <span>CURATED FOR YOU • AUTO ROTATING</span>
            </span>
            <div className="flex items-center justify-center gap-3">
              <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-stone-900 tracking-wide">
                Recommended Products
              </h2>
              <button
                onClick={() => shufflePdpRecommended(allStoreProducts)}
                className="p-2 rounded-full bg-white border border-stone-300 hover:border-amber-700 text-stone-700 hover:text-amber-900 transition-all shadow-xs active:scale-95 cursor-pointer"
                title="Shuffle recommended styles"
              >
                <RefreshCw className={`w-4 h-4 ${isRecRotating ? 'animate-spin text-amber-800' : ''}`} />
              </button>
            </div>
            <div className="w-20 h-0.5 bg-amber-700/40 mx-auto mt-2.5 rounded-full" />
          </div>

          <div className={`transition-opacity duration-300 ${isRecRotating ? 'opacity-40' : 'opacity-100'}`}>
            <MobileProductSlider products={recommendedProducts} />
          </div>
        </section>
      )}



      {/* Full Screen Image Lightbox Zoom Modal (Matching Reference Image) */}
      {isLightboxOpen && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center font-sans p-4 select-none animate-fade-in"
        >
          {/* Close Button Top-Right */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 bg-gray-800/80 hover:bg-black text-white p-3 rounded-md transition-colors cursor-pointer z-50 border border-gray-700 shadow-lg"
            title="Close Zoom View"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Arrow Button */}
          {parsedImages.length > 1 && (
            <button
              onClick={handlePrevImage}
              className="absolute left-4 bg-black/60 hover:bg-black text-white p-4 rounded-md border border-white/20 transition-transform active:scale-95 cursor-pointer z-50 shadow-xl"
              title="Previous Photo"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Lightbox Center Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center relative"
          >
            {activeMediaType === 'video' && product.videoUrl ? (
              /* Big Screen Video Player with Watermark & Loop - Naturally Fitted (0 Empty Black Bars) */
              <div
                className="relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-black select-none max-h-[80vh] shadow-2xl border border-amber-500/40"
                onContextMenu={(e) => e.preventDefault()}
              >
                <video
                  src={product.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  className="max-h-[80vh] max-w-[90vw] sm:max-w-[520px] w-auto h-auto object-contain rounded-2xl block"
                >
                  Your browser does not support video playback.
                </video>
                <WatermarkOverlay variant="lightbox" imageUrl={product.videoUrl} />
              </div>
            ) : (
              /* High-Res Image Zoom with Watermark */
              <div
                className="relative overflow-hidden rounded-lg select-none"
                onContextMenu={(e) => e.preventDefault()}
              >
                <img
                  src={parsedImages[currentImageIdx] || selectedImage}
                  alt={product.title}
                  draggable="false"
                  onContextMenu={(e) => e.preventDefault()}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border border-white/10 select-none pointer-events-none"
                />
                <WatermarkOverlay variant="lightbox" imageUrl={parsedImages[currentImageIdx] || selectedImage} />
              </div>
            )}

            {/* Bottom Caption Bar */}
            <div className="mt-4 flex items-center gap-3 text-white text-xs font-bold bg-gray-900/90 backdrop-blur-md px-5 py-2 rounded-full border border-gray-700 shadow-md">
              <span className="text-amber-400 font-serif font-extrabold">{product.title}</span>
              <span className="text-gray-500">•</span>
              {activeMediaType === 'video' ? (
                <span className="text-amber-300 flex items-center gap-1.5">
                  <Play className="w-3 h-3 fill-current" />
                  <span>Saree Draping Video (Big Screen HD)</span>
                </span>
              ) : (
                <span>{currentImageIdx + 1} of {parsedImages.length || 1}</span>
              )}
            </div>
          </div>

          {/* Right Arrow Button */}
          {parsedImages.length > 1 && (
            <button
              onClick={handleNextImage}
              className="absolute right-4 bg-black/60 hover:bg-black text-white p-4 rounded-md border border-white/20 transition-transform active:scale-95 cursor-pointer z-50 shadow-xl"
              title="Next Photo"
            >
              <ChevronRight className="w-8 h-8 font-extrabold" />
            </button>
          )}
        </div>
      )}

      {/* Full Screen High-Def Video Modal */}
      {isVideoModalOpen && product.videoUrl && (
        <div
          onClick={() => setIsVideoModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in"
        >
          {/* Close Button Top-Right */}
          <button
            onClick={() => setIsVideoModalOpen(false)}
            className="absolute top-4 right-4 bg-neutral-900/80 hover:bg-black text-white p-3 rounded-full transition-colors cursor-pointer z-50 border border-neutral-700 shadow-lg"
            title="Close Video"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-neutral-950 rounded-2xl border border-amber-500/40 overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="p-4 bg-gradient-to-r from-amber-950 to-neutral-950 border-b border-amber-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-extrabold text-sm text-amber-100">{product.title}</h4>
                  <p className="text-[10px] text-amber-400/80">Authentic Saree Draping & Craftsmanship Video</p>
                </div>
              </div>
            </div>

            <div className="relative aspect-video bg-black flex items-center justify-center">
              <video
                src={product.videoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              >
                Your browser does not support video playback.
              </video>
            </div>

            <div className="p-4 bg-neutral-900 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-gray-300 text-[11px]">
                Have questions about this piece? Talk directly with our Maheshwar master weavers.
              </div>
              <button
                type="button"
                onClick={handleDirectWhatsAppShare}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current" />
                <span>Inquire on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Quick-Action Bottom Bar */}
      {!product.isOutOfStock && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-900/10 p-2.5 px-4 shadow-2xl lg:hidden flex items-center justify-between gap-3 font-sans">
          <div className="flex flex-col shrink-0 min-w-0">
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Total Price</span>
            <span className="text-base font-black text-amber-950">
              ₹{product.price.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end">
            <button
              onClick={() => {
                addToCart(product, { hasFallPico, fallPicoPrice: 0 });
                setIsCartOpen(true);
              }}
              className="flex-1 max-w-[130px] py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add Bag</span>
            </button>

            <button
              onClick={handleWhatsAppOrder}
              className="flex-1 max-w-[150px] py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white text-white" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
