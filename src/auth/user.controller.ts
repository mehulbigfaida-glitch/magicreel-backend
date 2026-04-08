import { Request, Response } from "express";
import { prisma } from "../magicreel/db/prisma";

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        plan: true,
        creditsAvailable: true,
        freeHeroUsed: true,
        subscriptionType: true,
        subscriptionEnd: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);

  } catch (err) {
    console.error("GET CURRENT USER ERROR:", err);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
};