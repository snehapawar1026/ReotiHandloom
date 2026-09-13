// Reoti Handloom Web Push Notification Service Worker

self.addEventListener('push', function (event) {
  if (!event.data) return;

  try {
    const data = event.data.json();

    const title = data.title || 'Reoti Handloom Maheshwari Update';
    const options = {
      body: data.body || 'Discover authentic Maheshwari Sarees & new festive deals!',
      icon: data.icon || '/logo.jpg',
      badge: data.badge || '/logo.jpg',
      image: data.image || null,
      data: {
        url: data.url || '/',
      },
      actions: [
        { action: 'open_url', title: '🛍️ Explore Collection' },
        { action: 'close', title: 'Dismiss' },
      ],
      vibrate: [100, 50, 100],
      tag: 'reoti-handloom-notification',
      renotify: true,
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.error('Error handling push event in sw.js:', err);
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  if (event.action === 'close') return;

  const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
