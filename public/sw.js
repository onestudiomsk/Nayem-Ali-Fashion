// Zayn.Fashion Progressive Web App Service Worker
const CACHE_VERSION = 'zayn-v1.0.0';
const STATIC_CACHE = `zayn-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `zayn-runtime-${CACHE_VERSION}`;
const IMAGE_CACHE = `zayn-images-${CACHE_VERSION}`;

// Pre-cached App Shell URLs
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/favicon.svg',
];

// Install Event - Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('Some precache assets could not be cached immediately:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up stale caches
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE, RUNTIME_CACHE, IMAGE_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!currentCaches.includes(cacheName)) {
            console.log('[Service Worker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Dynamic caching strategy
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension / non-http protocols
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // 1. Navigation / HTML Requests: Network-First with Cache Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const indexFallback = await caches.match('/index.html');
          if (indexFallback) return indexFallback;
          return new Response(
            `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Zayn.Fashion - Offline</title>
              <style>
                body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #FFF1F2; color: #1E293B; text-align: center; padding: 20px; }
                .card { background: white; padding: 32px; border-radius: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); max-width: 400px; }
                h1 { color: #E11D48; font-size: 24px; margin-bottom: 8px; }
                p { color: #64748B; font-size: 14px; line-height: 1.5; }
                button { margin-top: 16px; background: #E11D48; color: white; border: none; padding: 10px 20px; border-radius: 12px; font-weight: 700; cursor: pointer; }
              </style>
            </head>
            <body>
              <div class="card">
                <h1>🛍️ Zayn.Fashion</h1>
                <p>You are currently offline. Please check your internet connection and try reloading.</p>
                <button onclick="window.location.reload()">Retry Connection</button>
              </div>
            </body>
            </html>`,
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // 2. Images: Cache-First with Network Fallback
  if (
    request.destination === 'image' ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|gif|ico)$/i) ||
    url.hostname.includes('unsplash.com') ||
    url.hostname.includes('images.unsplash.com')
  ) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;

        try {
          const response = await fetch(request);
          if (response && response.status === 200) {
            cache.put(request, response.clone());
          }
          return response;
        } catch {
          // If offline and image fails, return empty or fallback
          return cached || new Response('', { status: 408, statusText: 'Offline' });
        }
      })
    );
    return;
  }

  // 3. Static Assets (Scripts, Styles, Google Fonts): Stale-While-Revalidate
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'font' ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  ) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const fetchPromise = fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => cached);

        return cached || fetchPromise;
      })
    );
    return;
  }

  // 4. Default: Fetch with Runtime Cache Fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200 && request.method === 'GET') {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Listen for message to activate new worker immediately
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
