"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FashnService = void 0;
const axios_1 = __importDefault(require("axios"));
const cloudinary_1 = require("cloudinary");
const FASHN_RUN_URL = "https://api.fashn.ai/v1/run";
const FASHN_STATUS_URL = "https://api.fashn.ai/v1/status";
const FASHN_API_KEY = process.env.FASHN_API_KEY;
if (!process.env.FASHN_API_KEY) {
    console.warn("⚠️ FASHN_API_KEY is not set - Fashn disabled");
}
/**
 * Cloudinary Configuration
 */
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
/**
 * FashnService
 * --------------------------------
 * Canonical FASHN orchestrator for MagicReel
 *
 * Responsibilities:
 * - Execute Product-to-Model job
 * - Poll FASHN status
 * - Intercept vendor image
 * - Upload image to Cloudinary
 * - Return secure MagicReel image URL
 */
class FashnService {
    /**
     * Execute Product-to-Model render
     * Returns runId
     */
    async runProductToModel(job) {
        const response = await axios_1.default.post(FASHN_RUN_URL, {
            model_name: "product-to-model",
            inputs: {
                product_image: job.garmentImageUrl,
                model_image: job.modelImageUrl,
                prompt: job.prompt,
                output_format: "png",
                return_base64: false
            }
        }, {
            headers: {
                Authorization: `Bearer ${FASHN_API_KEY}`,
                "Content-Type": "application/json"
            }
        });
        if (!response.data?.id) {
            throw new Error("FASHN did not return runId");
        }
        return response.data.id;
    }
    /**
     * Upload image to Cloudinary
     */
    async uploadToCloudinary(imageUrl) {
        const result = await cloudinary_1.v2.uploader.upload(imageUrl, {
            folder: "magicreel/heroes",
            resource_type: "image",
            format: "png"
        });
        if (!result.secure_url) {
            throw new Error("Cloudinary upload failed");
        }
        return result.secure_url;
    }
    /**
     * Poll FASHN job status
     * Intercepts vendor image when complete
     */
    async pollStatus(runId) {
        const response = await axios_1.default.get(`${FASHN_STATUS_URL}/${runId}`, {
            headers: {
                Authorization: `Bearer ${FASHN_API_KEY}`
            }
        });
        const data = response.data;
        /**
         * When job completes
         * Intercept vendor CDN image
         * Upload to Cloudinary
         */
        if (data.status === "completed" && data.output?.length) {
            const vendorImageUrl = data.output[0];
            try {
                const cloudinaryUrl = await this.uploadToCloudinary(vendorImageUrl);
                return {
                    status: "completed",
                    output: [cloudinaryUrl]
                };
            }
            catch (error) {
                console.error("Cloudinary upload failed:", error);
                return {
                    status: "failed",
                    error: "Cloudinary upload failed"
                };
            }
        }
        return data;
    }
}
exports.FashnService = FashnService;
