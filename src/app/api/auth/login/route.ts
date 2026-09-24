import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAdminEmail } from '@/lib/notifications';
import { getUserByEmail, logActivityInStore } from '@/lib/storeManager';
import { getClientIp, isIpLocked, recordFailedAttempt, recordSuccessfulLogin } from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req.headers);
    const userAgent = req.headers.get('user-agent') || 'Unknown Browser';

    // 1. Check if the IP is temporarily locked out due to brute force
    const lockStatus = isIpLocked(clientIp);
    if (lockStatus.locked) {
      return NextResponse.json(
        {
          success: false,
          error: `🚨 Security Lockout: Too many failed attempts. Access from this IP is blocked for ${lockStatus.remainingMinutes} more minute(s).`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const email = (body.email || '').toLowerCase().trim();
    const password = (body.password || '').trim();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    // Fail-proof Admin Check for admin@reotihandloom.com
    if (email === 'admin@reotihandloom.com') {
      if (password === 'Hariom@2618' || password === 'adminpassword123') {
        // Successful Admin Login
        recordSuccessfulLogin(clientIp);

        let adminUser = getUserByEmail('admin@reotihandloom.com');

        // Log and alert admin login
        sendAdminEmail({
          title: `🔐 Admin Logged In Successfully`,
          type: 'LOGIN',
          details: `Admin logged into dashboard from IP: ${clientIp} | Device: ${userAgent}`,
          userEmail: 'admin@reotihandloom.com',
        }).catch(() => {});

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
        // Failed Admin Login Attempt -> Trigger Immediate Security Alert
        const result = await recordFailedAttempt(clientIp, email, userAgent);

        if (result.locked) {
          return NextResponse.json(
            {
              success: false,
              error: '🚨 Maximum failed login attempts exceeded. Your IP has been temporarily locked for 30 minutes for security reasons.',
            },
            { status: 429 }
          );
        }

        return NextResponse.json(
          {
            success: false,
            error: `Incorrect Admin Password. (${result.attemptsLeft} attempts remaining before temporary IP ban)`,
          },
          { status: 401 }
        );
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
      const result = await recordFailedAttempt(clientIp, email, userAgent);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    // Successful Customer Login
    recordSuccessfulLogin(clientIp);

    // Log Activity for Seller / Admin Dashboard & Notifications
    const title = `🔐 Customer Logged In: ${user.name}`;
    const details = `Email: ${user.email} | Phone: ${user.phone || 'N/A'} | IP: ${clientIp}`;

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
