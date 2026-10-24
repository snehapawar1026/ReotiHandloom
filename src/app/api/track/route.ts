import { NextRequest, NextResponse } from 'next/server';
import { logActivityInStore } from '@/lib/storeManager';

// In-memory cache for fast IP Geolocation lookup
const geoCache = new Map<string, { city: string; region: string; country: string; postal?: string; isp?: string }>();

function detectBot(ua: string, ip: string) {
  const uaLower = (ua || '').toLowerCase();

  // Known Googlebot IP blocks (66.249.x.x, 64.233.x.x, etc.)
  if (
    ip &&
    (ip.startsWith('66.249.') ||
      ip.startsWith('64.233.') ||
      ip.startsWith('72.14.') ||
      ip.startsWith('209.85.') ||
      ip.startsWith('108.177.'))
  ) {
    return { isBot: true, botName: 'Googlebot (Google Search Bot)' };
  }

  // Googlebot user agents
  if (
    uaLower.includes('googlebot') ||
    uaLower.includes('google-inspectiontool') ||
    uaLower.includes('storebot-google') ||
    uaLower.includes('mediapartners-google') ||
    uaLower.includes('adsbot-google')
  ) {
    return { isBot: true, botName: 'Googlebot (Google Search Bot)' };
  }

  // Microsoft Bingbot
  if (
    uaLower.includes('bingbot') ||
    uaLower.includes('bingpreview') ||
    (ip && (ip.startsWith('157.55.') || ip.startsWith('40.77.') || ip.startsWith('207.46.')))
  ) {
    return { isBot: true, botName: 'Bingbot (Microsoft Bing)' };
  }

  // Other known search bots & crawlers
  if (uaLower.includes('yandex')) {
    return { isBot: true, botName: 'Yandex Bot' };
  }
  if (uaLower.includes('baiduspider')) {
    return { isBot: true, botName: 'Baidu Spider' };
  }
  if (uaLower.includes('duckduckbot')) {
    return { isBot: true, botName: 'DuckDuckGo Bot' };
  }
  if (uaLower.includes('facebookexternalhit') || uaLower.includes('facebot')) {
    return { isBot: true, botName: 'Meta/Facebook Preview Bot' };
  }
  if (uaLower.includes('twitterbot')) {
    return { isBot: true, botName: 'Twitter/X Bot' };
  }
  if (uaLower.includes('whatsapp') && uaLower.includes('preview')) {
    return { isBot: true, botName: 'WhatsApp Preview Bot' };
  }
  if (
    uaLower.includes('semrushbot') ||
    uaLower.includes('ahrefsbot') ||
    uaLower.includes('mj12bot') ||
    uaLower.includes('dotbot') ||
    uaLower.includes('bytespider')
  ) {
    return { isBot: true, botName: 'SEO Audit Bot' };
  }
  if (
    uaLower.includes('headlesschrome') ||
    uaLower.includes('lighthouse') ||
    uaLower.includes('crawler') ||
    uaLower.includes('spider') ||
    (uaLower.includes('bot') && !uaLower.includes('bottom') && !uaLower.includes('bottle'))
  ) {
    return { isBot: true, botName: 'Search Engine Crawler' };
  }

  return { isBot: false, botName: '' };
}

