import {wakeLockInput, wakeLockLabel} from './script.mjs';

let wakeLock = null;

const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    wakeLock.addEventListener('release', () => {
      console.log('Wake Lock was released');
    });
    console.log('Wake Lock is active');
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);
  }
};

const handleVisibilityChange = () => {
  if (wakeLock !== null && document.visibilityState === 'visible') {
    requestWakeLock();
  }
};

document.addEventListener('visibilitychange', handleVisibilityChange);
document.addEventListener('fullscreenchange', handleVisibilityChange);

wakeLockInput.style.display = 'block';
wakeLockLabel.style.display = 'block';
wakeLockInput.addEventListener('change', async () => {
  if (wakeLockInput.checked) {
    await requestWakeLock();
  } else {
    wakeLock.release();
  }
});
