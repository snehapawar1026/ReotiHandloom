import { NextRequest, NextResponse } from 'next/server';
import { getStoreData, clearActivitiesInStore } from '@/lib/storeManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const storeActivities = getStoreData().activities || [];
  return NextResponse.json({
    success: true,
    activities: storeActivities,
  });
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filterType = (searchParams.get('type') || 'ALL') as any;
    clearActivitiesInStore(filterType);
    return NextResponse.json({ success: true, message: 'Activities cleared successfully.' });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
