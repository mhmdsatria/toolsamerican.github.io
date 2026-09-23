// Copies WASM/worker assets from node_modules into public/ so the
// built site is 100% self-contained (no CDN at runtime).
import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');

const jobs = [
  {
    src: join(root, 'node_modules', '@ffmpeg', 'core', 'dist', 'esm', 'ffmpeg-core.js'),
    dest: join(publicDir, 'ffmpeg', 'ffmpeg-core.js'),
  },
  {
    src: join(root, 'node_modules', '@ffmpeg', 'core', 'dist', 'esm', 'ffmpeg-core.wasm'),
    dest: join(publicDir, 'ffmpeg', 'ffmpeg-core.wasm'),
  },
  {
    src: join(root, 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.mjs'),
    dest: join(publicDir, 'pdfjs', 'pdf.worker.min.mjs'),
  },
];

let copied = 0;
for (const job of jobs) {
  if (!existsSync(job.src)) {
    console.warn(`[copy-assets] SKIP missing: ${job.src}`);
    continue;
  }
  mkdirSync(dirname(job.dest), { recursive: true });
  copyFileSync(job.src, job.dest);
  copied += 1;
  console.log(`[copy-assets] ${job.dest}`);
}
console.log(`[copy-assets] done (${copied}/${jobs.length} files)`);