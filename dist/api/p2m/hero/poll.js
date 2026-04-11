"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pollHeroGeneration = pollHeroGeneration;
const prisma_1 = require("../../../magicreel/db/prisma");
const fashn_service_1 = require("../../../magicreel/services/fashn.service");
const cloudinary_1 = require("cloudinary");
const fashn = new fashn_service_1.FashnService();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
async function pollHeroGeneration(req, res) {
    try {
        const { runId } = req.params;
        if (!runId) {
            return res.status(400).json({ error: "runId missing" });
        }
        console.log("Polling hero runId:", runId);
        /* =========================
           FIND JOB (SAFE)
        ========================= */
        let job = await prisma_1.prisma.productToModelJob.findFirst({
            where: {
                engineJobId: runId,
            },
        });
        /* =========================
           JOB NOT FOUND → WAIT (NO CRASH)
        ========================= */
        if (!job) {
            console.warn("Hero job not found yet (DB delay)");
            return res.json({ status: "processing" });
        }
        /* =========================
           RETURN CACHED RESULT
        ========================= */
        if (job.status === "completed" && job.resultImageUrl) {
            return res.json({
                status: "completed",
                imageUrl: job.resultImageUrl,
            });
        }
        /* =========================
           CHECK FASHN STATUS (SAFE)
        ========================= */
        let statusResult;
        try {
            statusResult = await fashn.pollStatus(runId);
        }
        catch (err) {
            console.warn("FASHN poll failed, retrying...");
            return res.json({ status: "processing" });
        }
        if (!statusResult || !statusResult.status) {
            return res.json({ status: "processing" });
        }
        const status = statusResult.status;
        /* =========================
           PROCESSING
        ========================= */
        if (status === "pending" || status === "running") {
            return res.json({ status: "processing" });
        }
        /* =========================
           FAILURE
        ========================= */
        if (status === "failed") {
            await prisma_1.prisma.productToModelJob.update({
                where: { id: job.id },
                data: { status: "failed" },
            });
            return res.json({ status: "failed" });
        }
        /* =========================
           COMPLETED (SAFE OUTPUT)
        ========================= */
        if (status === "completed" || status === "succeeded") {
            const imageUrl = Array.isArray(statusResult.output)
                ? statusResult.output[0]
                : statusResult.output || null;
            if (!imageUrl) {
                console.warn("No image returned yet");
                return res.json({ status: "processing" });
            }
            console.log("Uploading to Cloudinary...");
            const upload = await cloudinary_1.v2.uploader.upload(imageUrl, {
                folder: "magicreel/heroes",
            });
            const cloudinaryUrl = upload.secure_url;
            await prisma_1.prisma.productToModelJob.update({
                where: { id: job.id },
                data: {
                    status: "completed",
                    resultImageUrl: cloudinaryUrl,
                },
            });
            return res.json({
                status: "completed",
                imageUrl: cloudinaryUrl,
            });
        }
        return res.json({ status: "processing" });
    }
    catch (error) {
        console.error("Hero Poll Error:", error);
        // 🔥 NEVER CRASH → ALWAYS SAFE RESPONSE
        return res.json({ status: "processing" });
    }
}
