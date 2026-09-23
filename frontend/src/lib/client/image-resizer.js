import { ToolController, createDownload } from './uploader.js';

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, url });
    img.onerror = () => reject(new Error('Unsupported image format'));
    img.src = url;
  });
}

export function resizeCanvas(img, maxW, maxH) {
  const ratio = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);
  const w = Math.max(1, Math.round(img.naturalWidth * ratio));
  const h = Math.max(1, Math.round(img.naturalHeight * ratio));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, w, h);
  return canvas;
}

export default function setupImageResizer() {
  return new ToolController({
    uid: 'imgresize',
    minFiles: 1,
    process: async (files, { status, progress }) => {
      status('Resizing…');
      progress(10);
      const outputs = [];
      for (const [i, file] of files.entries()) {
        const { img, url } = await loadImage(file);
        URL.revokeObjectURL(url);
        const canvas = resizeCanvas(img, 1920, 1080);
        const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b), type, 0.9));
        outputs.push(createDownload(blob, `resized-${file.name.replace(/\.[^.]+$/, '')}.${type === 'image/png' ? 'png' : 'jpg'}`));
        progress(10 + Math.round(((i + 1) / files.length) * 90));
      }
      progress(100);
      return outputs;
    },
  });
}

export { loadImage };