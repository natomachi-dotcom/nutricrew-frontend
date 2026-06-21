self.addEventListener('push', event => {
  if (!event.data) return;
  const payload = event.data.json();
  const options = {
    body: payload.body || '',
    icon: '/pwa-192.svg',
    badge: '/pwa-192.svg',
    data: payload.data || {},
    actions: payload.actions || [],
    requireInteraction: true,
    vibrate: [200, 100, 200],
  };
  event.waitUntil(
    self.registration.showNotification(payload.title || 'NutriCrew', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const data = event.notification.data || {};
  let url = data.url || '/';
  if (event.action && data.kitchenUrls && data.kitchenUrls[event.action]) {
    url = data.kitchenUrls[event.action];
  }
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (const client of windowClients) {
        if ('focus' in client) { client.focus(); return; }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
