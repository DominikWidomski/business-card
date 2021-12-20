const cacheName = 'v1::static';

const cacheList = [
  "assets/logo.png",
  "assets/noise.svg",
  "fonts/FSAldrinWeb-Medium.woff2",
  "fonts/FSAldrinWeb-Regular.woff2",
  "scripts/QrCode.min.js",
  "styles/global.css",
  "styles/main.css",
  "index.html"
];

self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    console.log('[Service Worker] Caching all: app shell and content');

    await cache.addAll(cacheList);

    console.log("[Service Worker] Done");
  })());
});

self.addEventListener('fetch', (event) => {
  event.respondWith((async () => {
    const cacheResponse = await caches.match(event.request);
    
    console.log(`[Service Worker] Fetching resource: ${event.request.url}`);
    
    if (cacheResponse) {
      return cacheResponse;
    }
    
    try {
      
    const response = await fetch(event.request);
    const cache = await caches.open(cacheName);
    
    console.log(`[Service Worker] Caching new resource: ${event.request.url}`);
    
    cache.put(event.request, response.clone());
    
    return response;
    } catch {
      return caches.match(event.request);
    }
  })());
});
