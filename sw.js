// Minimal service worker to prevent registration errors in dev
self.addEventListener('install', (event) => {
  console.info('sw.js: install');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.info('sw.js: activate');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // No caching behavior by default; pass-through to network
});
