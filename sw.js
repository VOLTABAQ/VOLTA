// Service worker mínimo: guarda solo la cáscara (ícono y página base).
// El sistema vive en Apps Script y siempre se pide a la red.
var CACHE = 'volta-shell-v1';
var ARCHIVOS = ['./', 'index.html', 'manifest.json', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ARCHIVOS); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // Apps Script: siempre red
  e.respondWith(
    fetch(e.request).catch(function () { return caches.match(e.request); })
  );
});
