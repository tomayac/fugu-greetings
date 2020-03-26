import PointerTracker from '../web_modules/pointer-tracker.js';

const canvas = document.querySelector('canvas');
const colorInput = document.querySelector('#color');
const sizeInput = document.querySelector('#size');
const sizeLabel = document.querySelector('label[for="size"]');
const clearButton = document.querySelector('#clear');
const importButton = document.querySelector('#import');
const exportButton = document.querySelector('#export');
const shareButton = document.querySelector('#share');
const copyButton = document.querySelector('#copy');
const pasteButton = document.querySelector('#paste');
const contactsButton = document.querySelector('#contacts');
const scanButton = document.querySelector('#scan');
const wakeLockInput = document.querySelector('#wakelock');
const wakeLockLabel = document.querySelector('label[for="wakelock"]');
const ephemeralInput = document.querySelector('#ephemeral');
const ephemeralLabel = document.querySelector('label[for="ephemeral"]');
const periodicBackgroundSyncButton = document.querySelector(
    '#periodicbackgroundsync');
const toolbar = document.querySelector('.toolbar');

let CANVAS_BACKGROUND = null;
let CANVAS_COLOR = null;

const loadDarkMode = async () => {
  if (window.matchMedia('(prefers-color-scheme)').matches !== 'not all') {
    ({
      canvasBackground: CANVAS_BACKGROUND,
      canvasColor: CANVAS_COLOR,
    } = await import('./dark_mode.mjs'));
  } else {
    CANVAS_BACKGROUND = '#ffffff';
    CANVAS_COLOR = '#000000';
  }
};

const ctx = canvas.getContext('2d', {
  alpha: false,
  desynchronized: true,
});

let size = null;
const floor = Math.floor;

const clearCanvas = (colorOrEvent = CANVAS_BACKGROUND) => {
  if (typeof colorOrEvent === 'string') {
    CANVAS_BACKGROUND = colorOrEvent;
  }
  ctx.fillStyle = CANVAS_BACKGROUND;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = colorInput.value;
};
clearButton.addEventListener('click', clearCanvas);

sizeInput.addEventListener('input', () => {
  sizeLabel.textContent = sizeInput.value;
  size = sizeInput.value;
});

colorInput.addEventListener('input', () => {
  ctx.strokeStyle = colorInput.value;
});

new PointerTracker(canvas, {
  start(pointer, event) {
    event.preventDefault();
    ctx.lineCap = 'round';
    return true;
  },
  move(previousPointers, changedPointers, event) {
    for (const pointer of changedPointers) {
      const previous = previousPointers.find((p) => p.id === pointer.id);
      ctx.beginPath();
      ctx.moveTo(
          previous.nativePointer.offsetX,
          previous.nativePointer.offsetY,
      );
      for (const point of pointer.getCoalesced()) {
        ctx.lineWidth = size * point.nativePointer.pressure;
        ctx.lineTo(point.nativePointer.offsetX, point.nativePointer.offsetY);
      }
      ctx.stroke();
    }
  },
});

const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - toolbar.offsetHeight;
};

const getImageData = () => {
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const putImageData = (imageData) => {
  ctx.putImageData(imageData, 0, 0);
};

const drawImage = (image) => {
  const imageRatio = image.width / image.height;
  const canvasRatio = canvas.width / canvas.height;
  const sw =
    imageRatio < canvasRatio ? image.width : image.height * canvasRatio;
  const sh =
    imageRatio < canvasRatio ? image.width / canvasRatio : image.height;
  const sx = (image.width - sw) * 0.5;
  const sy = (image.height - sh) * 0.5;
  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
};

const drawBlob = async (blob) => {
  const image = new Image();
  image.addEventListener('load', () => {
    drawImage(image);
  });
  image.src = URL.createObjectURL(blob);
};

const toBlob = async () => {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      return resolve(blob);
    });
  });
};

const getMediaCache = async () => {
  const keys = await caches.keys();
  return await caches.open(keys.filter((key) => key.startsWith('media'))[0]);
};

const restoreImageFromShare = async () => {
  const mediaCache = await getMediaCache();
  const image = await mediaCache.match('shared-image');
  if (image) {
    const blob = await image.blob();
    await drawBlob(blob);
    await mediaCache.delete('shared-image');
  }
};

