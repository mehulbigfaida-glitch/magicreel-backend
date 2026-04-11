import { prisma } from "../db/prisma";
import { P2MStatus } from "./p2m.types";

export const P2MStore = {
  createJob: async (data: {
    userId: string; // ✅ REQUIRED
    productImageUrl: string;
    modelImageUrl: string;
    engine: string;
    engineJobId: string;
  }) => {
    return prisma.productToModelJob.create({
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
        status: status as unknown as string, // ✅ FIX type issue
        resultImageUrl: payload?.resultImageUrl,
        error: payload?.error,
      },
    });
  },
};