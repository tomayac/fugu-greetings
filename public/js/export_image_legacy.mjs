import {exportButton, toBlob} from './script.mjs';

const exportImage = async (blob) => {
  const a = document.createElement('a');
  a.download = 'fugu-greeting.png';
  a.href = URL.createObjectURL(blob);
  a.addEventListener('click', () => {
    setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
  });
  a.click();
};

exportButton.addEventListener('click', async () => {
  exportImage(await toBlob());
});
