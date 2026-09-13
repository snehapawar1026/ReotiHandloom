import webpush from 'web-push';

// VAPID keys for Web Push Notifications
// Can be overridden in .env via NEXT_PUBLIC_VAPID_PUBLIC_KEY & VAPID_PRIVATE_KEY
export const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  'BCWb1-N0F5C7rOIdWwS6_75f8wG_qQ1m5F4nL0B_kX6w2M1T8S7r9V5q3Z0Y2K4X1W6v9A0B8c7D6E5F4G3H2J1';

export const VAPID_PRIVATE_KEY =
  process.env.VAPID_PRIVATE_KEY ||
  'eK3M2N1B0A9V8C7D6E5F4G3H2J1K0L9M8N7P6Q5R4S3';

// Configure Web Push with VAPID details
try {
  webpush.setVapidDetails(
    'mailto:reotihandloom@hotmail.com',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
} catch (e) {
  console.warn('VAPID setup warning:', e);
}

export { webpush };
