const CACHE = 'eureka-v11';
const FILES = [
  './',
  'index.html',
  'css/app.css',
  'js/app.js',
  'js/trees.js',
  'manifest.json',
  'favicon-32.png',
  'favicon.ico',
  'apple-touch-icon.png',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-192.png',
  'icon-maskable-512.png',
  'splash/iphone-se-light.png',
  'splash/iphone-se-dark.png',
  'splash/iphone-x-light.png',
  'splash/iphone-x-dark.png',
  'splash/iphone-11-light.png',
  'splash/iphone-11-dark.png',
  'splash/iphone-13-light.png',
  'splash/iphone-13-dark.png',
  'splash/iphone-14-pro-light.png',
  'splash/iphone-14-pro-dark.png',
  'splash/iphone-14-plus-light.png',
  'splash/iphone-14-plus-dark.png',
  'splash/iphone-14-pm-light.png',
  'splash/iphone-14-pm-dark.png',
  'splash/iphone-16-pro-light.png',
  'splash/iphone-16-pro-dark.png',
  'splash/iphone-16-pm-light.png',
  'splash/iphone-16-pm-dark.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
});

self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))),
    self.clients.claim()
  ]));
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    fetch(req).then(res => {
      try {
        const url = new URL(req.url);
        if (res.ok && url.origin === self.location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then(cache => cache.put(req, copy)).catch(() => {});
        }
      } catch (e) { /* ignore non-http requests */ }
      return res;
    }).catch(async () => {
      const hit = await caches.match(req);
      if (hit) return hit;
      if (req.mode === 'navigate') {
        const page = await caches.match('./index.html');
        if (page) return page;
      }
      return new Response('', { status: 504, statusText: 'Offline' });
    })
  );
});
