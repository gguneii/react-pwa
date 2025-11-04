const cacheName = "static-v1";
const dynamicCacheName = "dynamic-v1";
const assets = [
  "/",
  "/index.html",
  "/src/App.jsx",
  "/src/index.css",
  "/src/main.jsx",
  "/offline.html",
];

const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// Pre-caching static files
self.addEventListener("install", (event) => {
  //   console.log("Service Worker Installing...");
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

// Activation event
self.addEventListener("activate", (event) => {
  //   console.log('Service Worker Activated');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== cacheName).map((key) => caches.delete(key))
      );
    })
  );
});

// Fetch event (offline support)
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  if (url.includes("firebasestorage.googleapis.com")) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        return (
          response ||
          fetch(event.request).then((fetchRes) => {
            return caches.open(dynamicCacheName).then((cache) => {
              cache.put(event.request.url, fetchRes.clone());
              limitCacheSize(dynamicCacheName, 15);
              return fetchRes;
            });
          })
        );
      })
      .catch(() => {
        if (event.request.url.indexOf(".html") > -1) {
          return caches.match("/offline.html");
        }
      })
  );
});
