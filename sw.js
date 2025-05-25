const CACHE_NAME = 'fittrack-v1.2.1';
const STATIC_CACHE = 'fittrack-static-v1.2.1';
const DYNAMIC_CACHE = 'fittrack-dynamic-v1.2.1';
const API_CACHE = 'fittrack-api-v1.2.1';

// Assets to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/manifest.json'
  // Note: Other static assets will be cached on demand
  // Core pages will be cached during navigation
];

// Runtime caching patterns
const CACHE_STRATEGIES = {
  // Static assets - Cache First
  static: {
    cacheName: STATIC_CACHE,
    strategy: 'CacheFirst',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxEntries: 100
  },
  
  // API calls - Network First with fallback
  api: {
    cacheName: API_CACHE,
    strategy: 'NetworkFirst',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    maxEntries: 50
  },
  
  // Dynamic content - Stale While Revalidate
  dynamic: {
    cacheName: DYNAMIC_CACHE,
    strategy: 'StaleWhileRevalidate',
    maxAge: 2 * 60 * 60 * 1000, // 2 hours
    maxEntries: 200
  }
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== API_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle different caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Handle API requests
  if (url.pathname.startsWith('/api/') || url.hostname !== location.hostname) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Handle static assets
  if (request.destination === 'script' || 
      request.destination === 'style' || 
      request.destination === 'image' ||
      request.destination === 'font') {
    event.respondWith(handleStaticRequest(request));
    return;
  }
  
  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }
  
  // Handle other requests with dynamic strategy
  event.respondWith(handleDynamicRequest(request));
});

// Cache First strategy for static assets
async function handleStaticRequest(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Return cached version and update in background
      updateCache(request, cache);
      return cachedResponse;
    }
    
    // If not in cache, fetch and cache
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Static request failed:', error);
    // Return offline fallback for images
    if (request.destination === 'image') {
      return new Response(
        '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#ddd"/><text x="50%" y="50%" text-anchor="middle" dy=".3em">Offline</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    throw error;
  }
}

// Network First strategy for API requests
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Only cache GET requests (not POST, PUT, DELETE, etc.)
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache for API request');
    
    // Only try to get from cache for GET requests
    if (request.method === 'GET') {
      const cache = await caches.open(API_CACHE);
      const cachedResponse = await cache.match(request);
      
      if (cachedResponse) {
        // Add offline header
        const response = cachedResponse.clone();
        response.headers.set('X-Served-By', 'sw-cache');
        return response;
      }
    }
    
    // Return offline API response
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'You are currently offline. Some features may be limited.',
        cached: false
      }),
      {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'X-Served-By': 'sw-offline'
        }
      }
    );
  }
}

