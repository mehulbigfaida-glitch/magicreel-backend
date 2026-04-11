"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportLookbookReel = exportLookbookReel;
const prisma_1 = require("../db/prisma");
async function exportLookbookReel(lookbookId) {
    const lookbook = await prisma_1.prisma.lookbook.findUnique({
        where: { id: lookbookId },
        include: { renders: true },
    });
    if (!lookbook) {
        throw new Error("Lookbook not found");
    }
    if (lookbook.status !== "sealed") {
        throw new Error("Lookbook must be sealed before export");
    }
    // 🔒 V1: trigger-only export (video pipeline already exists)
    return {
        lookbookId: lookbook.id,
        status: "export-queued",
    };
}
