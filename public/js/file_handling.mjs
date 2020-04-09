import {drawBlob} from './script.mjs';

const handleLaunchFiles = () => {
  window.launchQueue.setConsumer((launchParams) => {
    if (!launchParams.files.length) {
      return;
    }
    launchParams.files.forEach(async (handle) => {
      const file = await handle.getFile();
      drawBlob(file);
    });
  });
};

handleLaunchFiles();
