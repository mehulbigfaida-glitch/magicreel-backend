import { Router } from 'express';
import { createLookbookPdf } from '../controllers/pdfController';

const router = Router();

router.post('/generate', createLookbookPdf);

export default router;
