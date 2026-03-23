// src/lookbook/services/lookbookPdfService.ts

import fs from 'fs';
import path from 'path';

export const generateLookbookPdf = async (
  jobId: string,
  imageUrls: string[],
  preset?: string,
  title?: string
): Promise<string> => {
  const baseDir = path.join(process.cwd(), 'storage', 'lookbook', jobId);
  await fs.promises.mkdir(baseDir, { recursive: true });

  const pdfPath = path.join(baseDir, 'lookbook.pdf');

  await fs.promises.writeFile(
    pdfPath,
    Buffer.from(`PDF for job ${jobId} with ${imageUrls.length} images`),
    'utf8'
  );

  return pdfPath;
};
