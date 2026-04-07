import { Router } from "express";
import prisma from "../db/prisma";
import { MODELS } from "../schema";

const router = Router();

router.post("/base", async (req, res) => {
  const { garmentId, modelId } = req.body as {
    garmentId: string;
    modelId: keyof typeof MODELS;
  };

  const garment = await prisma.garment.findUnique({
    where: { id: garmentId }
  });

  const model = MODELS[modelId];

  if (!garment || !model) {
    return res.status(404).json({ error: "Invalid input" });
  }

  res.json({
    basePose: "front",
    modelImageUrl: model.basePoseImages.front,
    garmentImageUrl: garment.frontImageUrl
  });
});

export { router as tryonRoutes };
