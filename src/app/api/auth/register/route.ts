import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAdminEmail } from '@/lib/notifications';
import { sendWelcomeEmail } from '@/lib/mailService';

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

    // 1. Send Welcome Email to Customer
    sendWelcomeEmail(email, name, phone).catch(() => {});

    // 2. Log Activity for Seller / Admin Dashboard
    const title = `👤 New Customer Registered: ${name}`;
    const details = `Email: ${email} | Phone: ${phone || 'N/A'}`;

    await prisma.activityLog.create({
      data: {
        type: 'REGISTER',
        title,
        details,
        userEmail: email,
      },
    }).catch(() => {});

    // 3. Notify Admin
    sendAdminEmail({
      title,
      type: 'REGISTER',
      details,
      userEmail: email,
      userPhone: phone || undefined,
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone },
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

