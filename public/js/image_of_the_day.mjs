const getImageOfTheDay = async () => {
  try {
    const fishes = ['blowfish', 'pufferfish', 'fugu'];
    const fish = fishes[Math.floor(fishes.length * Math.random())];
    const response = await fetch(`https://source.unsplash.com/daily?${fish}`);
    if (!response.ok) {
      throw new Error('Response was', response.status, response.statusText);
    }
    return await response.blob();
  } catch (err) {
    console.error(err.name, err.message);
  }
};

const getMediaCache = async () => {
  const keys = await caches.keys();
  return await caches.open(keys.filter((key) => key.startsWith('media'))[0]);
};

self.addEventListener('periodicsync', (syncEvent) => {
  if (syncEvent.tag === 'image-of-the-day-sync') {
    syncEvent.waitUntil((async () => {
      try {
        const blob = await getImageOfTheDay();
        const mediaCache = await getMediaCache();
        const fakeURL = './assets/background.jpg';
        await mediaCache.put(fakeURL, new Response(blob));
        const clients = await self.clients.matchAll();
        clients.forEach((client) => {
          client.postMessage({
            image: fakeURL,
          });
        });
      } catch (err) {
        console.error(err.name, err.message);
      }
    })());
  }
});
