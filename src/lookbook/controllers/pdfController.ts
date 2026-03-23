import { Request, Response } from 'express';
import { generateLookbookPdf } from '../services/pdfService';

export async function createLookbookPdf(req: Request, res: Response) {
  try {
    const { pages, meta } = req.body;

    if (!Array.isArray(pages) || pages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'pages[] is required',
      });
    }

    const result = await generateLookbookPdf({ pages, meta });

    return res.json({
      success: true,
      message: 'PDF generated successfully',
      data: {
        pdfUrl: result.pdfUrl,
        publicId: result.publicId,
      },
    });
  } catch (err: any) {
    console.error('[PDF] Error:', err?.message || err);
    return res.status(500).json({
      success: false,
      message: 'PDF generation failed',
      error: err?.message || 'Internal server error',
    });
  }
}
