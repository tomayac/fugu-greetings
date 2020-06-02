import {ephemeralInput, ephemeralLabel, clearCanvas} from './script.mjs';

ephemeralInput.style.display = 'block';
ephemeralLabel.style.display = 'block';

let controller = null;
let signal = null;
ephemeralInput.addEventListener('change', async () => {
  if (ephemeralInput.checked) {
    controller = new AbortController();
    signal = controller.signal;
    await detectIdleness(signal);
  } else {
    controller.abort();
  }
});

const detectIdleness = async (signal) => {
  try {
    const state = await Notification.requestPermission();
    if (!state === 'granted') {
      return alert('Idle detection requires the "notifications" permission.');
    }
    const idleDetector = new IdleDetector();
    idleDetector.addEventListener('change', () => {
      const userState = idleDetector.userState;
      const screenState = idleDetector.screenState;
      console.log(`Idle change: ${userState}, ${screenState}.`);
      if (userState === 'idle') {
        clearCanvas();
      }
    });
    await idleDetector.start({
      threshold: 60000,
      signal,
    });
    console.log('IdleDetector is active.');
  } catch (err) {
    // Deal with initialization errors like permission denied,
    // running outside of top-level frame, etc.
    console.error(err.name, err.message);
  }
};
