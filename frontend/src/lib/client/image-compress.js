import imageCompression from 'browser-image-compression';
import { ToolController, createDownload } from './uploader.js';

async function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, url });
    img.onerror = () => reject(new Error('Unsupported image format'));
    img.src = url;
  });
}

export default function setupCompressImage() {
  return new ToolController({
    uid: 'imgcompress',
    minFiles: 1,
    process: async (files, { status, progress }) => {
      status('Compressing…');
      progress(20);
      const outputs = [];
      for (const file of files) {
        const { img } = await loadImage(file);
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const isJpegPng = file.type === 'image/jpeg' || file.type === 'image/png';
        const compressed = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 4096,
          useWebWorker: true,
          quality: 0.8,
          preserveResolution: true,
          fileType: isJpegPng ? 'image/jpeg' : file.type,
          initialQuality: 0.8,
        });
        const blob = new Blob([compressed], { type: file.type });
        outputs.push(createDownload(blob, `compressed-${file.name}`));
        progress(40 + Math.round(((outputs.length / files.length) * 60)));
      }
      progress(100);
      return outputs;
    },
  });
}