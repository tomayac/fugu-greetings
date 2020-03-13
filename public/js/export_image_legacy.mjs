import {exportButton, toBlob} from './script.mjs';

export const exportImage = async (blob) => {
  const a = document.createElement('a');
  a.download = 'fugu-greeting.png';
  a.rel = 'noopener';
  a.href = URL.createObjectURL(blob);
  a.addEventListener('click', (e) => {
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
  });
  setTimeout(() => a.click(), 0);
};

exportButton.addEventListener('click', async () => {
  exportImage(await toBlob());
});
