const CACHE_NAME = 'unihub-pwa-v2.0.0';

// On install, skip waiting immediately
self.addEventListener('install', event => {
  self.skipWaiting();
});

// On activate, delete ALL old caches and claim clients
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => caches.delete(name))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// NETWORK-FIRST strategy: always try network, fall back to cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response and cache it
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request);
      })
  );
});
