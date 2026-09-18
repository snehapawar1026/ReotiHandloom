import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { webpush } from '@/lib/push';
import { logActivityInStore } from '@/lib/storeManager';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { subscription, userEmail } = body;

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return NextResponse.json({ success: false, error: 'Invalid subscription object' }, { status: 400 });
    }

    const { endpoint, keys } = subscription;
    const { p256dh, auth } = keys;

    let savedSub: any = { endpoint, p256dh, auth, userEmail };

    // Upsert subscription into SQLite DB
    try {
      savedSub = await prisma.pushSubscription.upsert({
        where: { endpoint },
        update: {
          p256dh,
          auth,
          userEmail: userEmail || null,
        },
        create: {
          endpoint,
          p256dh,
          auth,
          userEmail: userEmail || null,
        },
      });
    } catch (e) {}

    // Log Activity for Store Owner / Admin Dashboard
    const title = '🔔 New Visitor Subscribed to Push Notifications';
    const details = userEmail ? `Customer (${userEmail}) enabled notifications` : 'Anonymous website visitor enabled notifications';

    logActivityInStore({
      type: 'VISIT',
      title,
      details,
      userEmail: userEmail || null,
    });

    try {
      await prisma.activityLog.create({
        data: {
          type: 'VISIT',
          title,
          details,
          userEmail: userEmail || null,
        },
      });
    } catch (e) {}

    // Send Instant Myntra/Nykaa-style Welcome Push Notification to Customer
    const welcomePayload = JSON.stringify({
      title: '✨ Welcome to Reoti Handloom!',
      body: 'Thank you for connecting! Discover authentic Maheshwari Sarees directly from Maheshwar looms. Claim up to 60% OFF festive deals!',
      url: '/products',
      icon: '/logo.jpg',
      badge: '/logo.jpg',
    });

    try {
      await webpush.sendNotification(
        {
          endpoint,
          keys: { p256dh, auth },
        },
        welcomePayload
      );
    } catch (err) {
      console.warn('Welcome push send warning:', err);
    }

    return NextResponse.json({ success: true, subscription: savedSub });
  } catch (error: any) {
    console.error('Error in /api/push/subscribe:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

