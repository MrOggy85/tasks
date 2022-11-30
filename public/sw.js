/* eslint-disable no-undef */

self.addEventListener('install', (e) => {
  console.log('[SW] Install', e);
});

const cacheName = 'js13kPWA-v1';

self.addEventListener('fetch', (e) => {
  if (e.request.method !== "GET") return;

  e.respondWith((async () => {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(e.request);

    if (cachedResponse) {
      console.log('[SW] Cache hit!', e.request.url);
      e.waitUntil(fetchNewData(e, cache));
      return cachedResponse;
    }
    // If we didn't find a match in the cache, use the network.
    const response = await fetchNewData(e, cache)
    return response;
  })());
});

async function fetchNewData(e, cache) {
  console.log('[SW] Fetching new resource', e.request.url);
  const response = await fetch(e.request);
  cache.put(e.request, response.clone());
  return response;
}
