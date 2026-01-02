const CACHE_NAME = 'app-cache-v1';
const PRECACHE_URLS = [
  './',
  './index.html',
  './index.js/crypto-js.min.js'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Navigation requests -> serve index.html (App Shell)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then((resp) => resp || fetch(event.request).catch(() => resp))
    );
    return;
  }

  // For other requests, try cache first then network
  event.respondWith(
    caches.match(event.request).then((resp) => resp || fetch(event.request).then((r) => {
      // Optionally cache new GET requests
      if (event.request.method === 'GET' && r && r.ok) {
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, r.clone()));
      }
      return r;
    }).catch(() => {
      // fallback could be improved (e.g., serve a local asset)
      return caches.match('./index.html');
    }))
  );
});