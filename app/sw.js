// Service worker for the Open Author Clock

const CACHE = 'author-clock-v1';

const PRECACHE = [
  './',
  'index.html',
  'manifest.webmanifest',
  'styles/styles.css',
  'scripts/main.js',
  'scripts/config.js',
  'scripts/quotes.js',
  'scripts/fit-text.js',
  'data/quotes.json',
  'favicon.ico',
  'apple-touch-icon.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'fonts/tinos-400-latin.woff2',
  'fonts/tinos-400-latin-ext.woff2',
  'fonts/tinos-400i-latin.woff2',
  'fonts/tinos-400i-latin-ext.woff2',
  'fonts/tinos-700-latin.woff2',
  'fonts/tinos-700-latin-ext.woff2',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => Promise.allSettled(PRECACHE.map((url) => cache.add(url))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(names.filter((name) => name !== CACHE).map((name) => caches.delete(name))),
      )
      .then(() => self.clients.claim()),
  );
});

async function put(request, response) {
  if (response.ok) {
    const cache = await caches.open(CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request) {
  try {
    return await put(request, await fetch(request));
  } catch (error) {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;
    throw error;
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  return put(request, await fetch(request));
}

async function staleWhileRevalidate(request, event) {
  const cached = await caches.match(request);
  const network = fetch(request)
    .then((response) => put(request, response))
    .catch(() => null);

  if (cached) {
    event.waitUntil(network);
    return cached;
  }

  const fresh = await network;
  if (fresh) return fresh;
  throw new Error(`Unable to fetch ${request.url}`);
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  if (/\.(woff2|png|ico)$/.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (/\.(css|js|json|webmanifest)$/.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request, event));
  }
});
