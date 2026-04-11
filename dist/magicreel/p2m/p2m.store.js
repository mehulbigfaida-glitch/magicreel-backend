"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.P2MStore = void 0;
const prisma_1 = require("../db/prisma");
exports.P2MStore = {
    createJob: async (data) => {
        return prisma_1.prisma.productToModelJob.create({
            data: {
                userId: data.userId, // ✅ FIX (required by schema)
                productImageUrl: data.productImageUrl,
                modelImageUrl: data.modelImageUrl,
                engine: data.engine,
                engineJobId: data.engineJobId,
                status: "running", // ✅ keep as string
            },
        });
    },
    getJob: async (id) => {
        return prisma_1.prisma.productToModelJob.findUnique({
            where: { id },
        });
    },
    updateStatus: async (id, status, payload) => {
        return prisma_1.prisma.productToModelJob.update({
            where: { id },
            data: {
                status: status, // ✅ FIX type issue
                resultImageUrl: payload?.resultImageUrl,
                error: payload?.error,
            },
        });
    },
};
