const CACHE_VERSION = 'v1';
const ASSET_CACHE = `assets-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;

const ASSETS = [
  '/',
  '/index.html',
  '/vite.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(ASSET_CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => ![ASSET_CACHE, RUNTIME_CACHE].includes(key)).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

// Stale-while-revalidate for same-origin navigations and static assets
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Only handle GET
  if (request.method !== 'GET') return;

  // API requests: use network-first with fallback to cache
  if (url.origin !== self.location.origin && url.pathname.includes('/v1/forecast')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Same-origin assets and document: stale-while-revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request));
  }
});

async function staleWhileRevalidate(request) {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(request);
  const networkPromise = fetch(request).then(response => {
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => cached);
  return cached || networkPromise;
}

async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch (e) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw e;
  }
}


