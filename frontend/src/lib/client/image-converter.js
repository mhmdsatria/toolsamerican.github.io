import { ToolController, createDownload } from './uploader.js';

const MIME = {
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
};
const EXT_TO_MIME = {
  'image/jpeg': 'image/jpeg',
  'image/jpg': 'image/jpeg',
  'image/png': 'image/png',
  'image/webp': 'image/webp',
  'image/avif': 'image/avif',
};

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, url });
    img.onerror = () => reject(new Error('Unsupported image format'));
    img.src = url;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), type, quality));
}

export default function setupImageConverter() {
  return new ToolController({
    uid: 'imgconv',
    minFiles: 1,
    maxFiles: 1,
    process: async ([file], { status, progress }) => {
      const { img, url } = await loadImage(file);
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const baseName = file.name.replace(/\.[^.]+$/, '');
      const plans = [];
      for (const ext of Object.keys(MIME)) {
        const mime = MIME[ext];
        if (mime !== 'image/webp' && mime === file.type) continue;
        plans.push({ ext, mime });
      }

      status('Converting…');
      progress(15);
      const outputs = [];
      for (let i = 0; i < plans.length; i++) {
        const { ext, mime } = plans[i];
        let blob;
        try {
          blob = await canvasToBlob(canvas, mime, 0.9);
        } catch {
          blob = null;
        }
        if (blob) {
          outputs.push(createDownload(blob, `${baseName}.${ext}`));
        }
        progress(15 + Math.round(((i + 1) / plans.length) * 85));
      }
      progress(100);
      return outputs;
    },
  });
}