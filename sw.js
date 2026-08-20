const CACHE_NAME = 'cyberpehra-v4';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon.svg',
  '/assets/cyberpehra-logo.png',
  '/assets/icons/cyberpehra-192.png',
  '/assets/icons/cyberpehra-512.png',
  '/assets/icons/cyberpehra-maskable-512.png',
  '/assets/apple-touch-icon.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/404.html',
  '/js/app.js',
  '/js/tools.js',
  '/js/ui.js',
  '/js/scanner.js',
  '/js/state.js',
  '/js/language.js',
  '/js/utils.js',
  '/js/indiaMap.js',
  '/india_state_real_data.json',
  '/india_cyber_data.json',
  '/india_states.geojson'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(APP_SHELL.map((url) => cache.add(url)));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = event.request.url;

  // Do NOT cache API endpoints, functions, or live threat telemetry
  if (
    url.includes('/.netlify/functions/') ||
    url.includes('virustotal') ||
    url.includes('ipapi.co') ||
    url.includes('dns.google') ||
    url.includes('api.')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(event.request).then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    }).catch(() => caches.match('/index.html'))
  );
});
