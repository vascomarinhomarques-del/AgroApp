const CACHE_NAME = 'agroapp-cache-v6';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/css/styles.css',
  '/assets/js/app.js',
  '/assets/js/db.js',
  '/assets/js/modules/api.js',
  '/assets/js/modules/UI.js',
  '/pages/offline.html',
  '/pages/sobre.html',
  '/pages/login.html',
  '/pages/signup.html',
  '/pages/menu.html',
  '/pages/plants.html',
  '/pages/care.html',
  '/assets/js/login.js',
  '/assets/js/signup.js',
  '/assets/js/plants.js',
  '/assets/js/care.js'
];

// Instalação e armazenamento de ficheiros estáticos em cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] A guardar assets estáticos no cache...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Interceção de pedidos de rede (Estratégia: Cache com rede como reserva)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          return networkResponse;
        })
        .catch(() => {
          // Se for uma navegação e falhar a rede, devolve a página offline
          if (event.request.mode === 'navigate') {
            return caches.match('/pages/offline.html');
          }
        });
    })
  );
});