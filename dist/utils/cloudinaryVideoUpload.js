"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadVideoToCloudinary = uploadVideoToCloudinary;
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
async function uploadVideoToCloudinary(videoPath) {
    const result = await cloudinary_1.v2.uploader.upload(videoPath, {
        resource_type: "video",
        folder: "magicreel/videos",
        use_filename: true,
        unique_filename: true,
    });
    if (!result.secure_url) {
        throw new Error("Cloudinary upload failed");
    }
    return result.secure_url;
}
