const CACHE_NAME = 'agroapp-cache-v15';
const CACHE_PREFIX = 'agroapp-cache-';
const APP_BASE_URL = new URL('./', self.registration.scope);
const ASSETS_TO_CACHE = [
  './',
  'index.html',
  'favicon.svg',
  'manifest.json',
  'assets/css/styles.css',
  'assets/js/app.js',
  'assets/js/db.js',
  'assets/js/modules/api.js',
  'assets/js/modules/UI.js',
  'pages/offline.html',
  'pages/sobre.html',
  'pages/login.html',
  'pages/signup.html',
  'pages/menu.html',
  'pages/plants.html',
  'pages/care.html',
  'assets/js/login.js',
  'assets/js/signup.js',
  'assets/js/plants.js',
  'assets/js/care.js'
];

// Instalação e armazenamento de ficheiros estáticos em cache
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

// Ativação e limpeza de caches antigos
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

// As páginas são atualizadas pela rede; os assets usam a cache como primeira opção.
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
        if (networkResponse.ok) {
          await cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        if (!isNavigation) throw error;

        const cachedPage = await cache.match(event.request);
        if (cachedPage) return cachedPage;

        const offlinePage = await cache.match(
          new URL('pages/offline.html', APP_BASE_URL).href
        );
        return offlinePage || Response.error();
      }
    })()
  );
});