function parseUserAgent(ua: string, bot: { isBot: boolean; botName: string }) {
  if (bot.isBot) {
    return {
      device: '🤖 Search Crawler',
      browser: bot.botName,
      deviceString: `🤖 ${bot.botName}`,
    };
  }

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

async function getIpGeoLocation(
  ip: string,
  isBot = false
): Promise<{ city: string; region: string; country: string; postal?: string; isp?: string }> {
  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return { city: 'Local / Store Admin', region: 'Maheshwar', country: 'India', postal: '451224' };
  }

  if (isBot) {
    if (ip.startsWith('66.249.')) {
      return { city: 'Googlebot Crawler', region: 'California', country: 'USA (Google)', postal: '' };
    }
    return { city: 'Search Engine Server', region: '', country: 'USA / Cloud', postal: '' };
  }

  if (geoCache.has(ip)) {
    const cached = geoCache.get(ip)!;
    if (cached.city && cached.city !== 'Online Visitor' && cached.city !== 'India') {
      return cached;
    }
  }

  // Fast resolve with 700ms timeout
  try {
    const res = await fetch(`https://ipwho.is/${ip}`, { signal: AbortSignal.timeout(700) });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        const resolved = {
          city: data.city || '',
          region: data.region || data.region_code || '',
          country: data.country || 'India',
          postal: data.postal || '',
          isp: data.connection?.isp || '',
        };
        geoCache.set(ip, resolved);
        return resolved;
      }
    }
  } catch (e) {
    // Background retry so subsequent requests get full city
    fetch(`https://ipwho.is/${ip}`, { signal: AbortSignal.timeout(3000) })
      .then((r) => r.json())
      .then((data) => {
        if (data && data.success) {
          geoCache.set(ip, {
            city: data.city || '',
            region: data.region || data.region_code || '',
            country: data.country || 'India',
            postal: data.postal || '',
            isp: data.connection?.isp || '',
          });
        }
      })
      .catch(() => {});
  }

  const fallback = { city: 'India', region: '', country: 'India', postal: '' };
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
    const botInfo = detectBot(userAgent, rawIp);
    const isBot = Boolean(body.isBot || botInfo.isBot);
    const botName = body.botName || botInfo.botName || (isBot ? 'Search Engine Crawler' : '');

    const { device, browser, deviceString } = parseUserAgent(userAgent, { isBot, botName });

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
      const geo = await getIpGeoLocation(rawIp, isBot);
      city = geo.city;
      region = geo.region;
      country = geo.country;
      locationText = geo.postal
        ? `${geo.city}, ${geo.region} (Pin: ${geo.postal})`
        : geo.region
        ? `${geo.city}, ${geo.region}`
        : geo.city && geo.city !== 'India'
        ? `${geo.city}, ${geo.country}`
        : geo.country || 'India';
    }

    const pageUrl = body.pageUrl || '/';
    const pageTitle = body.pageTitle || 'Reoti Handloom';
    let productTitle = body.productTitle || null;

    // If viewing product page and productTitle is missing, auto-parse clean title from URL slug!
    if (!productTitle && pageUrl.startsWith('/products/')) {
      const slug = pageUrl.replace('/products/', '').split('?')[0].split('#')[0].trim();
      if (slug) {
        productTitle = slug
          .split('-')
          .filter(Boolean)
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
      }
    }

    let title = isBot
      ? `🤖 ${botName} Indexing: ${productTitle || pageTitle || pageUrl}`
      : `👀 Visitor from ${locationText}`;

    if (!isBot) {
      if (body.type === 'SEARCH') {
        const query = body.searchQuery || productTitle || '';
        title = query ? `🔍 Searched Saree: "${query}" (${locationText})` : `🔍 Searched Store (${locationText})`;
      } else if ((body.type === 'VIEW_PRODUCT' || pageUrl.startsWith('/products/')) && productTitle) {
        title = `🛍️ Viewing: ${productTitle} (${locationText})`;
      } else if (body.type === 'ADD_TO_CART') {
        title = `🛒 Added to Cart: ${productTitle || 'Item'} (${locationText})`;
      } else if (body.type === 'CHECKOUT_STARTED') {
        title = `💳 Checkout Started (${locationText})`;
      } else if (body.title) {
        title = body.title;
      }
    }

    const isAdmin = Boolean(
      body.isAdmin ||
      body.userEmail === 'reotihandloom@gmail.com' ||
      pageUrl.startsWith('/admin') ||
      pageUrl.startsWith('/reoti-studio-manage')
    );

    const activity = logActivityInStore({
      type: isBot ? 'BOT_CRAWL' : (body.type || (isAdmin ? 'ADMIN_VISIT' : 'VISIT')),
      title,
      details: isBot
        ? `Page: ${pageUrl} | Crawler: ${botName} (Google search indexing)`
        : (body.details || `Page: ${pageUrl} | Device: ${deviceString}${body.referrer ? ` | From: ${body.referrer}` : ''}`),
      visitorId: isBot ? 'bot_crawler' : (body.visitorId || null),
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
      isAdmin,
      isBot,
      botName,
    });

    return NextResponse.json({
      success: true,
      location: locationText,
      city: city,
      region: region,
      activityId: activity.id,
      isBot,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
