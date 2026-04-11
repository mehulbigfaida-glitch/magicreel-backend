"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.preprocessGarmentForAvatar = preprocessGarmentForAvatar;
const crypto_1 = __importDefault(require("crypto"));
const sharp_1 = __importDefault(require("sharp"));
const cloudinary_1 = require("cloudinary");
require("../../config/cloudinary");
async function uploadBufferToCloudinary(buffer, folder, publicId) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.v2.uploader.upload_stream({
            folder,
            public_id: publicId,
            resource_type: "image",
            format: "png",
        }, (err, res) => {
            if (err || !res)
                return reject(err);
            resolve(res.secure_url);
        });
        stream.end(buffer);
    });
}
/**
 * 🔒 LENGTH-LOCKED GARMENT PREPROCESS (v2)
 */
async function preprocessGarmentForAvatar(garmentUrl, _avatarId = "generic") {
    console.log("👗 [Garment Preprocess v2] START:", garmentUrl);
    try {
        // 1️⃣ Download garment as BUFFER (TYPE-SAFE)
        const response = await fetch(garmentUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buf = Buffer.from(new Uint8Array(arrayBuffer));
        // 2️⃣ Resize garment (width constrained, height free)
        const resized = await (0, sharp_1.default)(buf)
            .ensureAlpha()
            .resize({
            width: 900,
            fit: "inside",
            withoutEnlargement: true,
        })
            .toBuffer();
        // 3️⃣ Force FLOOR-LENGTH canvas
        const FINAL_WIDTH = 1024;
        const FINAL_HEIGHT = 1600;
        const padded = await (0, sharp_1.default)({
            create: {
                width: FINAL_WIDTH,
                height: FINAL_HEIGHT,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 },
            },
        })
            .composite([
            {
                input: resized,
                gravity: "south", // hem anchored
            },
        ])
            .png()
            .toBuffer();
        // 4️⃣ Upload
        const id = crypto_1.default.randomUUID();
        const url = await uploadBufferToCloudinary(padded, "magicreel/preprocessed-garments", id);
        console.log("✅ Garment length locked:", url);
        return url;
    }
    catch (err) {
        console.error("❌ Garment preprocess failed:", err);
        return garmentUrl;
    }
}
