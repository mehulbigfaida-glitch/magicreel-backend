"use strict";
// src/api/p2m/hero/status.ts
// 🔒 HERO STATUS + ENHANCEMENT (PRISMA-ALIGNED)
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHeroStatus = getHeroStatus;
const prisma_1 = require("../../../magicreel/db/prisma");
const fashn_service_1 = require("../../../magicreel/services/fashn.service");
const heroEnhance_service_1 = require("../../../magicreel/services/heroEnhance.service");
async function getHeroStatus(req, res) {
    const { jobId } = req.params;
    // 🔒 jobId maps to Prisma Render.id
    const render = await prisma_1.prisma.render.findUnique({
        where: { id: jobId },
    });
    if (!render) {
        res.status(404).json({ error: "Render job not found" });
        return;
    }
    // 1️⃣ Already completed & enhanced
    if (render.status === "completed" && render.outputImageUrl) {
        res.json({
            status: "completed",
            resultImageUrl: render.outputImageUrl,
        });
        return;
    }
    const fashn = new fashn_service_1.FashnService();
    const fashnStatus = await fashn.pollStatus(render.id);
    // 2️⃣ FASHN still running
    if (fashnStatus.status !== "completed") {
        res.json({
            status: fashnStatus.status === "running"
                ? "fashn_running"
                : "pending",
        });
        return;
    }
    // 3️⃣ FASHN completed → enhance once
    const rawImageUrl = fashnStatus.output?.[0];
    if (!rawImageUrl) {
        res.status(500).json({
            status: "failed",
            error: "FASHN returned no output",
        });
        return;
    }
    // Mark enhancing
    await prisma_1.prisma.render.update({
        where: { id: render.id },
        data: { status: "enhancing" },
    });
    // 🔒 Use existing hero enhancement service
    const enhanced = await (0, heroEnhance_service_1.enhanceHeroImage)({
        jobId: render.id,
        heroBaseUrl: rawImageUrl,
    });
    // Save enhanced result
    await prisma_1.prisma.render.update({
        where: { id: render.id },
        data: {
            status: "completed",
            outputImageUrl: enhanced.heroPreviewUrl,
        },
    });
    res.json({
        status: "completed",
        resultImageUrl: enhanced.heroPreviewUrl,
    });
}
