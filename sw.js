// AuraOS Service Worker - تحسين الأداء والتخزين المؤقت
const CACHE_NAME = 'auraos-v2.0.1';
const STATIC_CACHE = 'auraos-static-v2.0.1';
const DYNAMIC_CACHE = 'auraos-dynamic-v2.0.1';

// ملفات للتخزين المؤقت الثابت
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/styles.css',
  '/script.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/favicon.ico'
];

// ملفات للتخزين المؤقت الديناميكي
const DYNAMIC_PATTERNS = [
  /^https:\/\/fonts\.googleapis\.com/,
  /^https:\/\/cdnjs\.cloudflare\.com/,
  /^https:\/\/www\.gstatic\.com\/firebasejs/
];

// تثبيت Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: تثبيت AuraOS');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Service Worker: تخزين الملفات الثابتة');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Service Worker: التثبيت مكتمل');
        return self.skipWaiting();
      })
  );
});

// تفعيل Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: تفعيل AuraOS');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== STATIC_CACHE && 
                     cacheName !== DYNAMIC_CACHE;
            })
            .map((cacheName) => {
              console.log('🗑️ Service Worker: حذف cache قديم:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('✅ Service Worker: التفعيل مكتمل');
        return self.clients.claim();
      })
  );
});

// معالجة الطلبات
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // تجاهل طلبات غير HTTP
  if (!request.url.startsWith('http')) {
    return;
  }

  // استراتيجية Cache First للملفات الثابتة
  if (STATIC_ASSETS.some(asset => url.pathname === asset)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // استراتيجية Stale While Revalidate للملفات الخارجية
  if (DYNAMIC_PATTERNS.some(pattern => pattern.test(url.href))) {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
    return;
  }

  // استراتيجية Network First للصفحات
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    return;
  }

  // استراتيجية Cache First للصور والملفات الأخرى
  if (request.destination === 'image' || 
      request.destination === 'font' ||
      request.destination === 'style') {
    event.respondWith(cacheFirst(request, DYNAMIC_CACHE));
    return;
  }

  // استراتيجية Network First للـ API
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    return;
  }

  // افتراضي: Network First
  event.respondWith(networkFirst(request, DYNAMIC_CACHE));
});

// استراتيجية Cache First
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('📦 Service Worker: استرجاع من cache:', request.url);
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok && request.method === 'GET') {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('❌ Service Worker: خطأ في cache first:', error);
    return new Response('خطأ في التحميل', { status: 503 });
  }
}

// استراتيجية Network First
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      // فحص نوع الطلب قبل التخزين - Cache API لا يدعم POST
      if (request.method === 'GET') {
        cache.put(request, networkResponse.clone());
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🌐 Service Worker: محاولة الاسترجاع من cache:', request.url);
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response('خطأ في الاتصال', { status: 503 });
  }
}

// استراتيجية Stale While Revalidate
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok && request.method === 'GET') {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });

  return cachedResponse || fetchPromise;
}

// معالجة رسائل الخلفية
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// معالجة الأخطاء
self.addEventListener('error', (event) => {
  console.error('❌ Service Worker: خطأ:', event.error);
});

// معالجة الرفض غير المعالج
self.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Service Worker: رفض غير معالج:', event.reason);
});

console.log('🎉 AuraOS Service Worker جاهز للعمل!');