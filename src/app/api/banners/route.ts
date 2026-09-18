import { NextResponse } from 'next/server';
import storeData from '@/data/storeData.json';

export async function GET() {
  return NextResponse.json({
    success: true,
    banners: storeData.banners || [],
  });
}

