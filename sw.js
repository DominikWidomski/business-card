function log(message, color = "black") {
  switch (color) {
    case "success":
      color = "Green";
      break;
    case "info":
      color = "Blue";
      break;
    case "error":
      color = "Red";
      break;
    case "warning":
      color = "Orange";
      break;
    default:
      color = color;
  }

  console.log(`%cSW: ${message}`, `color:${color}`);
}

const cacheName = "v3::static";

const cacheList = [
  "scripts/QrCode.min.js",
  "styles/global.css",
  "styles/main.css",
  "index.html",
];

const plainCacheList = ["assets/logo_plain.png"];

const ddCacheList = [
  "assets/logo.png",
  "assets/noise.svg",
  "fonts/FSAldrinWeb-Medium.woff2",
  "fonts/FSAldrinWeb-Regular.woff2",
];

const brunelloCanessaCacheList = ["assets/logo_brunello_canessa.png"];

const samanLoiraCacheList = [
  "assets/logo_saman_loira.png",
  "fonts/Montserrat.ttf",
  "fonts/Newsreader.ttf",
];

const bellaYarnStudioCacheList = [
  "assets/logo_bella_yarn_studio_black@2x.webp",
  "assets/knitting-pattern-repeat-2.png",
  // Fonts:
  // Harmonia Sans, 700, normal
  "fonts/harmonia_sans/harmoniasans_n7.db6a243cdeddb2eba0b2e8fccdce1e6910fd06d0.woff2",
  // Harmonia Sans, 600, normal
  "fonts/harmonia_sans/harmoniasans_n6.dd3d6084d29e4754e80fe6aa1c0e37f511474ffa.woff2",
  // Harmonia Sans, 400, italic
  "fonts/harmonia_sans/harmoniasans_i4.ccbfea79fd847e76d49925a923aa89064359e629.woff2",
  // Harmonia Sans, 700, italic
  "fonts/harmonia_sans/harmoniasans_i7.4a7dd579ac7cb56f507f74a6af51c429211c3385.woff2",
];

self.addEventListener("install", (event) => {
  log("install", "info");
  event.waitUntil(
    (async () => {
      const existingCaches = await caches.keys();
      const invalidCaches = existingCaches.filter(
        (existingCache) => existingCache !== cacheName
      );

      await Promise.all(
        invalidCaches.map((invalidCache) => caches.delete(invalidCache))
      );

      const cache = await caches.open(cacheName);

      log("caching all: app shell and content", "info");

      await cache.addAll(
        cacheList.concat[
          (plainCacheList,
          ddCacheList,
          brunelloCanessaCacheList,
          samanLoiraCacheList,
          bellaYarnStudioCacheList)
        ]
      );

      log("done", "green");
    })()
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
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
    })()
  );
});
