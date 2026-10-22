// Service worker sederhana: selalu ambil dari jaringan dulu, pakai salinan cache hanya saat luring.
const CACHE = 'kopi-blirik-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== self.location.origin) return;
  e.respondWith(
    fetch(r)
      .then((res) => {
        if (res.ok && res.type === 'basic') {
          const salin = res.clone();
          caches.open(CACHE).then((c) => c.put(r, salin));
        }
        return res;
      })
      .catch(() => caches.match(r).then((m) => m || (r.mode === 'navigate' ? caches.match('/') : undefined)).then((m) => m || Response.error())),
  );
});
