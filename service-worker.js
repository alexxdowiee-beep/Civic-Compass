// Civic Compass — minimal offline cache.
// Precaches the app shell, and separately caches the data/*.json files as
// they're fetched at runtime, so the app still opens with whatever data was
// last loaded without a connection. Bump CACHE_NAME whenever you update
// index.html so returning visitors get the new version instead of a stale
// cached one.

const CACHE_NAME = 'civic-compass-v1';
const APP_SHELL = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network-first for navigation so users get fresh data when online;
  // falls back to the cached shell when offline.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Network-first for the JSON data files, caching each successful response
  // as we go. This is what actually makes "whatever data was last loaded"
  // true offline — these files aren't in APP_SHELL (they change far more
  // often than the shell), so without this they'd never be cached at all
  // and a returning offline visitor would just see a load error.
  if (event.request.url.includes('/data/') && event.request.url.endsWith('.json')) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
