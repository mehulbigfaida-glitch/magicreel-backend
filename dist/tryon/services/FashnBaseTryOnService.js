"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FashnBaseTryOnService = void 0;
const axios_1 = __importDefault(require("axios"));
const sharp_1 = __importDefault(require("sharp"));
const FASHN_RUN_URL = "https://api.fashn.ai/v1/run";
const FASHN_STATUS_URL = "https://api.fashn.ai/v1/status";
const MIN_GARMENT_HEIGHT_RATIO = 0.78;
const MAX_RETRIES = 1;
class FashnBaseTryOnService {
    /* ---------------- START (async) ---------------- */
    async startBaseTryOn(input) {
        const response = await axios_1.default.post(FASHN_RUN_URL, {
            model_name: "tryon-v1.6",
            inputs: {
                model_image: input.modelImageUrl,
                garment_image: input.garmentImageUrl,
                category: input.category ?? "auto",
                garment_photo_type: input.garmentPhotoType ?? "auto",
                segmentation_free: input.segmentationFree ?? true,
                mode: "quality",
                num_samples: 1,
                output_format: "png",
                moderation_level: "permissive",
                seed: 42,
            },
        }, {
            headers: {
                Authorization: `Bearer ${process.env.FASHN_API_KEY}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.data?.id) {
            throw new Error("FASHN did not return prediction ID");
        }
        return { predictionId: response.data.id };
    }
    /* ---------------- POLL RESULT ---------------- */
    async pollBaseTryOn(predictionId) {
        const statusResponse = await axios_1.default.get(`${FASHN_STATUS_URL}/${predictionId}`, {
            headers: {
                Authorization: `Bearer ${process.env.FASHN_API_KEY}`,
            },
        });
        const status = statusResponse.data?.status;
        if (status === "failed") {
            throw new Error(JSON.stringify(statusResponse.data?.error || "FASHN failed"));
        }
        if (status !== "completed") {
            throw new Error("NOT_READY");
        }
        const imageUrl = statusResponse.data?.output?.[0];
        if (!imageUrl) {
            throw new Error("FASHN completed without output");
        }
        const ratio = await this.measureGarmentHeightRatio(imageUrl);
        return {
            imageUrl,
            garmentHeightRatio: ratio,
        };
    }
    /* ---------------- GEOMETRY CHECK ---------------- */
    async measureGarmentHeightRatio(imageUrl) {
        const res = await axios_1.default.get(imageUrl, {
            responseType: "arraybuffer",
        });
        const img = (0, sharp_1.default)(Buffer.from(res.data)).ensureAlpha();
        const meta = await img.metadata();
        if (!meta.width || !meta.height)
            return 0;
        const { data, info } = await img
            .grayscale()
            .raw()
            .toBuffer({ resolveWithObject: true });
        const width = info.width;
        const height = info.height;
        const BG_THRESHOLD = 245;
        let bottomRow = -1;
        for (let y = height - 1; y >= 0; y--) {
            for (let x = 0; x < width; x++) {
                const idx = y * width + x;
                if (data[idx] < BG_THRESHOLD) {
                    bottomRow = y;
                    break;
                }
            }
            if (bottomRow !== -1)
                break;
        }
        if (bottomRow < 0)
            return 0;
        return (bottomRow + 1) / height;
    }
}
exports.FashnBaseTryOnService = FashnBaseTryOnService;
