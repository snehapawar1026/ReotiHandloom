import { NextResponse } from 'next/server';
import { getStoreData } from '@/lib/storeManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const banners = getStoreData().banners || [];
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


