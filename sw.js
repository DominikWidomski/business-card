function log(message, color = "black") {
  switch (color) {
      case "success":  
           color = "Green"
           break
      case "info":     
              color = "Blue"  
           break;
      case "error":   
           color = "Red"   
           break;
      case "warning":  
           color = "Orange" 
           break;
      default: 
           color = color
  }

  console.log(`%cSW: ${message}`, `color:${color}`)
}

const cacheName = 'v3::static';

const cacheList = [
  "scripts/QrCode.min.js",
  "styles/global.css",
  "styles/main.css",
  "index.html"
];

const plainCacheList = [
  "assets/logo_plain.png"
];

const ddCacheList = [
  "assets/logo.png",
  "assets/noise.svg",
  "fonts/FSAldrinWeb-Medium.woff2",
  "fonts/FSAldrinWeb-Regular.woff2"  
];

const brunelloCanessaCacheList = [
  "assets/logo_brunello_canessa.png"
]

const samanLoiraCacheList = [
  "assets/logo_saman_loira.png",
  "fonts/Montserrat.ttf",
  "fonts/Newsreader.ttf"
];

self.addEventListener('install', (event) => {
  log('install', "info");
  event.waitUntil((async () => {

    const existingCaches = await caches.keys();
    const invalidCaches = existingCaches.filter(existingCache => existingCache !== cacheName);
    
    await Promise.all(invalidCaches.map(invalidCache => caches.delete(invalidCache)));

    const cache = await caches.open(cacheName);

    log('caching all: app shell and content', "info");

    await cache.addAll(
      cacheList.concat[
        plainCacheList,
        ddCacheList,
        brunelloCanessaCacheList,
        samanLoiraCacheList
      ]
    );

    log("done", "green");
  })());
});

self.addEventListener('fetch', (event) => {
  event.respondWith((async () => {
    const cacheResponse = await caches.match(event.request);
    
    log(`fetching resource: ${event.request.url}`, "info");
    
    if (cacheResponse) {
      return cacheResponse;
    }
    
    try {
      const response = await fetch(event.request);
      const cache = await caches.open(cacheName);
      
      cache.put(event.request, response.clone());
      
      log(`caching new resource: ${event.request.url}`, "info");
      
      log("done", "green");

      return response;
    } catch {
      return caches.match(event.request);
    }
  })());
});
