import { prisma } from "../magicreel/db/prisma";
// temporarily remove enum imports (not needed for now)

export const BillingService = {
  async deductCreditsAtomic(
    userId: string,
    feature: string,
    credits: number
  ) {
    
    return await prisma.$transaction(async (tx: any) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      if (user.creditsAvailable < credits) {
        throw new Error("Insufficient credits");
      }

      await tx.user.update({
        where: { id: userId },
        data: {
          creditsAvailable: {
            decrement: credits,
          },
        },
      });

      await tx.creditTransaction.create({
        data: {
          userId,
          feature,
          credits,
          type: "DEBIT",
          status: "SUCCESS"
        },
      });

      return true;
    });
  },
};