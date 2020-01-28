import {ephemeralInput, ephemeralLabel, clearCanvas} from './script.mjs';

const idleDetector = new IdleDetector({threshold: 60});

try {
  idleDetector.addEventListener('change', ({
    target: {
      state: {
        user,
        screen,
      },
    },
  }) => {
    console.log(`idle change: ${user}, ${screen}`);
    if (user === 'idle') {
      clearCanvas();
    }
  });
} catch (err) {
  console.error(err.name, err.message);
}

ephemeralInput.style.display = 'block';
ephemeralLabel.style.display = 'block';

ephemeralInput.addEventListener('change', () => {
  if (ephemeralInput.checked) {
    idleDetector.start();
  } else {
    idleDetector.stop();
  }
});
