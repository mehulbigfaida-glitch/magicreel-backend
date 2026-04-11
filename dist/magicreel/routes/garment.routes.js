"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.garmentRoutes = void 0;
const express_1 = require("express");
const prisma_1 = __importDefault(require("../db/prisma"));
const jwt_middleware_1 = require("../../auth/jwt.middleware");
const router = (0, express_1.Router)();
exports.garmentRoutes = router;
// 🔐 Require authentication
router.post("/upload", jwt_middleware_1.authenticate, async (req, res) => {
    const user = req.user;
    const { frontImageUrl, backImageUrl, category } = req.body;
    if (!frontImageUrl) {
        return res.status(400).json({ error: "frontImageUrl required" });
    }
    if (!category) {
        return res.status(400).json({ error: "category required" });
    }
    try {
        const garment = await prisma_1.default.garment.create({
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
    }
    catch (error) {
        console.error("Garment create error:", error);
        return res.status(500).json({ error: "Failed to create garment" });
    }
});
