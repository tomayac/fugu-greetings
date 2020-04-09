import {drawBlob} from './script.mjs';

const handleLaunchFiles = () => {
  window.launchQueue.setConsumer((launchParams) => {
    launchParams.files.forEach(async (handle) => {
      const file = await handle.getFile();
      drawBlob(file);
    });
  });
};

if (window.launchParams && window.launchParams.files &&
    window.launchParams.files.length) {
  handleLaunchFiles();
}
