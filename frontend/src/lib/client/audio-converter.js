import { runFFmpeg } from './ffmpeg.js';
import { ToolController, createDownload } from './uploader.js';

const EXT_TO_CODEC = {
  mp3: 'libmp3lame',
  ogg: 'libvorbis',
  m4a: 'aac',
  wav: 'pcm_s16le',
  flac: 'flac',
};

function ext(fileName) {
  return fileName.toLowerCase().split('.').pop();
}

export default function setupAudioConverter() {
  return new ToolController({
    uid: 'audioconv',
    minFiles: 1,
    maxFiles: 1,
    process: async ([file], { status, progress }) => {
      const inputExt = ext(file.name);
      const inputName = `input.${inputExt}`;
      const data = await runFFmpeg(
        {
          inputFile: file,
          inputName,
          outputName: 'output.mp3',
          args: ['-i', inputName, '-q:a', '2', '-y', 'output.mp3'],
        },
        { status, progress }
      );
      progress(100);
      status('Finishing…');
      const blob = new Blob([data], { type: 'audio/mpeg' });
      const baseName = file.name.replace(/\.[^.]+$/, '');
      return createDownload(blob, `${baseName}.mp3`);
    },
  });
}

export { EXT_TO_CODEC };