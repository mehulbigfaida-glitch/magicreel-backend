"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = void 0;
const prisma_1 = require("../magicreel/db/prisma");
const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = await prisma_1.prisma.user.findUnique({
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
    }
    catch (err) {
        console.error("GET CURRENT USER ERROR:", err);
        return res.status(500).json({ error: "Failed to fetch user" });
    }
};
exports.getCurrentUser = getCurrentUser;
