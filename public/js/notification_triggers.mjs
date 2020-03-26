import {notificationTriggersButton} from './script.mjs';

const getPermission = async () => {
  const state = await Notification.requestPermission();
  return state === 'granted';
};

notificationTriggersButton.style.display = 'block';
notificationTriggersButton.addEventListener('click', async () => {
  if (await getPermission()) {
    const registration = await navigator.serviceWorker.getRegistration();
    registration.showNotification('Reminder', {
      body: 'Time to draw!',
      showTrigger: new TimestampTrigger(new Date().getTime() + 15 * 1000),
    });
  }
});
