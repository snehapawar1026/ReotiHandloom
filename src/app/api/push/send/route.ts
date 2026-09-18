import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { webpush } from '@/lib/push';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, message, url, image } = body;

    if (!title || !message) {
      return NextResponse.json({ success: false, error: 'Title and message are required' }, { status: 400 });
    }

    const subscriptions = await prisma.pushSubscription.findMany();

    if (subscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No subscribers found to send notifications to.',
        sentCount: 0,
        failedCount: 0,
      });
    }

    const payload = JSON.stringify({
      title: title || 'Reoti Handloom Maheshwari Update',
      body: message,
      url: url || '/products',
      image: image || null,
      icon: '/logo.jpg',
      badge: '/logo.jpg',
    });

    let sentCount = 0;
    let failedCount = 0;

    await Promise.all(
      subscriptions.map(async (sub: any) => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };

        try {
          await webpush.sendNotification(pushSubscription, payload);
          sentCount++;
        } catch (err: any) {
          failedCount++;
          // If subscription is expired or invalid (410 Gone / 404 Not Found), delete from DB
          if (err.statusCode === 410 || err.statusCode === 404) {
            await prisma.pushSubscription.delete({ where: { endpoint: sub.endpoint } }).catch(() => {});
          }
        }
      })
    );

    return NextResponse.json({
      success: true,
      sentCount,
      failedCount,
      totalSubscribers: subscriptions.length,
    });
  } catch (error: any) {
    console.error('Error in /api/push/send:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
