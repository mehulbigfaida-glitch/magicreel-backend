import { Request, Response, NextFunction } from "express";
import { prisma } from "../magicreel/db/prisma";
import { SubscriptionService } from "./subscription.service";

export async function subscriptionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authUser = (req as any).user;

    if (!authUser?.id) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: authUser.id,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: "User not found",
      });
    }

    await SubscriptionService.validateSubscription(user);

    // Replace lightweight auth user with full user object
    (req as any).user = user;

    // Attach subscription context for future use
    (req as any).subscription = {
      plan: user.plan,
      subscriptionType: user.subscriptionType,
      subscriptionStart: user.subscriptionStart,
      subscriptionEnd: user.subscriptionEnd,
      creditsAvailable: user.creditsAvailable,
    };

    return next();
  } catch (error: any) {
    console.error("SUBSCRIPTION ERROR:", error);

    return res.status(403).json({
      error: error.message || "Subscription inactive",
    });
  }
}