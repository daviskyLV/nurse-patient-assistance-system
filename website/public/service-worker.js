self.addEventListener('push', function(event) {
    const data = event.data.json();
    const options = {
        body: `Room ${data.room}, Bed ${data.bed}`,
        icon: '/icon.png', // Add an icon path
        badge: '/badge.png', // Add a badge path
        actions: [
            { action: 'accept', title: 'Accept', icon: '/accept-icon.png' },
            { action: 'decline', title: 'Decline', icon: '/decline-icon.png' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    if (event.action === 'accept') {
        clients.openWindow('/accept-path');
    } else if (event.action === 'decline') {
        clients.openWindow('/decline-path');
    } else {
        clients.openWindow('/');
    }
});
