const APP_SHELL_CACHE = 'app-shell-1572613497218';
const MEDIA_CACHE = 'media-1572613497293';

const APP_SHELL_FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './js/badge.mjs',
  './js/barcodes.mjs',
  './js/clipboard.mjs',
  './js/contacts.mjs',
  './js/content_indexing.mjs',
  './js/dark_mode.mjs',
  './js/export_image.mjs',
  './js/export_image_legacy.mjs',
  './js/file_handling.mjs',
  './js/idle_detection.mjs',
  './js/import_image.mjs',
  './js/import_image_legacy.mjs',
  './js/periodic_background_sync.mjs',
  './js/register_sw.mjs',
  './js/script.mjs',
  './js/share.mjs',
  './js/wake_lock.mjs',
  './web_modules/@pwabuilder/pwainstall.js',
  './web_modules/pointer-tracker.js',
  './css/style.css',
  './assets/fugu.png',
];

const MEDIA_FILES = [
  './assets/fugu_greeting_card.jpg',
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
  /* 🐡 Start Web Share Target */
  if (fetchEvent.request.url.endsWith('/share-target/')) {
    return fetchEvent.respondWith((async () => {
      const formData = await fetchEvent.request.formData();
      const image = formData.get('image');
      const keys = await caches.keys();
      const mediaCache = await caches
          .open(keys.filter((key) => key.startsWith('media'))[0]);
      await mediaCache.put('shared-image', new Response(image));
      return Response.redirect('./?share-target', 303);
    })());
  }
  /* 🐡 End Web Share Target */

  fetchEvent.respondWith((async () => {
    const request = fetchEvent.request;
    const cacheHitOrMiss = await caches.match(request);
    return cacheHitOrMiss || fetch(request);
  })());
});

if ('periodicSync' in self.registration) {
  importScripts('./image_of_the_day.mjs');
}
