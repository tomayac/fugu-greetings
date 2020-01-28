import {copyButton, pasteButton, toBlob, drawImage} from './script.mjs';

const copy = async (blob) => {
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);
  } catch (e) {
    console.error(e, e.message);
  }
};

const paste = async () => {
  try {
    const clipboardItems = await navigator.clipboard.read();
    for (const clipboardItem of clipboardItems) {
      try {
        for (const type of clipboardItem.types) {
          const blob = await clipboardItem.getType(type);
          return blob;
        }
      } catch (e) {
        console.error(e, e.message);
      }
    }
  } catch (e) {
    console.error(e, e.message);
  }
};

copyButton.style.display = 'block';
pasteButton.style.display = 'block';
copyButton.addEventListener('click', async () => {
  await copy(await toBlob());
});
pasteButton.addEventListener('click', async () => {
  const image = new Image();
  image.addEventListener('load', () => {
    drawImage(image);
  });
  image.src = URL.createObjectURL(await paste());
});


