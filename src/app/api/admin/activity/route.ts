import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const activities = await prisma.activityLog.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, activities });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
