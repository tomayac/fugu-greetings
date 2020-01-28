import {shareButton, toBlob} from './script.mjs';

const share = async (title, text, blob) => {
  const data = {
    files: [
      new File([blob], 'fugu-greeting.png', {
        type: blob.type,
      }),
    ],
    title: title,
    text: text,
  };
  try {
    if (!(await navigator.canShare(data))) {
      throw new Error('Can\'t share data.', data);
    };
    await navigator.share(data);
  } catch (err) {
    console.error(err.name, err.message);
  }
};

shareButton.style.display = 'block';
shareButton.addEventListener('click', async () => {
  return share('', '', await toBlob());
});
