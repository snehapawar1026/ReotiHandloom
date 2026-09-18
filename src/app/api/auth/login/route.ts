import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAdminEmail } from '@/lib/notifications';
import { getUserByEmail, logActivityInStore } from '@/lib/storeManager';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email || '').toLowerCase().trim();
    const password = (body.password || '').trim();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    // Fail-proof Admin Check for admin@reotihandloom.com
    if (email === 'admin@reotihandloom.com') {
      if (password === 'Hariom@2618' || password === 'adminpassword123') {
        let adminUser = getUserByEmail('admin@reotihandloom.com');
        return NextResponse.json({
          success: true,
          user: {
            id: adminUser?.id || 'admin-1',
            name: adminUser?.name || 'Reoti Admin',
            email: 'admin@reotihandloom.com',
            phone: adminUser?.phone || '9826000000',
            role: 'admin',
          },
        });
      } else {
        return NextResponse.json({ success: false, error: 'Incorrect Admin Password' }, { status: 401 });
      }
    }

    // Standard Customer Login from storeManager
    let user = getUserByEmail(email);

    // If not found in storeManager, try Prisma
    if (!user) {
      try {
        const dbUser = await prisma.user.findUnique({ where: { email } });
        if (dbUser) {
          user = dbUser;
        }
      } catch (e) {}
    }

    if (!user || user.password !== password) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    // Log Activity for Seller / Admin Dashboard & Notifications
    const title = `🔐 Customer Logged In: ${user.name}`;
    const details = `Email: ${user.email} | Phone: ${user.phone || 'N/A'}`;

    logActivityInStore({
      type: 'LOGIN',
      title,
      details,
      userEmail: user.email,
    });

    try {
      await prisma.activityLog.create({
        data: {
          type: 'LOGIN',
          title,
          details,
          userEmail: user.email,
        },
      });
    } catch (e) {}

    sendAdminEmail({
      title,
      type: 'LOGIN',
      details,
      userEmail: user.email,
      userPhone: user.phone || undefined,
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role || 'customer',
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


