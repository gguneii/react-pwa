const cacheName = "static-v1";
const assets = [
  "/",
  "/index.html",
  "/src/App.jsx",
  "/src/index.css",
  "/src/main.jsx",
];

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
    caches.keys.then((keys) => {
      return Promise.all(keys
        .filter(key => key !== cacheName)
        .map(key => caches.delete())
      )
    })
  );
});

// Fetch event (offline support)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
