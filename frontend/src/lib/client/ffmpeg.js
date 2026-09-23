import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

let ffmpegPromise = null;

export function loadFFmpeg() {
  if (ffmpegPromise) return ffmpegPromise;
  ffmpegPromise = (async () => {
    const ffmpeg = new FFmpeg();
    const base = new URL('/ffmpeg/', window.location.origin).href;
    await ffmpeg.load({
      coreURL: await toBlobURL(`${base}ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${base}ffmpeg-core.wasm`, 'application/wasm'),
    });
    return ffmpeg;
  })();
  return ffmpegPromise;
}

let ffmpeg = null;
export async function readyFFmpeg(onReady) {
  if (!ffmpeg) {
    ffmpeg = await loadFFmpeg();
    if (onReady) onReady();
  }
  return ffmpeg;
}

export async function runFFmpeg(job, { status, progress }) {
  const inst = await loadFFmpeg();
  const logId = `progress-${Math.random().toString(36).slice(2)}`;
  inst.on('progress', ({ progress: pct }) => {
    if (progress && typeof pct === 'number') progress(pct * 100);
  });
  // Fall back on time-based reporting since ffmpeg.wasm 'progress' is limited:
  let lastMsg = 0;
  inst.on('log', ({ message, level }) => {
    if (level === 'error') return;
    const now = Date.now();
    if (status && now - lastMsg > 500) {
      lastMsg = now;
      const durMatch = message.match(/Duration:\s*(\d+):(\d+):(\d+(\.\d+)?)/);
      const tMatch = message.match(/time=(\d+):(\d+):(\d+(\.\d+)?)/);
      if (tMatch && durMatch) {
        const dur = (+durMatch[1]) * 3600 + (+durMatch[2]) * 60 + (+durMatch[3]);
        const t = (+tMatch[1]) * 3600 + (+tMatch[2]) * 60 + (+tMatch[3]);
        if (dur > 0) {
          const pct = Math.min(99, (t / dur) * 100);
          progress && progress(pct);
        }
      }
    }
  });
  await inst.writeFile(job.inputName, new Uint8Array(await job.inputFile.arrayBuffer()));
  await inst.exec(job.args);
  const data = await inst.readFile(job.outputName);
  inst.off('log');
  inst.off('progress');
  return data;
}

export function convertExt(fileName) {
  return fileName.includes('.mp4') ? 'mp4' : fileName.split('.').pop().toLowerCase();
}