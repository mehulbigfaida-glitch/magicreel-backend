"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryonRoutes = void 0;
const express_1 = require("express");
const prisma_1 = require("../db/prisma");
const schema_1 = require("../schema");
const router = (0, express_1.Router)();
exports.tryonRoutes = router;
router.post("/base", async (req, res) => {
    const { garmentId, modelId } = req.body;
    const garment = await prisma_1.prisma.garment.findUnique({
        where: { id: garmentId }
    });
    const model = schema_1.MODELS[modelId];
    if (!garment || !model) {
        return res.status(404).json({ error: "Invalid input" });
    }
    res.json({
        basePose: "front",
        modelImageUrl: model.basePoseImages.front,
        garmentImageUrl: garment.frontImageUrl
    });
});
