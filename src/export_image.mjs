import {exportButton, toBlob} from './script.mjs';

const exportImage = async (blob) => {
  const options = {
    type: 'saveFile',
    accepts: [{
      description: 'Image file',
      extensions: ['png'],
      mimeTypes: ['image/png'],
    }],
  };
  try {
    const handle = await window.chooseFileSystemEntries(options);
    const writer = await handle.createWriter();
    await writer.truncate(0);
    await writer.write(0, blob);
    await writer.close();
  } catch (err) {
    console.error(err.name, err.message);
  }
};

exportButton.addEventListener('click', async () => {
  exportImage(await toBlob());
});
