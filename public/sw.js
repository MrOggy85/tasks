/* eslint-disable no-undef */

self.addEventListener('install', (e) => {
  console.log('[SW] Install');
});

const cacheName = 'js13kPWA-v1';

self.addEventListener('fetch', (e) => {
  console.log('[sw] fetch...', e.request.method);
  if (e.request.method !== "GET") return;

  e.respondWith((async () => {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(e.request);
    console.log(`[SW] Fetching resource: ${e.request.url}`);
    if (cachedResponse) {
      e.waitUntil(cache.add(e.request));
      return cachedResponse;
    }
    // If we didn't find a match in the cache, use the network.
    return fetch(e.request);
  })());
});
