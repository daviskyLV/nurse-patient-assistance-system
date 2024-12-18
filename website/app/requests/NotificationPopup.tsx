/* "use client";

import React, { useState } from 'react';
import './notif-popup-styling.css';

interface NotificationPopupProps {
  room: string;
  bed: string;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ room, bed}) => {
  // control popup visibility
  const [showPopup, setShowPopup] = useState(true);

  const handleAccept = () => {
    alert('Accepted');
    setShowPopup(false); // hide when accepted
  };

  const handleDecline = () => {
    alert('Declined');
    setShowPopup(false); // hide when declined

  };

  if (!showPopup) return null;

  return (
    <div className="notification-popup">
      <h2>ALERT!</h2>
      <div className="notification-details">
        <p><strong>Room {room}</strong></p>
        <p><strong>Bed {bed}</strong></p>
      </div>
      <div className="notification-buttons">
        <button className="accept-button" onClick={handleAccept}>Accept</button>
        <button className="decline-button" onClick={handleDecline}>Decline</button>
      </div>
    </div>
  );
};

export default NotificationPopup; */

"use client";

import React, { useEffect } from 'react';
import '../styles/notif-popup-styling.css';

interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

interface CustomNotificationOptions extends NotificationOptions {
  actions?: Array<NotificationAction>;
}

export const NotificationPopup: React.FC = () => {
  useEffect(() => {
    console.log("Use effect running")
    console.log('Notification' in window)
    console.log('serviceWorker' in navigator)
    if ('Notification' in window && 'serviceWorker' in navigator) {
      console.log("Inside notif and servWorker if")
      // permission to show notifications
      Notification.requestPermission().then(permission => {
        console.log("Requested permission")
        if (permission === 'granted') {
          console.log("Permission granted")
          // service worker is ready
          // TODO: FIX
          navigator.serviceWorker.ready.then(registration => {
            console.log("Navigator Service Worker ready")
            const options: CustomNotificationOptions = {
              body: 'Room A1, Bed 3',
              icon: '/icons/icon.png',
              actions: [
                {
                  action: 'accept',
                  title: 'Accept',
                  icon: '/icons/accept-icon.png',
                },
                {
                  action: 'decline',
                  title: 'Decline',
                  icon: '/icons/decline-icon.png',
                },
              ],
              requireInteraction: true,  // notification visible until user interacts
            };
            console.log("OPTIONS:")
            console.log(options)

            // notification with custom options
            registration.showNotification('ALERT!', options);
          });
        }
      });
    }
  }, []);

  return null;
};

export default NotificationPopup;
