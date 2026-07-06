import { prisma } from "../magicreel/db/prisma";
import { Plan, BillingCycle, Prisma, User } from "@prisma/client";
import { calculateSubscriptionEnd } from "./subscription.utils";

export const SubscriptionService = {
  /**
   * Initializes a FREE subscription.
   *
   * Can be used with either the global Prisma client
   * or an existing transaction.
   */
  async createFreeSubscription(
    userId: string,
    db: Prisma.TransactionClient | typeof prisma = prisma
  ) {
    const start = new Date();
    const end = calculateSubscriptionEnd(start);

    return db.user.update({
      where: { id: userId },
      data: {
        plan: Plan.FREE,
        subscriptionType: BillingCycle.MONTHLY,
        subscriptionStart: start,
        subscriptionEnd: end,
        creditsAvailable: 1,
        freeHeroUsed: false,
      },
    });
  },

  /**
   * Creates or renews a paid subscription.
   *
   * If subscription is still active:
   * - Keep existing billing period.
   * - Add purchased credits.
   *
   * If expired:
   * - Start a new 30-day billing period.
   */
  async activatePlan(
    userId: string,
    plan: Plan,
    credits: number
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const now = new Date();

    const subscriptionStillActive =
      !!user.subscriptionEnd &&
      user.subscriptionEnd > now;

    const data: Prisma.UserUpdateInput = {
      plan,
      creditsAvailable: {
        increment: credits,
      },
    };

    if (!subscriptionStillActive) {
      data.subscriptionType = BillingCycle.MONTHLY;
      data.subscriptionStart = now;
      data.subscriptionEnd = calculateSubscriptionEnd(now);
    }

    return prisma.user.update({
      where: { id: userId },
      data,
    });
  },

  /**
   * Promotional credits allocated by admin.
   */
  async grantPromotionalCredits(
    userId: string,
    credits: number,
    referenceId?: string
  ) {
    return prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          creditsAvailable: {
            increment: credits,
          },
        },
      });

      await tx.creditTransaction.create({
        data: {
          userId,
          feature: "PROMOTIONAL_CREDIT",
          credits,
          type: "CREDIT",
          status: "COMPLETED",
          referenceId,
        },
      });
    });
  },

  /**
   * Grants the Welcome Credit.
   * Intended for first-time onboarding only.
   */
  async grantWelcomeCredit(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.creditsAvailable > 0) {
      return user;
    }

    return prisma.user.update({
      where: { id: userId },
      data: {
        creditsAvailable: 1,
      },
    });
  },

  /**
   * Validates subscription before allowing
   * access to paid functionality.
   */
  async validateSubscription(user: User) {
    if (!user.subscriptionStart || !user.subscriptionEnd) {
      throw new Error("Subscription not found");
    }

    const now = new Date();

    if (user.subscriptionEnd < now) {
      if (user.creditsAvailable > 0) {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            creditsAvailable: 0,
          },
        });
      }

      throw new Error("Subscription expired");
    }

    return true;
  },

  /**
   * Expires a subscription by clearing
   * all usable credits.
   */
  async expireSubscription(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        creditsAvailable: 0,
      },
    });
  },
};