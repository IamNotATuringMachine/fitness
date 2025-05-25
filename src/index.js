import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './utils/serviceWorkerRegistration';

// Cache busting - force reload if version changed
const APP_VERSION = '2025-05-25-v2';
const STORED_VERSION = localStorage.getItem('app_version');

if (STORED_VERSION && STORED_VERSION !== APP_VERSION) {
  console.log('🔄 App version changed, clearing cache...');
  
  // Clear all caches
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
  }
  
  // Clear localStorage except user preferences
  const userPrefs = localStorage.getItem('userPreferences');
  const authToken = localStorage.getItem('authToken');
  localStorage.clear();
  if (userPrefs) localStorage.setItem('userPreferences', userPrefs);
  if (authToken) localStorage.setItem('authToken', authToken);
  
  // Force reload
  window.location.reload(true);
}

// Store current version
localStorage.setItem('app_version', APP_VERSION);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for offline functionality
serviceWorkerRegistration.register();

// Setup PWA features
serviceWorkerRegistration.setupPWAInstallPrompt();
serviceWorkerRegistration.setupOfflineHandling();
serviceWorkerRegistration.setupPerformanceMonitoring();
serviceWorkerRegistration.registerBackgroundSync();
serviceWorkerRegistration.setupPushNotifications(); 