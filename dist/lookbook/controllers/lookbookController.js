"use strict";
// src/lookbook/controllers/lookbookController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLookbookImagesController = generateLookbookImagesController;
exports.generateLookbookPdf = generateLookbookPdf;
exports.generateLookbookVideo = generateLookbookVideo;
const lookbookImageService_1 = require("../services/lookbookImageService");
const lookbookPdfService_1 = require("../services/lookbookPdfService");
const lookbookVideoService_1 = require("../services/lookbookVideoService");
// --------------------------------------
// IMAGES (5 + 1 LOOKBOOK PRESET)
// --------------------------------------
async function generateLookbookImagesController(req, res) {
    try {
        const images = await (0, lookbookImageService_1.generateLookbookImages)(req.body);
        res.json({ success: true, images });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Lookbook image generation failed",
        });
    }
}
// --------------------------------------
// PDF (expects imageUrls[] → string)
// --------------------------------------
async function generateLookbookPdf(req, res) {
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
        const pdf = await (0, lookbookPdfService_1.generateLookbookPdf)(imageUrlsString, options);
        res.json({ success: true, pdf });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Lookbook PDF generation failed",
        });
    }
}
// --------------------------------------
// VIDEO (expects imageUrls[] → string)
// --------------------------------------
async function generateLookbookVideo(req, res) {
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
        const video = await (0, lookbookVideoService_1.generateLookbookVideo)(imageUrlsString, options);
        res.json({ success: true, video });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Lookbook video generation failed",
        });
    }
}
