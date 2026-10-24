'use client';

import { useEffect } from 'react';

export function GlobalErrorTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Capture standard JS Runtime Errors
    const handleError = (event: ErrorEvent) => {
      try {
        const errorMsg = event.message || 'Unknown JavaScript Error';
        const errorSource = `${event.filename || 'unknown'}:${event.lineno || 0}:${event.colno || 0}`;
        const stack = event.error?.stack || '';

        // Ignore harmless 3rd-party browser / app internal scripts & cross-origin blocked scripts:
        // - Generic cross-origin "Script error." with no line/col (triggered by adblockers/extensions)
        // - Instagram / Facebook in-app browser scripts (iabjs://, navigation_performance_logger)
        // - Android WebView native bridge cleanup ("Java object is gone")
        // - Chrome / Edge browser extensions (chrome-extension://, moz-extension://)
        if (
          errorMsg === 'Script error.' ||
          (errorMsg.includes('Script error') && errorSource === 'unknown:0:0') ||
          errorSource.includes('iabjs://') ||
          errorSource.includes('chrome-extension://') ||
          errorSource.includes('moz-extension://') ||
          errorMsg.includes('Java object is gone') ||
          (errorMsg.includes('postMessage') && errorSource.includes('android')) ||
          stack.includes('iabjs://')
        ) {
          return;
        }

        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'ERROR',
            title: `⚠️ Client Exception: ${errorMsg.slice(0, 100)}`,
            details: `Source: ${errorSource}\nURL: ${window.location.href}\nStack: ${stack.slice(0, 400)}`,
            pageUrl: window.location.pathname,
            pageTitle: document.title || 'Reoti Handloom',
          }),
          keepalive: true,
        }).catch(() => {});
      } catch (e) {}
    };

    // 2. Capture Unhandled Promise Rejections (e.g. failed fetch or async error)
    const handleRejection = (event: PromiseRejectionEvent) => {
      try {
        const reason = event.reason;
        const errorMsg =
          typeof reason === 'string'
            ? reason
            : reason?.message || JSON.stringify(reason) || 'Unhandled Promise Rejection';
        const stack = reason?.stack || '';

        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'ERROR',
            title: `⚠️ Async Exception: ${errorMsg.slice(0, 100)}`,
            details: `URL: ${window.location.href}\nStack: ${stack.slice(0, 400)}`,
            pageUrl: window.location.pathname,
            pageTitle: document.title || 'Reoti Handloom',
          }),
          keepalive: true,
        }).catch(() => {});
      } catch (e) {}
    };

    // 3. Disable right-click & long-press download on product cards, saree photos, and links
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'IMG' ||
          target.tagName === 'VIDEO' ||
          target.closest('a') ||
          target.closest('.group') ||
          target.closest('[data-product-card]'))
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return null;
}
