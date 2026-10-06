/* PneuCerto PRO v4.2 — Service Worker */
const CACHE = 'pneucerto-v42';
const PRECACHE = ['./', './PneuCerto-PRO-v4_2.html'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(
        PRECACHE.map((url) => cache.add(url).catch(() => undefined))
      )
    )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const url = new URL(req.url);
            const sameOrigin = url.origin === self.location.origin;
            if (sameOrigin || req.mode === 'navigate') {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
            }
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
