import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './utils/serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for PWA functionality
serviceWorkerRegistration.register({
  onSuccess: () => {
    console.log('FitTrack PWA is ready for offline use!');
  },
  onUpdate: (registration) => {
    console.log('New FitTrack version available!');
    serviceWorkerRegistration.showUpdateAvailableNotification();
  }
});

// Setup PWA features
serviceWorkerRegistration.setupPWAInstallPrompt();
serviceWorkerRegistration.setupOfflineHandling();
serviceWorkerRegistration.setupPerformanceMonitoring();
serviceWorkerRegistration.registerBackgroundSync();
serviceWorkerRegistration.setupPushNotifications(); 