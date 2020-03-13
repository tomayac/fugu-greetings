const APP_SHELL_CACHE = 'app-shell-1572613497211';
const MEDIA_CACHE = 'media-1572613497296';

const APP_SHELL_FILES = [
  './',
  './index.html',
  './js/script.mjs',
  './css/style.css',
  './assets/manifest.webmanifest',
  './assets/fugu.png',
];

const MEDIA_FILES = [
  './assets/default_background.jpg',
];

const ALL_CACHES = [APP_SHELL_CACHE, MEDIA_CACHE];

self.addEventListener('install', (installEvent) => {
  installEvent.waitUntil((async () => {
    const appShellCache = await caches.open(APP_SHELL_CACHE);
    await appShellCache.addAll(APP_SHELL_FILES);
    const mediaCache = await caches.open(MEDIA_CACHE);
    await mediaCache.addAll(MEDIA_FILES);
    return self.skipWaiting();
  })());
});

self.addEventListener('activate', (activateEvent) => {
  activateEvent.waitUntil((async () => {
    const cacheKeys = await caches.keys();
    await Promise.all(cacheKeys.map(async (cacheKey) => {
      if (!ALL_CACHES.includes(cacheKey)) {
        await caches.delete(cacheKey);
      }
    }));
    return self.clients.claim();
  })());
});

self.addEventListener('fetch', (fetchEvent) => {
  fetchEvent.respondWith((async () => {
    const request = fetchEvent.request;
    const cacheHitOrMiss = await caches.match(request);
    return cacheHitOrMiss || fetch(request);
  })());
});

if ('periodicSync' in self.registration) {
  importScripts('./image_of_the_day.mjs');
}
