"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
const uuid_1 = require("uuid");
const uploadImage = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }
        // STEP 1 — Upload to Cloudinary
        const result = await cloudinary_1.default.uploader.upload(file.path, {
            folder: "magicreel/models",
            resource_type: "image",
        });
        // STEP 2 — Generate model ID
        const modelId = (0, uuid_1.v4)();
        // STEP 3 — Return shape expected by frontend
        return res.json({
            success: true,
            data: {
                modelId,
                modelImageUrl: result.secure_url,
            },
        });
    }
    catch (error) {
        console.error("❌ Upload Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Upload failed",
            error: error.message,
        });
    }
};
exports.uploadImage = uploadImage;
