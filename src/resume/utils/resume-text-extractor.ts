// import * as pdfParse from 'pdf-parse';
const pdfParse = require('pdf-parse');

import * as mammoth from 'mammoth';

export async function extractResumeText(
  file: Express.Multer.File,
): Promise<string> {
  const mimeType = file.mimetype;

  // PDF
  if (mimeType === 'application/pdf') {
    // const parsed = await (pdfParse as any)(file.buffer);

    const parsed = await pdfParse(file.buffer);
    return parsed.text;
  }

  // DOCX
  if (
    mimeType ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });

    return result.value;
  }

  // UNSUPPORTED
  throw new Error('Unsupported file format');
}
