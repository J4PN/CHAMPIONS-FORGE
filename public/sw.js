// Self-unregistering service worker.
// Previous versions cached JS chunks aggressively, causing stale-file
// crashes after deploys (chunk hashes change but the SW served old files).
// This version cleans up the old cache and unregisters itself.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))).then(() => self.registration.unregister()),
  );
  self.clients.claim();
});
