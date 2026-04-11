"use strict";
// src/lookbook/services/fashn.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTryOnJob = startTryOnJob;
exports.pollJobStatus = pollJobStatus;
const axios_1 = __importDefault(require("axios"));
const FASHN_KEY = process.env.FASHN_API_KEY;
const BASE_URL = "https://api.fashn.ai/v1";
if (!FASHN_KEY) {
    throw new Error("FASHN_API_KEY missing at runtime");
}
// --------------------------------------------
// START TRY-ON JOB (v1.6 – OFFICIAL)
// --------------------------------------------
async function startTryOnJob(input) {
    const response = await axios_1.default.post(`${BASE_URL}/run`, {
        model_name: "tryon-v1.6",
        inputs: {
            model_image: input.modelImageUrl,
            garment_image: input.garmentImageUrl,
        },
    }, {
        headers: {
            Authorization: `Bearer ${FASHN_KEY}`, // ✅ CORRECT
            "Content-Type": "application/json",
        },
        timeout: 60000,
    });
    if (!response.data?.id) {
        throw new Error("FASHN did not return job id");
    }
    return { jobId: response.data.id };
}
// --------------------------------------------
// POLL JOB STATUS
// --------------------------------------------
async function pollJobStatus(jobId) {
    while (true) {
        const response = await axios_1.default.get(`${BASE_URL}/status/${jobId}`, {
            headers: {
                Authorization: `Bearer ${FASHN_KEY}`, // ✅ CORRECT
            },
            timeout: 60000,
        });
        const data = response.data;
        if (data.status === "completed") {
            const imageUrl = data?.output?.[0];
            if (!imageUrl) {
                throw new Error("No image URL returned by FASHN");
            }
            return { imageUrl, raw: data };
        }
        if (data.status === "failed") {
            throw new Error(data?.error?.message || "FASHN job failed");
        }
        await new Promise((r) => setTimeout(r, 2000));
    }
}
