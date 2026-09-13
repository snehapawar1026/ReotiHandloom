import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAdminEmail } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { type = 'VISIT', title, details, userEmail, pageUrl } = body;

    // Get IP address and user-agent from headers
    const forwardedFor = req.headers.get('x-forwarded-for');
    const userIp = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Browser';

    const logTitle = title || (type === 'VISIT' ? '🌐 New Website Visitor' : '⚡ Store Activity');
    const logDetails = details || `Page: ${pageUrl || '/'} | Browser: ${userAgent.slice(0, 40)}`;

    const activity = await prisma.activityLog.create({
      data: {
        type,
        title: logTitle,
        details: logDetails,
        userEmail: userEmail || null,
        userIp,
        pageUrl: pageUrl || '/',
      },
    });

    // Optionally notify admin on key events
    if (type !== 'VISIT') {
      sendAdminEmail({
        title: logTitle,
        type,
        details: logDetails,
        userEmail,
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, activity });
  } catch (error: any) {
    console.error('Tracking error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
