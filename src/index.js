import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './utils/serviceWorkerRegistration';

// Cache busting - force reload if version changed
const APP_VERSION = '2025-05-25-v3-auth-fix';
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
  
  // Clear localStorage except user preferences, backup data, and Supabase auth
  const userPrefs = localStorage.getItem('userPreferences');
  const authToken = localStorage.getItem('authToken');
  const workoutState = localStorage.getItem('workoutState');
  const nutritionState = localStorage.getItem('nutritionState');
  const gamificationState = localStorage.getItem('gamificationState');
  const beforeRestoreBackup = localStorage.getItem('fitness-backup-before-restore');
  
  // Preserve all Supabase auth-related localStorage keys
  const supabaseKeys = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('sb-') || key.includes('supabase') || key.includes('auth'))) {
      supabaseKeys[key] = localStorage.getItem(key);
    }
  }
  
  localStorage.clear();
  
  // Restore preserved data
  if (userPrefs) localStorage.setItem('userPreferences', userPrefs);
  if (authToken) localStorage.setItem('authToken', authToken);
  if (workoutState) localStorage.setItem('workoutState', workoutState);
  if (nutritionState) localStorage.setItem('nutritionState', nutritionState);
  if (gamificationState) localStorage.setItem('gamificationState', gamificationState);
  if (beforeRestoreBackup) localStorage.setItem('fitness-backup-before-restore', beforeRestoreBackup);
  
  // Restore Supabase auth keys
  Object.keys(supabaseKeys).forEach(key => {
    localStorage.setItem(key, supabaseKeys[key]);
  });
  
  // Force reload
  // window.location.reload(true); // Temporarily disabled for debugging rapid refresh
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