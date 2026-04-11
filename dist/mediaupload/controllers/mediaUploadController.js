"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMediaUpload = handleMediaUpload;
const cloudinary_1 = require("../../utils/cloudinary");
async function handleMediaUpload(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }
        const result = await (0, cloudinary_1.uploadToCloudinary)(req.file.path, {
            folder: "magicreel/media",
            resource_type: "image",
        });
        return res.status(200).json({
            success: true,
            secure_url: result.secure_url,
            url: result.secure_url,
        });
    }
    catch (error) {
        console.error("UPLOAD ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Upload failed",
        });
    }
}
