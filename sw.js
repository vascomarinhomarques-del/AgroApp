const CACHE_NAME = 'verdevivo-cache-v16';
const CACHE_PREFIX = 'verdevivo-cache-';
const APP_BASE_URL = new URL('./', self.registration.scope);
const ASSETS_TO_CACHE = [
  './',
  'index.html',
  'favicon.svg',
  'manifest.json',
  'assets/css/styles.css',
  'assets/js/app.js',
  'assets/js/db.js',
  'assets/js/menu.js',
  'assets/js/login.js',
  'assets/js/signup.js',
  'assets/js/plants.js',
  'assets/js/care.js',
  'assets/js/modules/api.js',
  'pages/offline.html',
  'pages/login.html',
  'pages/signup.html',
  'pages/menu.html',
  'pages/plants.html',
  'pages/care.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log('[Service Worker] A guardar assets estáticos no cache...');
      await cache.addAll(
        ASSETS_TO_CACHE.map((asset) => new URL(asset, APP_BASE_URL).href)
      );
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  const appScope = new URL(self.registration.scope);

  if (
    requestUrl.origin !== appScope.origin ||
    !requestUrl.pathname.startsWith(appScope.pathname)
  ) {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const isNavigation = event.request.mode === 'navigate';

      if (!isNavigation) {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) return cachedResponse;
      }

      try {
        const networkResponse = await fetch(event.request);
        if (networkResponse && networkResponse.ok) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        if (isNavigation) {
          const cachedPage = await cache.match(event.request);
          if (cachedPage) return cachedPage;

          const offlinePage = await cache.match(
            new URL('pages/offline.html', APP_BASE_URL).href
          );
          if (offlinePage) return offlinePage;
        }

        return Response.error();
      }
    })()
  );
});