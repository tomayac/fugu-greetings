import {importButton, drawBlob} from './script.mjs';

const importImage = async () => {
  try {
    const handle = await window.chooseFileSystemEntries({
      accepts: [
        {
          description: 'Image files',
          mimeTypes: ['image/*'],
          extensions: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
        },
      ],
    });
    return await handle.getFile();
  } catch (err) {
    console.error(err.name, err.message);
  }
};

importButton.addEventListener('click', async () => {
  const file = await importImage();
  await drawBlob(file);
});
