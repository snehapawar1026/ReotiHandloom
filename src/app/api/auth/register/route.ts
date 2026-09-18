import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAdminEmail } from '@/lib/notifications';
import { sendWelcomeEmail } from '@/lib/mailService';
import { getUserByEmail, createUserInStore, logActivityInStore } from '@/lib/storeManager';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Name, email, and password are required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check existing
    const existingInStore = getUserByEmail(cleanEmail);
    if (existingInStore) {
      return NextResponse.json({ success: false, error: 'User with this email already exists' }, { status: 400 });
    }

    // Save in StoreManager
    const user = createUserInStore({
      name: name.trim(),
      email: cleanEmail,
      password: password.trim(),
      phone: phone ? phone.trim() : null,
      role: 'customer',
    });

    // Try Prisma DB in background
    try {
      await prisma.user.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          phone: user.phone,
          role: 'user',
        },
      });
    } catch (e) {}

    // 1. Send Welcome Email to Customer
    sendWelcomeEmail(cleanEmail, name, phone).catch(() => {});

    // 2. Log Activity for Seller / Admin Dashboard
    const title = `👤 New Customer Registered: ${name}`;
    const details = `Email: ${cleanEmail} | Phone: ${phone || 'N/A'}`;

    logActivityInStore({
      type: 'REGISTER',
      title,
      details,
      userEmail: cleanEmail,
    });

    try {
      await prisma.activityLog.create({
        data: {
          type: 'REGISTER',
          title,
          details,
          userEmail: cleanEmail,
        },
      });
    } catch (e) {}

    // 3. Notify Admin
    sendAdminEmail({
      title,
      type: 'REGISTER',
      details,
      userEmail: cleanEmail,
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


