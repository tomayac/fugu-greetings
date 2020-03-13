import {canvas, clearButton} from './script.mjs';

let strokes = 0;

canvas.addEventListener('pointerdown', () => {
  navigator.setAppBadge(++strokes);
});

clearButton.addEventListener('click', () => {
  strokes = 0;
  navigator.setAppBadge(strokes);
});
