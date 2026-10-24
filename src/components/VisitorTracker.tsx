'use client';

import { useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function VisitorTrackerInternal() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTracked = useRef<{ url: string; time: number }>({ url: '', time: 0 });

  useEffect(() => {
    // Ignore tracking for admin pages or internal API routes
    if (
      !pathname ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/reoti-studio-manage') ||
      pathname.startsWith('/api')
    ) {
      return;
    }

    const searchStr = searchParams?.toString() ? `?${searchParams.toString()}` : '';
    const fullUrl = `${pathname}${searchStr}`;
    const now = Date.now();

    // Prevent duplicate rapid calls within 2 seconds for exact same URL
    if (lastTracked.current.url === fullUrl && now - lastTracked.current.time < 2000) {
      return;
    }
    lastTracked.current = { url: fullUrl, time: now };

    const trackVisit = async () => {
      try {
        const pageTitle = typeof document !== 'undefined' ? document.title || 'Reoti Handloom' : 'Reoti Handloom';
        const referrer = typeof document !== 'undefined' ? document.referrer || '' : '';

        // Check for bot or automated crawler
        const isClientBot = Boolean(
          typeof navigator !== 'undefined' && (
            (navigator as any).webdriver ||
            /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent || '')
          )
        );

        let isAdmin = false;
        let userEmail = '';
        let userName = '';

        try {
          const storedUser =
            localStorage.getItem('reoti_user') ||
            sessionStorage.getItem('reoti_user') ||
            localStorage.getItem('user') ||
            sessionStorage.getItem('user');
          if (storedUser) {
            const u = JSON.parse(storedUser);
            userEmail = u.email || '';
            userName = u.name || '';
            if (
              u.role === 'admin' ||
              u.email?.toLowerCase().includes('admin') ||
              u.email === 'reotihandloom@gmail.com' ||
              u.name?.toUpperCase() === 'REOTI'
            ) {
              isAdmin = true;
            }
          }
          if (
            localStorage.getItem('rh_admin_logged_in') === 'true' ||
            sessionStorage.getItem('rh_admin_logged_in') === 'true'
          ) {
            isAdmin = true;
          }
        } catch (e) {}

        let clientLocation: any = undefined;
        try {
          const locStr = localStorage.getItem('rh_exact_loc') || sessionStorage.getItem('rh_exact_loc');
          if (locStr) {
            clientLocation = JSON.parse(locStr);
          }
        } catch (e) {}

        const searchQuery = searchParams?.get('search') || '';
        let type = isAdmin ? 'ADMIN_VISIT' : (isClientBot ? 'BOT_CRAWL' : 'VISIT');
        let productTitle = '';
        let title: string | undefined = undefined;

        if (searchQuery) {
          type = isAdmin ? 'ADMIN_VISIT' : 'SEARCH';
          title = `🔍 Searched Saree: "${searchQuery}"`;
        } else if (pathname.startsWith('/products/')) {
          type = isAdmin ? 'ADMIN_VISIT' : (isClientBot ? 'BOT_CRAWL' : 'VIEW_PRODUCT');
          const h1 = document.querySelector('h1');
          if (h1 && h1.textContent) {
            productTitle = h1.textContent.trim();
          }
          if (!productTitle) {
            const slug = pathname.replace('/products/', '').split('?')[0].split('#')[0].trim();
            if (slug) {
              productTitle = slug
                .split('-')
                .filter(Boolean)
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ');
            }
          }
        }

        if (isAdmin) {
          title = `🛡️ Admin Viewing: ${productTitle || (searchQuery ? `Search "${searchQuery}"` : pathname)}`;
        }

        const getVisitorId = () => {
          try {
            let vid = localStorage.getItem('rh_vid');
            if (!vid) {
              vid = 'v_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
              localStorage.setItem('rh_vid', vid);
            }
            return vid;
          } catch (e) {
            return undefined;
          }
        };

        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorId: getVisitorId(),
            pageUrl: fullUrl,
            pageTitle,
            referrer,
            type,
            title,
            productTitle,
            searchQuery: searchQuery || undefined,
            isAdmin,
            isBot: isClientBot,
            clientLocation,
            userEmail: userEmail || (isAdmin ? 'reotihandloom@gmail.com' : undefined),
            userName: userName || (isAdmin ? 'REOTI' : undefined),
          }),
          keepalive: true,
        }).catch(() => {});
      } catch (e) {}
    };

    // Execute immediately after small 50ms tick so it never gets delayed or dropped on mobile
    const timer = setTimeout(trackVisit, 50);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}

export function VisitorTracker() {
  return (
    <Suspense fallback={null}>
      <VisitorTrackerInternal />
    </Suspense>
  );
}
