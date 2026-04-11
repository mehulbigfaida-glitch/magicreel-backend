"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadModel = uploadModel;
const streamifier_1 = __importDefault(require("streamifier"));
const cloudinary_1 = require("../../utils/cloudinary");
async function uploadModel(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "No image uploaded",
            });
        }
        // Convert Buffer → Stream
        const bufferStream = streamifier_1.default.createReadStream(req.file.buffer);
        // Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary_1.cloudinary.uploader.upload_stream({
                folder: "magicreel/models",
                resource_type: "image",
            }, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
            bufferStream.pipe(stream);
        });
        const modelId = uploadResult.public_id;
        const modelImageUrl = uploadResult.secure_url;
        return res.json({
            success: true,
            data: {
                modelId,
                modelImageUrl,
            },
        });
    }
    catch (error) {
        console.error("❌ MODEL UPLOAD FAILED:", error);
        return res.status(500).json({
            success: false,
            error: "Model upload failed",
        });
    }
}
