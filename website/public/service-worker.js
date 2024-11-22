self.addEventListener('push', function(event) {
    const data = event.data.json();
    const requestId = data.requestId;

    const options = {
        body: `Room ${data.room}, Bed ${data.bed}`,
        icon: '/icons/icon.png',
        badge: '/icons/badge.png',
        actions: [
            { action: 'accept', title: 'Accept', icon: '/icons/accept-icon.png' },
            { action: 'decline', title: 'Decline', icon: '/icons/decline-icon.png' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    const requestId = event.notification.data?.requestId;
    
    if (event.action === 'accept') {
        if (requestId) {
            clients.openWindow(`/api/accept-request/${requestId}`);
        } else {
            console.error("Request ID is missing for the 'accept' action.");
        }
    } else if (event.action === 'decline') {
        console.log("'Decline' action clicked. No further action taken.");
    } else {
        clients.openWindow('/');
    }
});
