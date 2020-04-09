import {notificationTriggersInput,
  notificationTriggersLabel} from './script.mjs';

const getReminderNotifications = async () => {
  const registration = await navigator.serviceWorker.ready;
  return await registration.getNotifications({
    tag: 'reminder',
    includeTriggered: true,
  });
};

(async () => {
  if (Notification.permission === 'granted') {
    const notifications = await getReminderNotifications();
    notificationTriggersInput.checked = !!notifications.length;
  }
})();

const getPermission = async () => {
  const state = await Notification.requestPermission();
  return state === 'granted';
};

const promptTargetDate = () => {
  const targetDate = new Date(new Date().getTime() + 60000);
  const defaultTime =
    `${targetDate.getHours().toString().padStart(2, '0')}:` +
    `${targetDate.getMinutes().toString().padStart(2, '0')}`;
  const time = prompt('When do you want to receive a reminder today? (HH:mm)',
      defaultTime);
  if (!time) {
    return null;
  }

  const match = time.match(/^([0|1]?\d|2[0-3]):([0-5]\d)$/);
  if (match) {
    const [, hours, minutes] = match;
    targetDate.setHours(hours, minutes, 0, 0);
    return targetDate;
  }

  alert('Illegal time format, try again.');
  return null;
};

const scheduleNotification = async () => {
  const targetDate = promptTargetDate();
  if (targetDate) {
    const registration = await navigator.serviceWorker.ready;
    registration.showNotification('Reminder', {
      tag: 'reminder',
      body: 'It’s time to finish your greeting card!',
      showTrigger: new TimestampTrigger(targetDate),
    });
  } else {
    notificationTriggersInput.checked = false;
  }
};

const removeNotification = async () => {
  const notifications = await getReminderNotifications();
  notifications.forEach((notification) => notification.close());
};

notificationTriggersInput.style.display = 'block';
notificationTriggersLabel.style.display = 'block';

notificationTriggersInput.addEventListener('click', async () => {
  const permission = await getPermission();
  if (!permission) {
    return;
  }

  if (notificationTriggersInput.checked) {
    scheduleNotification();
  } else {
    removeNotification();
  }
});
