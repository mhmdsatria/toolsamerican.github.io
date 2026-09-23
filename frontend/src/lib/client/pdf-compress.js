import { PDFDocument } from 'pdf-lib';
import { ToolController, createDownload } from './uploader.js';

export default function setupCompressPdf() {
  return new ToolController({
    uid: 'compress',
    minFiles: 1,
    maxFiles: 1,
    process: async ([file], { status, progress }) => {
      status('Reading file…');
      progress(20);
      const bytes = new Uint8Array(await file.arrayBuffer());
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true, updateMetadata: false });
      progress(60);
      pdf.setProducer('');
      pdf.setCreator('');
      const out = await pdf.save({ useObjectStreams: true, addDefaultPage: false });
      progress(100);
      const blob = new Blob([out], { type: 'application/pdf' });
      return createDownload(blob, `compressed-${file.name.replace(/\.pdf$/i, '')}.pdf`);
    },
  });
}