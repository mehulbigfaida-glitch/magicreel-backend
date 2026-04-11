"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: "uploads/" });
// IMPORTANT: Route must be "/" because index.ts mounts "/api/upload/audio"
router.post("/", upload.single("audio"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No audio file uploaded",
            });
        }
        const result = await cloudinary_1.default.uploader.upload(req.file.path, {
            resource_type: "auto",
            folder: "magicreel/audio",
        });
        fs_1.default.unlinkSync(req.file.path);
        return res.json({
            success: true,
            url: result.secure_url,
        });
    }
    catch (err) {
        const error = err;
        console.error("Cloudinary audio upload error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Audio upload failed",
            error: error.message,
        });
    }
});
exports.default = router;
