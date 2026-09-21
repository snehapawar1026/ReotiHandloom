import { NextResponse } from 'next/server';
import { getStoreData, saveStoreData } from '@/lib/storeManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const LATEST_FESTIVE_BANNERS = [
  {
    id: 'festive-banner-stairs-1',
    title: 'Get Ready For Upcoming Festivals with Royal Maheshwari Weaves',
    subtitle: 'Celebrate Navratri, Karwa Chauth, Dussehra & Diwali in authentic silk-cotton handloom sarees crafted at Maheshwar Fort looms.',
    image: '/uploads/festival_banner_stairs.jpg',
    link: '/products',
    tag: '✨ UPCOMING FESTIVE COLLECTION 2026',
    sortOrder: 1,
    active: true,
  },
  {
    id: 'festive-banner-friends-2',
    title: 'Authentic Handcrafted Sarees for Every Joyous Celebration',
    subtitle: 'Lightweight drapes with gleaming reversible zari borders, woven with pure devotion by traditional master artisans.',
    image: '/uploads/festival_banner_friends.jpg',
    link: '/products?category=silk-cotton-maheshwari',
    tag: '🌸 FESTIVE CELEBRATIONS • DIRECT FROM WEAVERS',
    sortOrder: 2,
    active: true,
  },
  {
    id: 'c2e7af2c-fcad-4545-9354-df7d35c64ba7',
    title: 'Maharani Ahilyabai Holkar Royal Maheshwar Weaves',
    subtitle: 'Crafting authentic Maheshwari Sarees straight from Narmada ghat looms with 5th generation weaver craftsmanship.',
    image: '/uploads/maheshwari_legacy_banner.png',
    link: '/products',
    tag: 'ROYAL MAHESHWAR HERITAGE',
    sortOrder: 3,
    active: true,
  },
];

export async function GET() {
  const storeData = getStoreData();
  let banners = storeData.banners || [];

  // Check if store banners still contain old Unsplash demo stock photos
  const hasOldUnsplash = banners.some(
    (b: any) =>
      (b.image || '').includes('unsplash.com') ||
      (b.image || '').includes('photo-1610030469983-98e550d6193c') ||
      (b.image || '').includes('photo-1583391733956-3750e0ff4e8b')
  );

  if (!banners || banners.length === 0 || hasOldUnsplash) {
    banners = LATEST_FESTIVE_BANNERS;
    try {
      saveStoreData({ banners: LATEST_FESTIVE_BANNERS });
    } catch (e) {}
  }

  return NextResponse.json(
    {
      success: true,
      banners,
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    }
  );
}


