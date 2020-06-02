const updateContentIndex = async () => {
  const cacheKeys = await caches.keys();
  const mediaCacheKey = cacheKeys.filter((k) => k.startsWith('media'))[0];
  const mediaCache = await caches.open(mediaCacheKey);
  const mediaCacheKeys = await mediaCache.keys();
  const backgroundImageKey = mediaCacheKeys
      .filter((k) => /background\.jpg/.test(k.url))[0];
  if (!backgroundImageKey) {
    return;
  }
  const registration = await navigator.serviceWorker.ready;
  registration.index.add({
    id: backgroundImageKey.url,
    // Required; url needs to be an offline-capable HTML page.
    // For compatibility during the Origin Trial, include launchUrl as well.
    launchUrl: backgroundImageKey.url,
    url: backgroundImageKey.url,
    title: 'Image of the Day',
    description: 'See today\'s featured background image',
    icons: [{
      src: './assets/fugu.png',
      sizes: '160x160',
      type: 'image/png',
    }],
    category: 'article',
  });
};

updateContentIndex();
