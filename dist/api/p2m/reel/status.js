"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReelStatus = getReelStatus;
const prisma_1 = require("../../../magicreel/db/prisma");
const db = prisma_1.prisma;
async function getReelStatus(req, res) {
    try {
        const { jobId } = req.params;
        const job = await db.reelJob.findUnique({
            where: { id: jobId },
        });
        if (!job) {
            return res.json({ status: "processing" });
        }
        if (job.status === "completed") {
            return res.json({
                status: "completed",
                reelVideoUrl: job.reelVideoUrl,
            });
        }
        if (job.status === "failed") {
            return res.json({ status: "failed" });
        }
        return res.json({ status: "processing" });
    }
    catch (error) {
        console.error("Reel status error:", error);
        return res.status(500).json({
            error: "Status check failed",
        });
    }
}
