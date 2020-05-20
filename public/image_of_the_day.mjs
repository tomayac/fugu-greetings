// eslint-disable-next-line no-unused-vars
const getImageOfTheDay = async () => {
  let url = './assets/default_background.jpg';
  try {
    let fishes = "blowfish, pufferfish, fugu".split(",");
    let fish = [~~(fishes.length * Math.random())];
    return await (await fetch(`https://source.unsplash.com/daily?${fish}`)).blob()
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
