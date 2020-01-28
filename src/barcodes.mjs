import {
  scanButton,
  clearButton,
  canvas,
  ctx,
  CANVAS_BACKGROUND,
  CANVAS_COLOR,
  floor,
} from './script.mjs';

const barcodeDetector = new BarcodeDetector();

const detectBarcodes = async (canvas) => {
  return await barcodeDetector.detect(canvas);
};

scanButton.style.display = 'block';
let seenBarcodes = [];
clearButton.addEventListener('click', () => {
  seenBarcodes = [];
});
scanButton.addEventListener('click', async () => {
  const barcodes = await detectBarcodes(canvas);
  if (barcodes.length) {
    barcodes.forEach((barcode) => {
      const rawValue = barcode.rawValue;
      if (seenBarcodes.includes(rawValue)) {
        return;
      }
      seenBarcodes.push(rawValue);
      ctx.font = '1em Comic Sans MS';
      ctx.textAlign = 'center';
      ctx.fillStyle = CANVAS_BACKGROUND;
      const boundingBox = barcode.boundingBox;
      const left = boundingBox.left;
      const top = boundingBox.top;
      const height = boundingBox.height;
      const oneThirdHeight = floor(height / 3);
      const width = boundingBox.width;
      ctx.fillRect(left, top + oneThirdHeight, width, oneThirdHeight);
      ctx.fillStyle = CANVAS_COLOR;
      ctx.fillText(rawValue, left + floor(width / 2), top + floor(height / 2),
          width);
    });
  }
});

