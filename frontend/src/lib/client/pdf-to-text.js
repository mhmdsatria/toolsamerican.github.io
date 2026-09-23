import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { ToolController, createDownload } from './uploader.js';

GlobalWorkerOptions.workerSrc = new URL('/pdfjs/pdf.worker.min.mjs', window.location.origin).href;

export default function setupPdfToText() {
  return new ToolController({
    uid: 'pdftotext',
    minFiles: 1,
    maxFiles: 1,
    process: async ([file], { status, progress }) => {
      status('Loading PDF…');
      progress(10);
      const loader = getDocument({ url: URL.createObjectURL(file) });
      const pdf = await loader.promise;
      progress(30);
      const texts = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const line = content.items.map((it) => it.str ?? '').join(' ');
        texts.push(`${line}`);
        progress(30 + Math.round((i / pdf.numPages) * 60));
        if ((i - 1) % 2 === 0) await new Promise((r) => setTimeout(r, 0));
      }
      const outText = texts.join('\n\n');
      const blob = new Blob([outText], { type: 'text/plain;charset=utf-8' });
      return createDownload(blob, `${file.name.replace(/\.pdf$/i, '')}.txt`);
    },
  });
}