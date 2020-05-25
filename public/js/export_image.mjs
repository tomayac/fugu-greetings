import {exportButton, toBlob} from './script.mjs';

const exportImage = async (blob) => {
  try {
    const handle = await window.chooseFileSystemEntries({
      type: 'save-file',
      accepts: [{
        description: 'Image file',
        extensions: ['png'],
        mimeTypes: ['image/png'],
      }],
    });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
  } catch (err) {
    console.error(err.name, err.message);
  }
};

exportButton.addEventListener('click', async () => {
  exportImage(await toBlob());
});
