import { NextRequest, NextResponse } from 'next/server';
import { logActivityInStore } from '@/lib/storeManager';

// In-memory cache for fast IP Geolocation lookup
const geoCache = new Map<string, { city: string; region: string; country: string; postal?: string; isp?: string }>();

function parseUserAgent(ua: string) {
  let device = 'Desktop';
  let browser = 'Browser';

  if (/Mobile|Android|iPhone|iPod/i.test(ua)) {
    device = '📱 Mobile';
  } else if (/iPad|Tablet/i.test(ua)) {
    device = '📱 Tablet';
  } else if (/Windows/i.test(ua)) {
    device = '💻 Windows PC';
  } else if (/Macintosh|Mac OS/i.test(ua)) {
    device = '💻 Mac';
  }

  if (/Instagram/i.test(ua)) {
    browser = 'Instagram App';
  } else if (/WhatsApp/i.test(ua)) {
    browser = 'WhatsApp';
  } else if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) {
    browser = 'Chrome';
  } else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
    browser = 'Safari';
  } else if (/Edg/i.test(ua)) {
    browser = 'Edge';
  } else if (/Firefox/i.test(ua)) {
    browser = 'Firefox';
  }

  return { device, browser, deviceString: `${device} (${browser})` };
}

async function getIpGeoLocation(ip: string) {
  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return { city: 'Local / Store Admin', region: 'Maheshwar', country: 'India', postal: '451224' };
  }

  if (geoCache.has(ip)) {
    return geoCache.get(ip)!;
  }

  // 1. Try ipwho.is for high accuracy Indian city & postal code
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);

    const res = await fetch(`https://ipwho.is/${ip}`, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        const geo = {
          city: data.city || '',
          region: data.region || data.region_code || '',
          country: data.country || 'India',
          postal: data.postal || '',
          isp: data.connection?.isp || '',
        };
        geoCache.set(ip, geo);
        return geo;
      }
    }
  } catch (e) {}

  // 2. Fallback to ip-api.com
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);

    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,district,zip,isp`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.status === 'success') {
        const geo = {
          city: data.district ? `${data.district}, ${data.city}` : data.city || 'Unknown City',
          region: data.regionName || '',
          country: data.country || 'India',
          postal: data.zip || '',
          isp: data.isp || '',
        };
        geoCache.set(ip, geo);
        return geo;
      }
    }
  } catch (e) {}

  const fallback = { city: 'Online Visitor', region: '', country: 'India', postal: '' };
  geoCache.set(ip, fallback);
  return fallback;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawIp =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      req.headers.get('cf-connecting-ip') ||
      req.headers.get('x-client-ip') ||
      '127.0.0.1';

    const userAgent = req.headers.get('user-agent') || '';
    const { device, browser, deviceString } = parseUserAgent(userAgent);

    let locationText = '';
    let city = '';
    let region = '';
    let country = 'India';

    if (body.clientLocation && (body.clientLocation.city || body.clientLocation.locationText)) {
      locationText = body.clientLocation.locationText || `${body.clientLocation.city}, ${body.clientLocation.region}`;
      city = body.clientLocation.city || '';
      region = body.clientLocation.region || '';
      country = body.clientLocation.country || 'India';
    } else {
      const geo = await getIpGeoLocation(rawIp);
      city = geo.city;
      region = geo.region;
      country = geo.country;
      locationText = geo.postal
        ? `${geo.city}, ${geo.region} (Pin: ${geo.postal})`
        : geo.region
        ? `${geo.city}, ${geo.region}`
        : `${geo.city}, ${geo.country}`;
    }

    const pageUrl = body.pageUrl || '/';
    const pageTitle = body.pageTitle || 'Reoti Handloom';
    const productTitle = body.productTitle || null;

    let title = `👀 Visitor from ${locationText}`;
    if (body.type === 'VIEW_PRODUCT' && productTitle) {
      title = `🛍️ Viewing: ${productTitle} (${locationText})`;
    } else if (body.type === 'ADD_TO_CART') {
      title = `🛒 Added to Cart: ${productTitle || 'Item'} (${locationText})`;
    } else if (body.type === 'CHECKOUT_STARTED') {
      title = `💳 Checkout Started (${locationText})`;
    } else if (body.title) {
      title = body.title;
    }

    const activity = logActivityInStore({
      type: body.type || 'VISIT',
      title,
      details: body.details || `Page: ${pageUrl} | Device: ${deviceString}${body.referrer ? ` | From: ${body.referrer}` : ''}`,
      userEmail: body.userEmail || null,
      userPhone: body.userPhone || null,
      userIp: rawIp,
      location: locationText,
      city: city,
      region: region,
      country: country,
      device: device,
      browser: browser,
      pageUrl: pageUrl,
      pageTitle: pageTitle,
      referrer: body.referrer || null,
    });

    return NextResponse.json({
      success: true,
      location: locationText,
      city: city,
      region: region,
      activityId: activity.id,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}


