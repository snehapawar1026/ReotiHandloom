import { NextRequest, NextResponse } from 'next/server';
import { logActivityInStore } from '@/lib/storeManager';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    logActivityInStore(body);
  } catch (e) {}
  return NextResponse.json({ success: true, skipped: true });
}

