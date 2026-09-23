import mammoth from 'mammoth';
import { ToolController, createDownload } from './uploader.js';

export default function setupDocxToHtml() {
  return new ToolController({
    uid: 'docx2html',
    minFiles: 1,
    maxFiles: 1,
    process: async ([file], { status, progress }) => {
      status('Converting…');
      progress(30);
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      progress(80);
      const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${file.name.replace(/\.(docx|doc)$/i, '')}</title></head><body>${result.value}</body></html>`;
      progress(100);
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      return createDownload(blob, `${file.name.replace(/\.(docx|doc)$/i, '')}.html`);
    },
  });
}