import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const cleanEmail = (email || '').toLowerCase().trim();
    if (!cleanEmail) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    if (cleanEmail === 'admin@reotihandloom.com') {
      return NextResponse.json({ success: true, exists: true, name: 'Reoti Admin', isAdmin: true });
    }

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      select: { id: true, name: true, email: true, phone: true },
    });

    return NextResponse.json({
      success: true,
      exists: !!user,
      name: user?.name,
      phone: user?.phone,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
