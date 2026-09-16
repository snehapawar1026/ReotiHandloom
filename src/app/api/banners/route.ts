import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import storeData from '@/data/storeData.json';

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ success: true, banners: banners && banners.length > 0 ? banners : storeData.banners });
  } catch (error: any) {
    console.warn('[FALLBACK] Serving banners from storeData:', error.message);
    return NextResponse.json({ success: true, banners: storeData.banners });
  }
}
