"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: "uploads/" });
router.post("/audio", upload.single("audio"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No audio file uploaded",
            });
        }
        const result = await cloudinary_1.v2.uploader.upload(req.file.path, {
            resource_type: "auto",
            folder: "magicreel/audio",
        });
        return res.json({
            success: true,
            url: result.secure_url,
        });
    }
    catch (error) {
        const err = error;
        console.error("Audio upload error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Audio upload failed",
            error: err.message,
        });
    }
});
exports.default = router;
