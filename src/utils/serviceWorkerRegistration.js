// Service Worker Registration for PWA functionality

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

export function register(config) {
  if ('serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/sw.js`;

      if (isLocalhost) {
        checkValidServiceWorker(swUrl, config);
        navigator.serviceWorker.ready.then(() => {
          console.log('FitTrack PWA is being served cache-first by a service worker.');
        });
      } else {
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      console.log('SW registered: ', registration);
      
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log('New content is available; please refresh.');
              
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              console.log('Content is cached for offline use.');
              
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then(response => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
}

// PWA Installation handling
export function setupPWAInstallPrompt() {
  let deferredPrompt;
  let installButton = null;

  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('PWA install prompt available');
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button
    showInstallButton();
  });

  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    hideInstallButton();
    deferredPrompt = null;
  });

  function showInstallButton() {
    if (!installButton) {
      installButton = document.createElement('button');
      installButton.innerText = '📱 Install FitTrack';
      installButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #4A90E2;
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
        z-index: 1000;
        transition: all 0.3s ease;
      `;
      
      installButton.addEventListener('mouseenter', () => {
        installButton.style.transform = 'translateY(-2px)';
        installButton.style.boxShadow = '0 6px 16px rgba(74, 144, 226, 0.4)';
      });
      
      installButton.addEventListener('mouseleave', () => {
        installButton.style.transform = 'translateY(0)';
        installButton.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.3)';
      });
      
      installButton.addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          console.log(`User response to install prompt: ${outcome}`);
          
          if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
          }
          
          deferredPrompt = null;
          hideInstallButton();
        }
      });
      
      document.body.appendChild(installButton);
    }
  }

  function hideInstallButton() {
    if (installButton) {
      installButton.remove();
      installButton = null;
    }
  }

  // Check if already installed
  if (window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true) {
    console.log('PWA is already installed');
    return;
  }
}

// Background sync registration
let backgroundSyncRegistered = false;

export function registerBackgroundSync() {
  if (backgroundSyncRegistered) {
    console.log('Background sync already registered, skipping...');
    return;
  }
  
  if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    navigator.serviceWorker.ready.then(registration => {
      console.log('Background sync is supported');
      
      // Register background sync for workout data
      registration.sync.register('workout-sync').then(() => {
        console.log('Background sync registered for workout data');
        backgroundSyncRegistered = true;
      }).catch(error => {
        console.error('Background sync registration failed:', error);
      });
    });
  }
}

// Push notification setup
export function setupPushNotifications() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.ready.then(registration => {
      console.log('Push notifications are supported');
      
      // Check current notification permission
      if (Notification.permission === 'granted') {
        console.log('Notification permission already granted');
      } else if (Notification.permission !== 'denied') {
        // Request permission
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            console.log('Notification permission granted');
            subscribeUserToPush(registration);
          }
        });
      }
    });
  }
}

async function subscribeUserToPush(registration) {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY
    });
    
    console.log('User is subscribed to push notifications:', subscription);
    
    // Send subscription to server (implement based on your backend)
    // await sendSubscriptionToServer(subscription);
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
  }
}

// Offline detection and handling
export function setupOfflineHandling() {
  function updateOnlineStatus() {
    const statusElement = document.getElementById('connection-status');
    
    if (!navigator.onLine) {
      if (!statusElement) {
        const offlineIndicator = document.createElement('div');
        offlineIndicator.id = 'connection-status';
        offlineIndicator.innerHTML = '📶 You\'re offline - changes will sync when connection is restored';
        offlineIndicator.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #ff9800;
          color: white;
          padding: 8px 16px;
          text-align: center;
          font-size: 14px;
          z-index: 1001;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(offlineIndicator);
      }
    } else if (statusElement) {
      statusElement.remove();
    }
  }

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  
  // Initial check
  updateOnlineStatus();
}

// Performance monitoring
export function setupPerformanceMonitoring() {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        const loadTime = perfData.loadEventEnd - perfData.fetchStart;
        
        console.log(`FitTrack loaded in ${loadTime}ms`);
        
        // Send performance data to analytics if needed
        if (loadTime > 3000) {
          console.warn('Slow load time detected. Consider optimizing.');
        }
      }, 0);
    });
  }
}

// App update notification
export function showUpdateAvailableNotification() {
  const updateBanner = document.createElement('div');
  updateBanner.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      left: 20px;
      right: 20px;
      background: #4A90E2;
      color: white;
      padding: 16px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1002;
      max-width: 400px;
      margin: 0 auto;
    ">
      <div>
        <strong>🎉 New version available!</strong><br>
        <small>Refresh to get the latest features</small>
      </div>
      <button onclick="window.location.reload()" style="
        background: white;
        color: #4A90E2;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
      ">
        Refresh
      </button>
    </div>
  `;
  
  document.body.appendChild(updateBanner);
  
  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (updateBanner.parentNode) {
      updateBanner.remove();
    }
  }, 10000);
} 