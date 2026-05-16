const CACHE_NAME = 'unihub-pwa-v1.1.1';
const urlsToCache = [
  '/UniHub/',
  '/UniHub/index.html',
  '/UniHub/manifest.json',
  '/UniHub/icon.svg'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Forza l'attivazione immediata
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    }).then(() => {
      // Forza il service worker a prendere il controllo di tutte le pagine aperte
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
