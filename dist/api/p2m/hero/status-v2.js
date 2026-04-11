"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHeroStatusV2 = getHeroStatusV2;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prisma_1 = require("../../../magicreel/db/prisma");
const cloudinary_1 = require("../../../config/cloudinary");
const FASHN_STATUS_URL = "https://api.fashn.ai/v1/status";
const FASHN_API_KEY = process.env.FASHN_API_KEY;
async function getHeroStatusV2(req, res) {
    try {
        const { runId } = req.params;
        if (!runId) {
            res.status(400).json({ error: "Missing runId" });
            return;
        }
        // -------------------------------------------------
        // 1️⃣ Check DB first (avoid unnecessary FASHN calls)
        // -------------------------------------------------
        const existingJob = await prisma_1.prisma.productToModelJob.findFirst({
            where: { engineJobId: runId },
        });
        if (existingJob?.resultImageUrl) {
            res.json({
                status: "completed",
                heroBaseUrl: existingJob.resultImageUrl,
                heroPreviewUrl: existingJob.resultImageUrl,
            });
            return;
        }
        // -------------------------------------------------
        // 2️⃣ Ask FASHN for job status
        // -------------------------------------------------
        const response = await axios_1.default.get(`${FASHN_STATUS_URL}/${runId}`, {
            headers: {
                Authorization: `Bearer ${FASHN_API_KEY}`,
            },
        });
        const data = response.data;
        if (data.status !== "completed") {
            res.json(data);
            return;
        }
        const fashnImageUrl = data.output?.[0];
        if (!fashnImageUrl) {
            res.status(500).json({
                error: "Hero output missing from FASHN",
            });
            return;
        }
        // -------------------------------------------------
        // 3️⃣ Download FASHN image locally
        // -------------------------------------------------
        const tmpDir = path_1.default.join(process.cwd(), "tmp");
        if (!fs_1.default.existsSync(tmpDir)) {
            fs_1.default.mkdirSync(tmpDir);
        }
        const localPath = path_1.default.join(tmpDir, `${runId}.png`);
        const imageResponse = await (0, axios_1.default)({
            url: fashnImageUrl,
            method: "GET",
            responseType: "stream",
        });
        const writer = fs_1.default.createWriteStream(localPath);
        imageResponse.data.pipe(writer);
        await new Promise((resolve, reject) => {
            writer.on("finish", () => resolve());
            writer.on("error", (err) => reject(err));
        });
        // -------------------------------------------------
        // 4️⃣ Upload to Cloudinary (white-label storage)
        // -------------------------------------------------
        const uploadResult = await (0, cloudinary_1.uploadToCloudinary)(localPath, {
            folder: "magicreel/heroes",
            public_id: runId,
        });
        const cloudinaryUrl = uploadResult.secure_url;
        // -------------------------------------------------
        // 5️⃣ Update database
        // -------------------------------------------------
        await prisma_1.prisma.productToModelJob.updateMany({
            where: {
                engineJobId: runId,
            },
            data: {
                status: "completed",
                resultImageUrl: cloudinaryUrl,
            },
        });
        // -------------------------------------------------
        // 6️⃣ Return result
        // -------------------------------------------------
        res.json({
            status: "completed",
            heroBaseUrl: cloudinaryUrl,
            heroPreviewUrl: cloudinaryUrl,
        });
    }
    catch (err) {
        console.error("HERO STATUS ERROR:", err?.response?.data || err);
        res.status(500).json({
            error: err?.message || "Hero status failed",
        });
    }
}
