import { Router } from "express";
import { prisma } from "../db/prisma";
import { authenticate } from "../../auth/jwt.middleware";

const router = Router();

// 🔐 Require authentication
router.post("/upload", authenticate, async (req, res) => {
  const user = (req as any).user;

  const { frontImageUrl, backImageUrl, category } = req.body;

  if (!frontImageUrl) {
    return res.status(400).json({ error: "frontImageUrl required" });
  }

  if (!category) {
    return res.status(400).json({ error: "category required" });
  }

  try {
    const garment = await prisma.garment.create({
      data: {
        frontImageUrl,
        backImageUrl,
        category,
        validated: true,
        user: {
          connect: { id: user.id }
        }
      },
    });

    return res.json(garment);
  } catch (error: any) {
    console.error("Garment create error:", error);
    return res.status(500).json({ error: "Failed to create garment" });
  }
});

export { router as garmentRoutes };