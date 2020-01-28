import {drawBlob} from './script.mjs';

const handleLaunchFiles = () => {
  console.log(window.launchParams);
  window.launchParams.files.forEach(async (handle) => {
    const file = await handle.getFile();
    drawBlob(file);
  });
};

if (window.launchParams && window.launchParams.files &&
    window.launchParams.files.length) {
  handleLaunchFiles();
}
