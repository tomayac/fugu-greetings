import {copyButton, pasteButton, toBlob, drawImage} from './script.mjs';

const copy = async (blob) => {
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);
  } catch (err) {
    console.error(err.name, err.message);
  }
};

const paste = async () => {
  try {
    const clipboardItems = await navigator.clipboard.read();
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        const blob = await clipboardItem.getType(type);
        return blob;
      }
    }
  } catch (err) {
    console.error(err.name, err.message);
  }
};

copyButton.style.display = 'block';
copyButton.addEventListener('click', async () => {
  await copy(await toBlob());
});

pasteButton.style.display = 'block';
pasteButton.addEventListener('click', async () => {
  const image = new Image();
  image.addEventListener('load', () => {
    drawImage(image);
  });
  image.src = URL.createObjectURL(await paste());
});
