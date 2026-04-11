"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingService = void 0;
const prisma_1 = require("../magicreel/db/prisma");
// temporarily remove enum imports (not needed for now)
exports.BillingService = {
    async deductCreditsAtomic(userId, feature, credits) {
        return await prisma_1.prisma.$transaction(async (tx) => {
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
