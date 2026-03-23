// src/video/director/utils/audioMerge.utils.ts

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import getFfmpegPath from '../../../utils/ffmpegPath'; // ✔ default import

export const concatenateAudioFiles = async (
  filePaths: string[],
  outputPath: string
): Promise<void> => {
  if (!filePaths.length) {
    throw new Error("No audio files provided for concatenation.");
  }

  const ffmpeg = getFfmpegPath(); // ✔ correct usage
  const tempList = `${outputPath}.txt`;

  const listContent = filePaths.map((p) => `file '${p.replace(/'/g, "'\\''")}'`).join('\n');
  await fs.promises.writeFile(tempList, listContent, 'utf8');

  const cmd = `"${ffmpeg}" -y -f concat -safe 0 -i "${tempList}" -acodec copy "${outputPath}"`;

  await new Promise<void>((resolve, reject) => {
    exec(cmd, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  await fs.promises.unlink(tempList).catch(() => {});
};
