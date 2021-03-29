import {exportButton, toBlob} from './script.mjs';

const exportImage = async (blob) => {
  try {
    const handle = await window.showSaveFilePicker({
      suggestedName: 'fugu-greetings.png',
      types: [{
        description: 'Image file',
        accept: {
          'image/png': ['.png'],
        },
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
