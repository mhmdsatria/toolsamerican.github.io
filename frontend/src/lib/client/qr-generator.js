import QRCode from 'qrcode';
import { ToolController, createDownload } from './uploader.js';

function buildDataUrl(text) {
  return QRCode.toDataURL(text, {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 512,
    color: { dark: '#0f172a', light: '#ffffff' },
  });
}

export default function setupQrGenerator() {
  const uid = 'qrcode';

  // The QR tool is text-input driven, not file driven — ToolController is still
  // reused for consistent status/download UI.
  const controller = new ToolController({
    uid,
    minFiles: 0,
    maxFiles: 0,
    process: () => Promise.reject(new Error('QR tool is text-based')),
  });

  const inputEl = document.getElementById(`${uid}-text`);
  const generateBtn = document.getElementById(`${uid}-generate`);
  if (inputEl && generateBtn) {
    const run = async () => {
      const text = inputEl.value.trim();
      if (!text) return;
      controller._setBusy(true);
      controller.setStatus('Generating…');
      try {
        const dataUrl = await buildDataUrl(text);
        const bin = atob(dataUrl.split(',')[1]);
        const u8 = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
        const blob = new Blob([u8], { type: 'image/png' });
        controller.renderResults(createDownload(blob, 'qr-code.png'));
        controller.setStatus('');
      } catch (err) {
        console.error(err);
        controller.setStatus('Could not generate QR code');
      } finally {
        controller._setBusy(false);
      }
    };
    generateBtn.addEventListener('click', run);
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') run();
    });
  }
  return controller;
}