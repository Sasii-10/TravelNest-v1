const CACHE_NAME = 'travelnest-v1';
const ASSETS = [
  '../HTML/index.html',
  '../HTML/explorer.html',
  '../HTML/planner.html',
  '../HTML/generator.html',
  '../HTML/mood.html',
  '../HTML/support.html',
  '../CSS/style.css',
  '../JS/app.js',
  '../JSON/destinations.json',
  '../JSON/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});