const drawDefaultImage = async () => {
  const response = await fetch('assets/fugu_greeting_card.jpg');
  const blob = await response.blob();
  await drawBlob(blob);
};

(async () => {
  await loadDarkMode();
  colorInput.value = CANVAS_COLOR;
  ctx.strokeStyle = CANVAS_COLOR;
  size = sizeInput.value;
  sizeLabel.textContent = size;
  resizeCanvas();
  clearCanvas();
  if (location.search.includes('share-target')) {
    restoreImageFromShare();
  } else {
    drawDefaultImage();
  }
  draw();
})();

let debounce = null;
window.addEventListener('resize', () => {
  clearTimeout(debounce);
  debounce = setTimeout(() => {
    const imageData = getImageData();
    resizeCanvas();
    clearCanvas();
    putImageData(imageData);
    debounce = null;
  }, 250);
});

/* 🐡 Fugu features */

const loadShare = () => {
  if ('share' in navigator && 'canShare' in navigator) {
    import('./share.mjs');
  }
};

const loadContacts = () => {
  if ('contacts' in navigator) {
    import('./contacts.mjs');
  }
};

const loadImportAndExport = () => {
  if ('chooseFileSystemEntries' in window) {
    Promise.all([
      import('./import_image.mjs'),
      import('./export_image.mjs'),
    ]);
  } else {
    Promise.all([
      import('./import_image_legacy.mjs'),
      import('./export_image_legacy.mjs'),
    ]);
  }
};

const loadClipboard = () => {
  if ('clipboard' in navigator && 'write' in navigator.clipboard) {
    import('./clipboard.mjs');
  }
};

const loadBadge = () => {
  if ('setExperimentalAppBadge' in navigator || 'setAppBadge' in navigator) {
    import('./badge.mjs');
  }
};

const loadBarcodeDetection = () => {
  if ('BarcodeDetector' in window) {
    import('./barcodes.mjs');
  }
};

const loadWakeLock = () => {
  if ('wakeLock' in navigator && 'request' in navigator.wakeLock) {
    import('./wake_lock.mjs');
  }
};

const serviceWorkerSupported = 'serviceWorker' in navigator;
const loadServiceWorker = () => {
  if (serviceWorkerSupported) {
    import('./register_sw.mjs');
  }
};

const getRegistration = async () => {
  if (!serviceWorkerSupported) {
    return false;
  }
  return await navigator.serviceWorker.ready;
};

const loadPeriodicBackgroundSync = async () => {
  const registration = await getRegistration();
  if (registration && 'periodicSync' in registration) {
    import('./periodic_background_sync.mjs');
  }
};

const loadContentIndexing = async () => {
  const registration = await getRegistration();
  if (registration && 'index' in registration) {
    import('./content_indexing.mjs');
  }
};

const loadIdleDetection = async () => {
  if ('IdleDetector' in window) {
    import('./idle_detection.mjs');
  }
};

const loadFileHandling = async () => {
  if ('launchParams' in window) {
    import('./file_handling.mjs');
  }
};

const loadPWACompat = () => {
  if (/\b(iPad|iPhone|iPod)\b/.test(navigator.userAgent)) {
    import('https://unpkg.com/pwacompat');
  }
};

(async () => {
  await Promise.all([
    loadShare(),
    loadContacts(),
    loadClipboard(),
    loadImportAndExport(),
    loadBadge(),
    loadBarcodeDetection(),
    loadServiceWorker(),
    loadWakeLock(),
    loadIdleDetection(),
    loadFileHandling(),
    loadPWACompat(),
    loadPeriodicBackgroundSync(),
    loadContentIndexing(),
  ]);
})();

export {
  // Core:
  canvas,
  ctx,
  CANVAS_BACKGROUND,
  CANVAS_COLOR,
  // UI elements:
  colorInput,
  contactsButton,
  copyButton,
  pasteButton,
  exportButton,
  importButton,
  clearButton,
  shareButton,
  scanButton,
  wakeLockInput,
  wakeLockLabel,
  ephemeralInput,
  ephemeralLabel,
  periodicBackgroundSyncButton,
  // Functions:
  clearCanvas,
  toBlob,
  drawImage,
  drawBlob,
  floor,
};
