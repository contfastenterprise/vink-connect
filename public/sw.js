self.addEventListener('push', function (event) {
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.body || 'Tienes una nueva notificación',
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        data: { url: data.url || '/' },
      };
      
      if (data.icon) {
        options.icon = data.icon;
        options.image = data.icon;
      }
      
      event.waitUntil(self.registration.showNotification(data.title || 'Vink Connect', options));
    } catch (err) {
      console.error('Error procesando push:', err);
    }
  }
})

self.addEventListener('notificationclick', function (event) {
  console.log('Notification click received.')
  event.notification.close()
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url))
  }
})
