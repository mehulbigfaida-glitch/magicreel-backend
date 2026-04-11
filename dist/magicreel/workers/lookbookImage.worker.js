"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lookbookQueue_1 = require("../../queues/lookbookQueue");
const prisma_1 = require("../db/prisma");
console.log("🧠 lookbookImage.worker loaded");
lookbookQueue_1.lookbookImageQueue.process("render", async (job) => {
    const { lookbookId, renderId } = job.data;
    console.log("📥 Job received", { lookbookId, renderId });
    await prisma_1.prisma.render.update({
        where: { id: renderId },
        data: { status: "PROCESSING" },
    });
    await new Promise((r) => setTimeout(r, 1000));
    const outputImageUrl = `https://dummyimage.com/600x900/000/fff&text=${renderId.slice(0, 6)}`;
    await prisma_1.prisma.render.update({
        where: { id: renderId },
        data: {
            status: "DONE",
            outputImageUrl,
        },
    });
    const pending = await prisma_1.prisma.render.count({
        where: { lookbookId, status: { not: "DONE" } },
    });
    if (pending === 0) {
        await prisma_1.prisma.lookbook.update({
            where: { id: lookbookId },
            data: { status: "READY" },
        });
        console.log("✅ Lookbook READY", lookbookId);
    }
});
