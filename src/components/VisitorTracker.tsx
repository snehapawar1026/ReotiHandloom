'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function VisitorTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<{ path: string; time: number }>({ path: '', time: 0 });
  const clientLocationRef = useRef<any>(null);

  useEffect(() => {
    // Try to get cached client location from sessionStorage
    try {
      const cached = sessionStorage.getItem('rh_exact_loc');
      if (cached) {
        clientLocationRef.current = JSON.parse(cached);
      }
    } catch (e) {}

    // Fetch high-accuracy client location (Multi-Source IP + GPS + Auto Pincode)
    if (!clientLocationRef.current) {
      const detectLocation = async () => {
        // 1. Multi-source IP detection (combining multiple geo providers for highest accuracy)
        try {
          const [resWhoIs, resFreeIp] = await Promise.allSettled([
            fetch('https://ipwho.is/', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)),
            fetch('https://freeipapi.com/api/json', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)),
          ]);

          let city = '';
          let region = '';
          let postal = '';
          let country = 'India';

          if (resWhoIs.status === 'fulfilled' && resWhoIs.value?.success) {
            const d = resWhoIs.value;
            city = d.city || '';
            region = d.region || d.region_code || '';
            postal = d.postal || '';
            country = d.country || 'India';
          }

          if ((!city || city.toLowerCase() === 'indore') && resFreeIp.status === 'fulfilled' && resFreeIp.value) {
            const d2 = resFreeIp.value;
            if (d2.cityName && d2.cityName.toLowerCase() !== 'unknown') {
              city = d2.cityName;
              region = d2.regionName || region;
              postal = d2.zipCode || postal;
            }
          }

          if (city && !clientLocationRef.current?.isGps && !clientLocationRef.current?.isExactPin) {
            const locationText = postal ? `${city}, ${region} (Pin: ${postal})` : `${city}, ${region || country}`;
            const loc = { city, region, country, postal, locationText };
            clientLocationRef.current = loc;
            sessionStorage.setItem('rh_exact_loc', JSON.stringify(loc));
            localStorage.setItem('rh_exact_loc', JSON.stringify(loc));
          }
        } catch (e) {}

        // 2. High-precision HTML5 GPS Geolocation (When allowed, gives 100% pinpoint exact town)
        if (typeof window !== 'undefined' && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              try {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                const revRes = await fetch(
                  `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
                );
                if (revRes.ok) {
                  const revData = await revRes.json();
                  const exactLocality = revData.locality || revData.city || '';
                  const exactCity = revData.city || revData.principalSubdivision || '';
                  const exactState = revData.principalSubdivision || '';
                  const postcode = revData.postcode || '';

                  const locationText = postcode
                    ? `${exactLocality ? `${exactLocality}, ` : ''}${exactCity}, ${exactState} (Pin: ${postcode})`
                    : `${exactLocality ? `${exactLocality}, ` : ''}${exactCity}, ${exactState}`;

                  const exactGpsLoc = {
                    city: exactLocality || exactCity,
                    region: exactState,
                    country: revData.countryName || 'India',
                    postal: postcode,
                    latitude: lat,
                    longitude: lng,
                    locationText,
                    isGps: true,
                  };

                  clientLocationRef.current = exactGpsLoc;
                  sessionStorage.setItem('rh_exact_loc', JSON.stringify(exactGpsLoc));
                  localStorage.setItem('rh_exact_loc', JSON.stringify(exactGpsLoc));
                  window.dispatchEvent(new Event('rh_location_updated'));

                  // Immediately report exact GPS location to Admin Activity Log
                  fetch('/api/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      pageUrl: window.location.pathname,
                      pageTitle: document.title || 'Reoti Handloom',
                      type: 'VISIT',
                      title: `🎯 Exact GPS: ${locationText}`,
                      clientLocation: exactGpsLoc,
                    }),
                    keepalive: true,
                  }).catch(() => {});
                }
              } catch (e) {}
            },
            () => {},
            { timeout: 10000, maximumAge: 30000, enableHighAccuracy: true }
          );
        }
      };

      detectLocation();
    }

    // 3. Global Auto-Resolver: When user inputs a 6-digit Pincode anywhere on the site
    const handleGlobalInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target && target.value) {
        const val = target.value.trim();
        if (/^\d{6}$/.test(val)) {
          fetch(`https://api.postalpincode.in/pincode/${val}`)
            .then((r) => r.json())
            .then((res) => {
              if (res && res[0]?.Status === 'Success' && res[0].PostOffice?.length > 0) {
                const po = res[0].PostOffice[0];
                const town = po.Name || po.Block || po.District;
                const locText = `${town}, ${po.District}, ${po.State} (Pin: ${val})`;
                const exactLoc = {
                  city: town,
                  region: po.State,
                  country: 'India',
                  postal: val,
                  locationText: locText,
                  isExactPin: true,
                };
                clientLocationRef.current = exactLoc;
                sessionStorage.setItem('rh_exact_loc', JSON.stringify(exactLoc));
                localStorage.setItem('rh_exact_loc', JSON.stringify(exactLoc));
                window.dispatchEvent(new Event('rh_location_updated'));

                fetch('/api/track', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    pageUrl: window.location.pathname,
                    pageTitle: document.title || 'Reoti Handloom',
                    type: 'PINCODE_DETECT',
                    title: `📦 Customer Pincode: ${val} (${town}, ${po.District})`,
                    clientLocation: exactLoc,
                  }),
                  keepalive: true,
                }).catch(() => {});
              }
            })
            .catch(() => {});
        }
      }
    };

    window.addEventListener('input', handleGlobalInput);
    return () => window.removeEventListener('input', handleGlobalInput);
  }, []);

  useEffect(() => {
    // Ignore tracking for admin pages
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/reoti-studio-manage') || pathname.startsWith('/api')) {
      return;
    }

    const now = Date.now();
    if (lastTracked.current.path === pathname && now - lastTracked.current.time < 5000) {
      return;
    }
    lastTracked.current = { path: pathname, time: now };

    const trackVisit = async () => {
      try {
        const pageTitle = document.title || 'Reoti Handloom';
        const referrer = document.referrer || '';

        // Check if viewing a specific product
        let type = 'VISIT';
        let productTitle = '';
        if (pathname.startsWith('/products/')) {
          type = 'VIEW_PRODUCT';
          const h1 = document.querySelector('h1');
          if (h1 && h1.textContent) {
            productTitle = h1.textContent.trim();
          }
        }

        await fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pageUrl: pathname,
            pageTitle,
            referrer,
            type,
            productTitle,
            clientLocation: clientLocationRef.current || null,
          }),
          keepalive: true,
        });
      } catch (e) {
        // Silently fail without affecting user experience
      }
    };

    // Small delay to let page title load & location resolve
    const timer = setTimeout(trackVisit, 900);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

