import { Request, Response } from "express";

export async function getCurrentUser(req: Request, res: Response) {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return res.json({
    id: user.id,
    email: user.email,
    plan: user.plan,
    creditsAvailable: user.creditsAvailable,
    freeHeroUsed: user.freeHeroUsed,
    subscriptionType: user.subscriptionType,
    subscriptionEnd: user.subscriptionEnd
  });
}