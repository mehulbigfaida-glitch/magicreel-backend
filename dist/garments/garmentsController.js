"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadGarment = uploadGarment;
const streamifier_1 = __importDefault(require("streamifier"));
const cloudinary_1 = require("../utils/cloudinary");
async function uploadGarment(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "No garment file uploaded",
            });
        }
        const bufferStream = streamifier_1.default.createReadStream(req.file.buffer);
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary_1.cloudinary.uploader.upload_stream({
                folder: "magicreel/garments",
            }, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
            bufferStream.pipe(stream);
        });
        return res.json({
            success: true,
            data: {
                garmentUrl: uploadResult.secure_url,
                garmentId: uploadResult.public_id,
            },
        });
    }
    catch (error) {
        console.error("❌ Garment Upload Failed:", error);
        return res.status(500).json({
            success: false,
            error: "Garment upload failed",
        });
    }
}
