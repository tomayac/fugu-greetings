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
    launchUrl: backgroundImageKey.url,
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
