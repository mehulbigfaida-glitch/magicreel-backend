// src/lookbook/routes/lookbook.ts

import { Router } from "express";
import {
  generateLookbookImagesController,
  generateLookbookPdf,
  generateLookbookVideo,
} from "../controllers/lookbookController";

const router = Router();

// ---- Image Generation ----
router.post("/images", generateLookbookImagesController);

// ---- PDF Generation ----
router.post("/pdf", generateLookbookPdf);

// ---- Video Generation ----
router.post("/video", generateLookbookVideo);

export default router;