// Handle navigation requests (SPA routing)
async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.log('Navigation failed, serving app shell');
    const cache = await caches.open(STATIC_CACHE);
    const cachedApp = await cache.match('/');
    
    if (cachedApp) {
      return cachedApp;
    }
    
    // Fallback offline page
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>FitTrack - Offline</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 50px;
              background: #1a1a1a;
              color: white;
            }
            .offline-icon { font-size: 64px; margin-bottom: 20px; }
            .offline-title { font-size: 24px; margin-bottom: 10px; }
            .offline-message { font-size: 16px; color: #888; }
            .retry-button {
              background: #4A90E2;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 6px;
              margin-top: 20px;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <div class="offline-icon">📱</div>
          <h1 class="offline-title">You're offline</h1>
          <p class="offline-message">
            FitTrack is not available right now.<br>
            Check your connection and try again.
          </p>
          <button class="retry-button" onclick="window.location.reload()">
            Retry
          </button>
          <script>
            // Auto-retry when connection is restored
            window.addEventListener('online', () => {
              window.location.reload();
            });
          </script>
        </body>
      </html>`,
      {
        headers: {
          'Content-Type': 'text/html',
          'X-Served-By': 'sw-offline'
        }
      }
    );
  }
}

// Stale While Revalidate strategy for dynamic content
async function handleDynamicRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

// Background cache update
async function updateCache(request, cache) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response);
    }
  } catch (error) {
    console.log('Background cache update failed:', error);
  }
}

// Background Sync for offline workout data
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync event received for tag:', event.tag, new Date().toISOString());
  
  if (event.tag === 'workout-sync') {
    console.log('Service Worker: Starting waitUntil for workout-sync');
    event.waitUntil(
      syncWorkoutData()
        .then(() => {
          console.log('Service Worker: waitUntil for workout-sync completed successfully.');
        })
        .catch((err) => {
          console.error('Service Worker: Error in waitUntil for workout-sync:', err);
          throw err; // Re-throw to signal failure to the browser
        })
    );
  } else if (event.tag === 'analytics-sync') {
    console.log('Service Worker: Starting waitUntil for analytics-sync');
    event.waitUntil(
      syncAnalyticsData()
        .then(() => {
          console.log('Service Worker: waitUntil for analytics-sync completed successfully.');
        })
        .catch((err) => {
          console.error('Service Worker: Error in waitUntil for analytics-sync:', err);
          throw err; // Re-throw to signal failure to the browser
        })
    );
  }
});

// Sync workout data when connection is restored
async function syncWorkoutData() {
  console.log('Service Worker: syncWorkoutData called', new Date().toISOString());
  try {
    // Simulate some async work, even if no actual data to sync
    await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
    
    console.log('Service Worker: Syncing workout data...');
    const pendingWorkouts = await getPendingWorkouts();
    
    if (pendingWorkouts.length === 0) {
      console.log('Service Worker: No pending workouts to sync.');
    }
    
    for (const workout of pendingWorkouts) {
      try {
        const response = await fetch('/api/workouts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(workout)
        });
        
        if (response.ok) {
          await removePendingWorkout(workout.id);
          console.log('Workout synced successfully:', workout.id);
          
          // Notify user
          await self.registration.showNotification('Workout Synced', {
            body: 'Your offline workout has been synced successfully!',
            icon: '/logo192.png',
            badge: '/logo192.png',
            tag: 'workout-sync-success'
          });
        }
      } catch (error) {
        console.error('Failed to sync workout:', workout.id, error);
      }
    }

    console.log('Service Worker: syncWorkoutData finished successfully.');
  } catch (error) {
    console.error('Background sync failed (syncWorkoutData):', error);
    throw error;
  }
}

// Sync analytics data (add similar logging for completeness if it exists)
async function syncAnalyticsData() {
  console.log('Service Worker: syncAnalyticsData called', new Date().toISOString());
  try {
    await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
    console.log('Service Worker: Syncing analytics data...');
    // Actual analytics sync logic would go here
    console.log('Service Worker: syncAnalyticsData finished successfully.');
  } catch (error) {
    console.error('Background sync failed (syncAnalyticsData):', error);
    throw error;
  }
}

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received', event);
  
  const options = {
    body: event.data ? event.data.text() : 'Time for your workout!',
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'start-workout',
        title: 'Start Workout',
        icon: '/icons/workout-icon.png'
      },
      {
        action: 'remind-later',
        title: 'Remind Later',
        icon: '/icons/remind-icon.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('FitTrack', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event);
  
  event.notification.close();
  
  if (event.action === 'start-workout') {
    event.waitUntil(
      clients.openWindow('/workout-tracker')
    );
  } else if (event.action === 'remind-later') {
    // Schedule another notification in 30 minutes
    setTimeout(() => {
      self.registration.showNotification('Workout Reminder', {
        body: 'Don\'t forget your workout!',
        icon: '/logo192.png'
      });
    }, 30 * 60 * 1000);
  } else {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle message from main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'CACHE_WORKOUT') {
    // Cache workout data for offline use
    cacheWorkoutData(event.data.workout);
  }
});

// Cache workout data in IndexedDB for offline use
async function cacheWorkoutData(workout) {
  try {
    // This would typically use IndexedDB
    console.log('Caching workout data for offline use:', workout);
  } catch (error) {
    console.error('Failed to cache workout data:', error);
  }
}

// Placeholder functions for IndexedDB operations
async function getPendingWorkouts() {
  // Implementation would use IndexedDB to get pending workouts
  return [];
}

async function removePendingWorkout(id) {
  // Implementation would remove workout from IndexedDB
  console.log('Removing pending workout:', id);
}

// Periodic background tasks
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'daily-analytics') {
    event.waitUntil(generateDailyAnalytics());
  }
});

async function generateDailyAnalytics() {
  console.log('Generating daily analytics in background...');
  // Implementation would generate analytics data
}

// Error handling
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled rejection:', event.reason);
});

console.log('Service Worker: Loaded successfully'); 