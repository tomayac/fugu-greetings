const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

// eslint-disable-next-line no-unused-vars
const getImageOfTheDay = async () => {
  let url = './assets/default_background.jpg';
  try {
    let response = await fetch(`${CORS_PROXY}https://www.nasa.gov/rss/dyn/lg_image_of_the_day.rss`);
    if (!response.ok) {
      throw new Error('Response was', response.status, response.statusText);
    }
    const xmlString = await response.text();
    // Parsing XML with RegExp, because neither DOMParser nor XMLHttpRequest
    // are exposed in the service worker context. Also: YOLO… 😎
    url = xmlString.match(/<enclosure\s+url="([^"]+)/m)[1];

    response = await fetch(`${CORS_PROXY}${url}`);
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
