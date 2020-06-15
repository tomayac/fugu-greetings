import {periodicBackgroundSyncButton, drawBlob} from './script.mjs';

const getPermission = async () => {
  const status = await navigator.permissions.query({
    name: 'periodic-background-sync',
  });
  return status.state === 'granted';
};

const registerPeriodicBackgroundSync = async () => {
  const registration = await navigator.serviceWorker.ready;
  try {
    registration.periodicSync.register('image-of-the-day-sync', {
      // An interval of one day.
      minInterval: 24 * 60 * 60 * 1000,
    });
  } catch (err) {
    console.error(err.name, err.message);
  }
};

const getMediaCache = async () => {
  const keys = await caches.keys();
  return await caches.open(keys.filter((key) => key.startsWith('media'))[0]);
};

navigator.serviceWorker.addEventListener('message', async (event) => {
  const blob = event.data.image;
  const mediaCache = await getMediaCache();
  mediaCache.put('./assets/background.jpg', new Response(blob));
  drawBlob(blob);
});

periodicBackgroundSyncButton.style.display = 'block';
periodicBackgroundSyncButton.addEventListener('click', async () => {
  if (await getPermission()) {
    await registerPeriodicBackgroundSync();
  }
  const mediaCache = await getMediaCache();
  let blob = await mediaCache.match(
      '/fugu-greetings/public/assets/background.jpg');
  if (!blob) {
    blob = await mediaCache.match(
        '/fugu-greetings/public/assets/fugu_greeting_card.jpg');
  }
  drawBlob(await blob.blob());
});
