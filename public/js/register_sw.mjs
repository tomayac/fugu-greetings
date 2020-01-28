window.addEventListener('load', async () => {
  try {
    await navigator.serviceWorker.register('./serviceworker.js');
  } catch (err) {
    console.error(err.name, err.message);
  }
});
