"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const streamifier_1 = __importDefault(require("streamifier"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)();
router.post("/garment-upload", upload.single("garment"), async (req, res) => {
    try {
        const file = req.file;
        if (!file)
            return res.status(400).json({ success: false, error: "No file uploaded" });
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder: "magicreel/garments" }, (error, result) => {
            if (error)
                return res.status(500).json({ success: false, error });
            return res.json({
                success: true,
                data: { garmentUrl: result.secure_url },
            });
        });
        streamifier_1.default.createReadStream(file.buffer).pipe(uploadStream);
    }
    catch (err) {
        console.error("GARMENT UPLOAD ERROR:", err);
        res.status(500).json({ success: false, error: "Upload failed" });
    }
});
exports.default = router;
