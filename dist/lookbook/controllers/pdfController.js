"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLookbookPdf = createLookbookPdf;
const pdfService_1 = require("../services/pdfService");
async function createLookbookPdf(req, res) {
    try {
        const { pages, meta } = req.body;
        if (!Array.isArray(pages) || pages.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'pages[] is required',
            });
        }
        const result = await (0, pdfService_1.generateLookbookPdf)({ pages, meta });
        return res.json({
            success: true,
            message: 'PDF generated successfully',
            data: {
                pdfUrl: result.pdfUrl,
                publicId: result.publicId,
            },
        });
    }
    catch (err) {
        console.error('[PDF] Error:', err?.message || err);
        return res.status(500).json({
            success: false,
            message: 'PDF generation failed',
            error: err?.message || 'Internal server error',
        });
    }
}
