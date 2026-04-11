"use strict";
// src/tryon/utils/cloudinaryUpload.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBufferToCloudinary = uploadBufferToCloudinary;
const cloudinary_1 = require("cloudinary");
/**
 * Uploads a buffer to Cloudinary and returns the secure URL
 */
async function uploadBufferToCloudinary(buffer, folder) {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader
            .upload_stream({
            folder,
            resource_type: "image"
        }, (error, result) => {
            if (error || !result?.secure_url) {
                return reject(new Error(error?.message || "Cloudinary upload failed"));
            }
            resolve(result.secure_url);
        })
            .end(buffer);
    });
}
