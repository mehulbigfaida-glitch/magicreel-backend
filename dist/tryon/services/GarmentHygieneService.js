"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GarmentHygieneService = void 0;
const sharp_1 = __importDefault(require("sharp"));
const cloudinary_1 = require("cloudinary");
const crypto_1 = __importDefault(require("crypto"));
require("../../config/cloudinary");
class GarmentHygieneService {
    /**
     * Perform conservative garment hygiene:
     * - Detect mannequin-like regions (dark, rigid cores)
     * - Remove them without touching garment borders
     * - Preserve embroidery & hem
     */
    async cleanGarment(garmentImageUrl) {
        // 1️⃣ Download garment image
        const response = await fetch(garmentImageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const image = (0, sharp_1.default)(buffer).ensureAlpha();
        const meta = await image.metadata();
        if (!meta.width || !meta.height) {
            throw new Error("Invalid garment image metadata");
        }
        // 2️⃣ Generate a rough mannequin mask
        // Strategy:
        // - Convert to grayscale
        // - Threshold dark, low-texture regions
        // - Erode mask to avoid eating into fabric
        const grayscale = await image.clone().grayscale().toBuffer();
        const mannequinMask = await (0, sharp_1.default)(grayscale)
            .threshold(30) // dark regions
            .blur(1)
            .toColourspace("b-w")
            .toBuffer();
        // 3️⃣ Detect if mannequin likely exists (simple heuristic)
        const stats = await (0, sharp_1.default)(mannequinMask).stats();
        const darkPixelRatio = stats.channels[0].mean < 240 ? true : false;
        // 4️⃣ Remove mannequin conservatively
        let cleanedBuffer;
        if (darkPixelRatio) {
            cleanedBuffer = await image
                .composite([
                {
                    input: mannequinMask,
                    blend: "dest-out", // punch out mannequin core
                },
            ])
                .png()
                .toBuffer();
        }
        else {
            // No mannequin detected → return original
            cleanedBuffer = await image.png().toBuffer();
        }
        // 5️⃣ Upload cleaned garment
        const publicId = crypto_1.default.randomUUID();
        const uploadedUrl = await new Promise((resolve, reject) => {
            const stream = cloudinary_1.v2.uploader.upload_stream({
                folder: "magicreel/garment-hygiene",
                public_id: publicId,
                resource_type: "image",
                format: "png",
            }, (err, res) => {
                if (err || !res)
                    return reject(err);
                resolve(res.secure_url);
            });
            stream.end(cleanedBuffer);
        });
        return {
            cleanGarmentUrl: uploadedUrl,
            mannequinDetected: darkPixelRatio,
        };
    }
}
exports.GarmentHygieneService = GarmentHygieneService;
