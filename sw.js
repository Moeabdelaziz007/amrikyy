// AuraOS Service Worker
const CACHE_NAME = 'auraos-v1.1.0';
const STATIC_CACHE = 'auraos-static-v1.1.0';
const DYNAMIC_CACHE = 'auraos-dynamic-v1.1.0';
const FONTS_CACHE = 'auraos-fonts-v1.1.0';
const IMAGES_CACHE = 'auraos-images-v1.1.0';
const ICONS_CACHE = 'auraos-icons-v1.1.0';

// Files to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/offline.html',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-brands-400.woff2',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js'
];

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
            if (
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== FONTS_CACHE &&
              cacheName !== IMAGES_CACHE &&
              cacheName !== ICONS_CACHE
            ) {
              console.log('Service Worker: Deleting old cache', cacheName);
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

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (STATIC_ASSETS.includes(url.pathname) || STATIC_ASSETS.includes(request.url)) {
    // Static assets - Cache First strategy
    event.respondWith(cacheFirst(request));
  } else if (
    request.destination === 'font' ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.ttf') ||
    url.pathname.includes('/webfonts/')
  ) {
    // Fonts - Cache First (long-lived)
    event.respondWith(cacheFirstFonts(request));
  } else if (url.pathname.startsWith('/icons/') || request.url.includes('/icons/')) {
    // Icons - Cache First (stable assets)
    event.respondWith(cacheFirstIcons(request));
  } else if (url.pathname.startsWith('/api/')) {
    // API requests - Network First with cache fallback
    event.respondWith(networkFirst(request));
  } else if (request.destination === 'image') {
    // Images - Stale While Revalidate strategy
    event.respondWith(staleWhileRevalidateImages(request));
  } else {
    // Other requests - Network First
    event.respondWith(networkFirst(request));
  }
});

// Cache First strategy for static assets
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache First failed:', error);
    return new Response('Offline - Resource not available', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Cache First for fonts (separate cache bucket)
async function cacheFirstFonts(request) {
  try {
    const cache = await caches.open(FONTS_CACHE);
    const cachedResponse = await cache.match(request, { ignoreVary: true });
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request, { mode: 'cors' }).catch(() => fetch(request));
    if (networkResponse && (networkResponse.ok || networkResponse.type === 'opaque')) {
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Fonts cacheFirst failed:', error);
    return caches.match(request);
  }
}

// Network First strategy for dynamic content
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return caches.match('/offline.html') || new Response(
        '<html><body><h1>Offline</h1><p>You are offline. Please check your connection.</p></body></html>',
        { headers: { 'Content-Type': 'text/html' } }
      );
    }
    
    return new Response('Offline - Resource not available', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Stale While Revalidate strategy for general images
async function staleWhileRevalidateImages(request) {
  const cache = await caches.open(IMAGES_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

// Cache First for icons (stable, app-local)
async function cacheFirstIcons(request) {
  try {
    const cache = await caches.open(ICONS_CACHE);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) return cachedResponse;

    const networkResponse = await fetch(request);
    if (networkResponse.ok || networkResponse.type === 'opaque') {
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Icons cacheFirst failed:', error);
    return caches.match(request);
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered');
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Get offline actions from IndexedDB
    const offlineActions = await getOfflineActions();
    
    for (const action of offlineActions) {
      try {
        await fetch(action.url, {
          method: action.method,
          headers: action.headers,
          body: action.body
        });
        
        // Remove successful action from offline storage
        await removeOfflineAction(action.id);
        console.log('Background sync: Action completed', action.id);
      } catch (error) {
        console.error('Background sync: Action failed', action.id, error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New notification from AuraOS',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Open AuraOS',
        icon: '/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('AuraOS', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// Utility functions for offline storage
async function getOfflineActions() {
  // Implementation would use IndexedDB
  return [];
}

async function removeOfflineAction(actionId) {
  // Implementation would remove from IndexedDB
  console.log('Removed offline action:', actionId);
}

// Message handling from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data && event.data.type === 'WARM_CACHE') {
    const urls = Array.isArray(event.data.urls) ? event.data.urls : [];
    event.waitUntil(warmCache(urls));
  }
});

console.log('Service Worker: Loaded successfully');

// Warm cache helper
async function warmCache(urls) {
  const tasks = urls.map(async (url) => {
    try {
      const request = new Request(url, { mode: 'cors' });
      const ext = url.split('?')[0].split('#')[0].split('.').pop() || '';
      if (ext === 'woff2' || ext === 'woff' || ext === 'ttf') {
        const cache = await caches.open(FONTS_CACHE);
        const res = await fetch(request).catch(() => null);
        if (res && (res.ok || res.type === 'opaque')) await cache.put(request, res.clone());
        return;
      }
      if (url.includes('/icons/')) {
        const cache = await caches.open(ICONS_CACHE);
        const res = await fetch(request).catch(() => null);
        if (res && (res.ok || res.type === 'opaque')) await cache.put(request, res.clone());
        return;
      }
      if (/\/(png|jpg|jpeg|gif|webp|svg)$/.test(ext)) {
        const cache = await caches.open(IMAGES_CACHE);
        const res = await fetch(request).catch(() => null);
        if (res && (res.ok || res.type === 'opaque')) await cache.put(request, res.clone());
        return;
      }
      // Default to static cache
      const cache = await caches.open(STATIC_CACHE);
      const res = await fetch(request).catch(() => null);
      if (res && (res.ok || res.type === 'opaque')) await cache.put(request, res.clone());
    } catch (e) {
      // noop
    }
  });
  await Promise.allSettled(tasks);
}
