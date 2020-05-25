// eslint-disable-next-line no-unused-vars
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

self.addEventListener('periodicsync', (syncEvent) => {
  if (syncEvent.tag === 'image-of-the-day-sync') {
    syncEvent.waitUntil((async () => {
      try {
        const blob = await getImageOfTheDay();
        const clients = await self.clients.matchAll();
        clients.forEach((client) => {
          client.postMessage({
            image: blob,
          });
        });
      } catch (err) {
        console.error(err.name, err.message);
      }
    })());
  }
});
