"use strict";
// FILE: src/billing/billing.middleware.ts (FULL REPLACEMENT)
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalizeBilling = exports.billingGuard = void 0;
exports.checkCreditsOrThrow = checkCreditsOrThrow;
const prisma_1 = require("../magicreel/db/prisma");
const featureCredits = {
    HERO: 1,
    LOOKBOOK_ECOM: 2,
    REEL: 3,
    CINEMATIC_LOOKBOOK: 3,
    CINEMATIC_REEL_10S: 5,
    CINEMATIC_REEL_20S: 10,
};
const DEV_USER_ID = process.env.DEV_USER_ID;
/* ----------------------------------
   BILLING GUARD
---------------------------------- */
const billingGuard = (feature) => {
    return async (req, res, next) => {
        try {
            let user = req.user;
            if (!user) {
                user = await prisma_1.prisma.user.findUnique({
                    where: { id: DEV_USER_ID },
                });
                if (!user) {
                    return res.status(401).json({ error: "Unauthorized" });
                }
                req.user = user;
            }
            const creditsRequired = featureCredits[feature];
            // 🔥 ALWAYS FETCH FRESH CREDITS FROM DB
            const freshUser = await prisma_1.prisma.user.findUnique({
                where: { id: user.id },
            });
            const availableCredits = freshUser?.creditsAvailable ?? 0;
            if (availableCredits < creditsRequired) {
                return res.status(400).json({
                    error: "Insufficient credits",
                });
            }
            req.billing = {
                userId: user.id,
                feature,
                creditsRequired,
            };
            next();
        }
        catch (error) {
            console.error("BILLING ERROR:", error);
            return next();
        }
    };
};
exports.billingGuard = billingGuard;
/* ----------------------------------
   FINALIZE BILLING
---------------------------------- */
const finalizeBilling = async (req) => {
    try {
        const user = req.user;
        if (!user || !user.id)
            return;
        const billing = req.billing;
        if (!billing)
            return;
        const { feature, creditsRequired } = billing;
        await prisma_1.prisma.$transaction([
            prisma_1.prisma.user.update({
                where: { id: user.id },
                data: {
                    creditsAvailable: {
                        decrement: creditsRequired,
                    },
                },
            }),
            prisma_1.prisma.creditTransaction.create({
                data: {
                    userId: user.id,
                    feature,
                    credits: creditsRequired,
                    type: "DEBIT",
                    status: "COMPLETED",
                },
            }),
        ]);
    }
    catch (err) {
        console.error("❌ FINAL BILLING FAILED:", err);
    }
};
exports.finalizeBilling = finalizeBilling;
/* ----------------------------------
   STRICT CHECK (USED BY REEL)
---------------------------------- */
async function checkCreditsOrThrow(req, required) {
    const user = req.user;
    if (!user) {
        const err = new Error("UNAUTHORIZED");
        err.code = "UNAUTHORIZED";
        throw err;
    }
    // 🔥 ALWAYS FETCH FRESH USER
    const freshUser = await prisma_1.prisma.user.findUnique({
        where: { id: user.id },
    });
    const availableCredits = freshUser?.creditsAvailable ?? 0;
    console.log("CREDITS DEBUG:", {
        userId: user.id,
        availableCredits,
        required,
    });
    if (availableCredits < required) {
        const err = new Error("INSUFFICIENT_CREDITS");
        err.code = "INSUFFICIENT_CREDITS";
        err.required = required;
        err.available = availableCredits;
        throw err;
    }
}
