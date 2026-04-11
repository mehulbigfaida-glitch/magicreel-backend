"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sealLookbook = sealLookbook;
const prisma_1 = require("../db/prisma");
async function sealLookbook(lookbookId) {
    const lookbook = await prisma_1.prisma.lookbook.findUnique({
        where: { id: lookbookId },
    });
    if (!lookbook) {
        throw new Error("Lookbook not found");
    }
    if (lookbook.status === "sealed") {
        return lookbook;
    }
    return prisma_1.prisma.lookbook.update({
        where: { id: lookbookId },
        data: { status: "sealed" },
    });
}
