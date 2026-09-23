import { runFFmpeg } from './ffmpeg.js';
import { ToolController, createDownload } from './uploader.js';

export default function setupMp4ToMp3() {
  return new ToolController({
    uid: 'mp42mp3',
    minFiles: 1,
    maxFiles: 1,
    process: async ([file], { status, progress }) => status && progress && _convert(file, { status, progress }),
  });
}

export async function _convert(file, { status, progress }) {
  status('Loading audio engine…');
  const data = await runFFmpeg(
    {
      inputFile: file,
      inputName: 'input.mp4',
      outputName: 'output.mp3',
      args: ['-i', 'input.mp4', '-vn', '-acodec', 'libmp3lame', '-q:a', '2', '-y', 'output.mp3'],
    },
    { status, progress }
  );
  progress(100);
  status('Finishing…');
  const blob = new Blob([data], { type: 'audio/mpeg' });
  const baseName = file.name.replace(/\.(mp4|m4v|mov|avi|mkv|webm)$/i, '');
  return createDownload(blob, `${baseName}.mp3`);
}