// src/lookbook/controllers/lookbookController.ts

import { Request, Response } from "express";
import { generateLookbookImages } from "../services/lookbookImageService";
import {
  generateLookbookPdf as generateLookbookPdfService,
} from "../services/lookbookPdfService";
import {
  generateLookbookVideo as generateLookbookVideoService,
} from "../services/lookbookVideoService";

// --------------------------------------
// IMAGES (5 + 1 LOOKBOOK PRESET)
// --------------------------------------
export async function generateLookbookImagesController(
  req: Request,
  res: Response
) {
  try {
    const images = await generateLookbookImages(req.body);
    res.json({ success: true, images });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Lookbook image generation failed",
    });
  }
}

// --------------------------------------
// PDF (expects imageUrls[] → string)
// --------------------------------------
export async function generateLookbookPdf(
  req: Request,
  res: Response
) {
  try {
    const { imageUrls, options } = req.body;

    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      return res.status(400).json({
        success: false,
        message: "imageUrls[] is required to generate PDF",
      });
    }

    // 🔑 FIX: service expects STRING, not array
    const imageUrlsString = imageUrls.join(",");

    const pdf = await generateLookbookPdfService(
      imageUrlsString,
      options
    );

    res.json({ success: true, pdf });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Lookbook PDF generation failed",
    });
  }
}

// --------------------------------------
// VIDEO (expects imageUrls[] → string)
// --------------------------------------
export async function generateLookbookVideo(
  req: Request,
  res: Response
) {
  try {
    const { imageUrls, options } = req.body;

    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      return res.status(400).json({
        success: false,
        message: "imageUrls[] is required to generate video",
      });
    }

    // 🔑 FIX: service expects STRING, not array
    const imageUrlsString = imageUrls.join(",");

    const video = await generateLookbookVideoService(
      imageUrlsString,
      options
    );

    res.json({ success: true, video });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Lookbook video generation failed",
    });
  }
}
