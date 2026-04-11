"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = void 0;
exports.uploadToCloudinary = uploadToCloudinary;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const fs_1 = __importDefault(require("fs"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
async function uploadToCloudinary(localFilePath, options) {
    const result = await cloudinary_1.v2.uploader.upload(localFilePath, {
        folder: options.folder,
        public_id: options.public_id,
        overwrite: options.overwrite ?? true,
    });
    if (fs_1.default.existsSync(localFilePath)) {
        fs_1.default.unlinkSync(localFilePath);
    }
    return {
        secure_url: result.secure_url,
    };
}
