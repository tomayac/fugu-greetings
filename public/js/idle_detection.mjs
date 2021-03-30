import {ephemeralInput, ephemeralLabel, clearCanvas} from './script.mjs';

let controller;

ephemeralInput.style.display = 'block';
ephemeralLabel.style.display = 'block';

ephemeralInput.addEventListener('change', async () => {
  if (ephemeralInput.checked) {
    const state = await IdleDetector.requestPermission();
    if (state !== 'granted') {
      ephemeralInput.checked = false;
      return alert('Idle detection permission must be granted!');
    }
    try {
      controller = new AbortController();
      const idleDetector = new IdleDetector();
      idleDetector.addEventListener('change', (e) => {
        const {userState, screenState} = e.target;
        console.log(`idle change: ${userState}, ${screenState}`);
        if (userState === 'idle') {
          clearCanvas();
        }
      });
      idleDetector.start({
        threshold: 60000,
        signal: controller.signal,
      });
    } catch (err) {
      console.error(err.name, err.message);
    }
  } else {
    console.log('Idle detection stopped.');
    controller.abort();
  }
});
