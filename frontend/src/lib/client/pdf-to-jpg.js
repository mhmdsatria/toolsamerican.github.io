import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { ToolController, createDownload } from './uploader.js';

GlobalWorkerOptions.workerSrc = new URL('/pdfjs/pdf.worker.min.mjs', window.location.origin).href;

export default function setupPdfToJpg() {
  return new ToolController({
    uid: 'pdftojpg',
    minFiles: 1,
    maxFiles: 1,
    process: async ([file], { status, progress }) => {
      status('Loading PDF…');
      progress(5);
      const loader = getDocument({ url: URL.createObjectURL(file) });
      const pdf = await loader.promise;
      progress(15);
      const outputs = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const base = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: false });
        canvas.width = base.width;
        canvas.height = base.height;
        await page.render({ canvasContext: ctx, viewport: base }).promise;
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92));
        const url = URL.createObjectURL(blob);
        const name = `${file.name.replace(/\.pdf$/i, '')}-page-${i}.jpg`;
        outputs.push({ url, name, size: blob.size });
        progress(15 + Math.round((i / pdf.numPages) * 80));
        await new Promise((r) => setTimeout(r, 0));
      }
      progress(100);
      return outputs;
    },
  });
}