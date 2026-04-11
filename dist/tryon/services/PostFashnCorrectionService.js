"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostFashnCorrectionService = void 0;
const sharp_1 = __importDefault(require("sharp"));
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const cloudinary_1 = require("cloudinary");
const EdgeSealService_1 = require("./EdgeSealService");
class PostFashnCorrectionService {
    async correct(input) {
        // --------------------------------------------------
        // 1️⃣ Download base image
        // --------------------------------------------------
        const baseImageBuffer = Buffer.from((await axios_1.default.get(input.baseImageUrl, {
            responseType: "arraybuffer",
        })).data);
        // --------------------------------------------------
        // 2️⃣ Download garment mask
        // --------------------------------------------------
        const garmentMaskBuffer = Buffer.from((await axios_1.default.get(input.garmentMaskUrl, {
            responseType: "arraybuffer",
        })).data);
        // --------------------------------------------------
        // 3️⃣ Apply garment mask (alpha composite)
        // --------------------------------------------------
        const gravityAdjusted = await (0, sharp_1.default)(baseImageBuffer)
            .composite([
            {
                input: garmentMaskBuffer,
                blend: "dest-in",
            },
        ])
            .png()
            .toBuffer();
        // --------------------------------------------------
        // 4️⃣ EDGE SEAL (POST-OUTPUT POLISH ONLY)
        // --------------------------------------------------
        const sealedBuffer = await EdgeSealService_1.EdgeSealService.seal(gravityAdjusted);
        // --------------------------------------------------
        // 5️⃣ Upload final image
        // --------------------------------------------------
        const publicId = crypto_1.default.randomUUID();
        const finalUrl = await new Promise((resolve, reject) => {
            const stream = cloudinary_1.v2.uploader.upload_stream({
                folder: "magicreel/post-corrected",
                public_id: publicId,
                resource_type: "image",
                format: "png",
            }, (err, res) => {
                if (err || !res)
                    return reject(err);
                resolve(res.secure_url);
            });
            stream.end(sealedBuffer);
        });
        return {
            finalImageUrl: finalUrl,
        };
    }
}
exports.PostFashnCorrectionService = PostFashnCorrectionService;
