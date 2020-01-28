import {canvas, clearButton} from './script.mjs';

const setBadge = async (number) => {
  navigator.setExperimentalAppBadge(number);
};

let strokes = 0;

canvas.addEventListener('pointerdown', () => {
  setBadge(++strokes);
});

clearButton.addEventListener('click', () => {
  strokes = 0;
  setBadge(strokes);
});
