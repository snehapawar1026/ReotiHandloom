'use client';

import React, { useEffect, useState } from 'react';
import { Bell, X, CheckCircle2, Sparkles } from 'lucide-react';

const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  'BCWb1-N0F5C7rOIdWwS6_75f8wG_qQ1m5F4nL0B_kX6w2M1T8S7r9V5q3Z0Y2K4X1W6v9A0B8c7D6E5F4G3H2J1';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const PushNotificationPrompt = () => {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [showPrompt, setShowPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      setPermission('unsupported');
      return;
    }

    // Register service worker
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('Service Worker registered successfully:', reg.scope);
      })
      .catch((err) => {
        console.error('Service Worker registration failed:', err);
      });

    setPermission(Notification.permission);

    // Show prompt if permission is default (not asked yet)
    if (Notification.permission === 'default') {
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    } else if (Notification.permission === 'granted') {
      setSubscribed(true);
    }
  }, []);

  const handleSubscribe = async () => {
    if (!('serviceWorker' in navigator)) return;
    setIsLoading(true);

    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm === 'granted') {
        const reg = await navigator.serviceWorker.ready;
        let sub = await reg.pushManager.getSubscription();

        if (!sub) {
          const convertedKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
          sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedKey,
          });
        }

        // Send subscription to server
        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription: sub }),
        });

        setSubscribed(true);
        setShowPrompt(false);
      }
    } catch (err) {
      console.error('Error subscribing to push notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (permission === 'unsupported' || permission === 'denied' || subscribed) {
    return null;
  }

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-24 right-6 z-40 max-w-sm w-full bg-white border border-amber-300 rounded-2xl shadow-2xl p-4 font-sans animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 border border-amber-300">
          <Bell className="w-5 h-5 text-amber-700 animate-bounce" />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-extrabold text-xs text-amber-950 flex items-center gap-1">
              <span>Reoti Handloom Alerts</span>
              <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
            </h4>
            <button
              onClick={() => setShowPrompt(false)}
              className="text-gray-400 hover:text-gray-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-gray-600 leading-snug">
            Get instant browser notifications for new Maheshwari saree launches, festive sales & wholesale deals!
          </p>

          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="flex-1 bg-amber-900 hover:bg-amber-950 text-white font-extrabold text-[11px] uppercase tracking-wider py-2 px-3 rounded-lg shadow-sm transition-all active:scale-98 flex items-center justify-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Enabling...' : 'Enable Notifications'}</span>
            </button>
            
            <button
              onClick={() => setShowPrompt(false)}
              className="text-[11px] font-bold text-gray-500 hover:text-gray-700 px-2 py-1"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
