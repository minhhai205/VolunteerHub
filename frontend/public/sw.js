// public/sw.js

self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push received:', event);

    let data = {};
    try {
        data = event.data.json();
    } catch (e) {
        console.error('Push data not JSON:', e);
    }

    const options = {
        body: data.body || 'Bạn có thông báo mới!',
        icon: data.icon || '/images/home1.jpg',
        badge: data.badge || '/images/home1.jpg',
        data: {
            url: data.url || '/home',
            ...data.data
        },
        vibrate: [200, 100, 200],
        tag: `notification-${Date.now()}`,
        requireInteraction: false
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Thông báo', options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const urlToOpen = event.notification.data?.url || '/home';
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                for (const client of clientList) {
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});
