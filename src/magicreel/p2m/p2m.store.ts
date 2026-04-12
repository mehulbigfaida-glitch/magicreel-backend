import { prisma } from "../db/prisma";
import { P2MStatus } from "./p2m.types";

export const P2MStore = {
  createJob: async (data: {
    productImageUrl: string;
    modelImageUrl: string;
    engine: string;
    engineJobId: string;
    userId: string; // ✅ REQUIRED
  }) => {
    return prisma.productToModelJob.create({
      data: {
        productImageUrl: data.productImageUrl,
        modelImageUrl: data.modelImageUrl,
        engine: data.engine,
        engineJobId: data.engineJobId,
        status: "running",

        // ✅ FIX: attach user
        user: {
          connect: { id: data.userId },
        },
      },
    });
  },

  getJob: async (id: string) => {
    return prisma.productToModelJob.findUnique({
      where: { id },
    });
  },

  updateStatus: async (
    id: string,
    status: P2MStatus,
    payload?: { resultImageUrl?: string; error?: string }
  ) => {
    return prisma.productToModelJob.update({
      where: { id },
      data: {
        status: String(status), // ✅ FIX enum → string
        resultImageUrl: payload?.resultImageUrl,
        error: payload?.error,
      },
    });
  },
};