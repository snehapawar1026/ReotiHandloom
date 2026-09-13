import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Name, email, and password are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ success: false, error: 'User with this email already exists' }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        phone,
        role: 'user',
      },
    });

    // Log Activity for Seller / Admin Dashboard
    await prisma.activityLog.create({
      data: {
        type: 'REGISTER',
        title: `👤 New Customer Registered: ${name}`,
        details: `Email: ${email} | Phone: ${phone || 'N/A'}`,
        userEmail: email,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
