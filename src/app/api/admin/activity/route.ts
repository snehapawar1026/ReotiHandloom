import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getStoreData } from '@/lib/storeManager';

export async function GET() {
  try {
    const activities = await prisma.activityLog.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
    });

    if (activities && activities.length > 0) {
      return NextResponse.json({ success: true, activities });
    }
  } catch (error: any) {
    console.warn('[FALLBACK] Serving activities from storeManager:', error.message);
  }

  const storeActivities = (getStoreData().activities || []).slice(0, 20);
  return NextResponse.json({ success: true, activities: storeActivities });
}
