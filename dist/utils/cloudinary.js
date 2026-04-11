"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = void 0;
exports.uploadToCloudinary = uploadToCloudinary;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const path_1 = __importDefault(require("path"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
    secure: true,
});
async function uploadToCloudinary(filePath, options = {}) {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload(filePath, {
            folder: options.folder || '',
            public_id: options.public_id || path_1.default.parse(filePath).name,
            resource_type: options.resource_type || 'image',
        }, (error, result) => {
            if (error)
                reject(error);
            else
                resolve(result);
        });
    });
}
