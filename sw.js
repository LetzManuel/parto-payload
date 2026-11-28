// Parto Payload 0.22.1. Caches only the app's own files, never data or Microsoft/Coupa traffic.
const CACHE = 'coupa-forms-0.22.1-mx0kbr5v';
const FILES = ["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","icon-180.png","impressum.html"];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES))); }); // waits until the user clicks "Update now"
self.addEventListener('message', (e) => { if (e.data === 'skip-waiting') self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || u.pathname.endsWith('/version.json')) return; // network only
  if (e.request.mode === 'navigate') { e.respondWith(caches.match('index.html').then((r) => r || fetch(e.request))); return; } // app shell, ignores ?code= from sign-in
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});
