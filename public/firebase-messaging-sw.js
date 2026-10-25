// Firebase Cloud Messaging Service Worker
// HHWeekPlanner — Push Notifications

importScripts('https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyB2yQL_nUuC0YsiPmXEhe5mWY_JNeW2t2E',
  authDomain: 'hhweekplanner.firebaseapp.com',
  projectId: 'hhweekplanner',
  storageBucket: 'hhweekplanner.firebasestorage.app',
  messagingSenderId: '799686241392',
  appId: '1:799686241392:web:f255e180c0477a1fc398b5',
});

const messaging = firebase.messaging();

// Handle background messages (app is closed or in background)
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message received:', payload);

  const { title, body, icon, badge, data } = payload.notification || {};

  const notificationTitle = title || '📅 HHWeekPlanner';
  const notificationOptions = {
    body: body || 'Tienes un recordatorio pendiente.',
    icon: icon || '/icons/icon-192.png',
    badge: badge || '/icons/icon-192.png',
    tag: data?.eventId || 'hhplanner-notification',
    data: data || {},
    vibrate: [200, 100, 200],
    requireInteraction: false,
    actions: [
      { action: 'open', title: '📅 Ver agenda' },
      { action: 'dismiss', title: 'Descartar' }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
