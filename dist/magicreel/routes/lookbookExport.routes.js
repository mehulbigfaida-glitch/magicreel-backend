"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const archiver_1 = __importDefault(require("archiver"));
const axios_1 = __importDefault(require("axios"));
const jwt_middleware_1 = require("../../auth/jwt.middleware");
const prisma_1 = require("../db/prisma");
const router = express_1.default.Router();
/*
  POST /api/lookbook/export
*/
router.post("/lookbook/export", jwt_middleware_1.authenticate, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({
                error: "User not found",
            });
        }
        if (user.plan === "FREE") {
            return res.status(403).json({
                error: "Upgrade required for export",
            });
        }
        const { images } = req.body;
        if (!images || !Array.isArray(images)) {
            return res.status(400).json({
                error: "Invalid images payload",
            });
        }
        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", "attachment; filename=magicreel-campaign-pack.zip");
        const archive = (0, archiver_1.default)("zip", {
            zlib: { level: 9 },
        });
        archive.pipe(res);
        for (let i = 0; i < images.length; i++) {
            const imageUrl = images[i];
            try {
                const response = await axios_1.default.get(imageUrl, { responseType: "arraybuffer" });
                archive.append(response.data, {
                    name: `look_${i + 1}.jpg`,
                });
            }
            catch (err) {
                console.error("Failed to fetch image:", imageUrl);
            }
        }
        await archive.finalize();
    }
    catch (err) {
        console.error("LOOKBOOK EXPORT ERROR:", err);
        res.status(500).json({
            error: "Export failed",
        });
    }
});
exports.default = router;
