import { PDFDocument } from 'pdf-lib';
import { ToolController, createDownload } from './uploader.js';

export default function setupMergePdf() {
  return new ToolController({
    uid: 'merge',
    minFiles: 2,
    process: async (files) => {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const out = await merged.save();
      const blob = new Blob([out], { type: 'application/pdf' });
      return createDownload(blob, 'merged-document.pdf');
    },
  });
}