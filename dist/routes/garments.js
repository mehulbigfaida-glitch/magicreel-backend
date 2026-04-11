"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cloudinary_1 = require("../config/cloudinary");
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    try {
        const folder = "magicreel";
        const result = await cloudinary_1.cloudinary.search
            .expression(`folder:${folder}`)
            .sort_by("public_id", "desc")
            .max_results(100)
            .execute();
        const garments = result.resources.map((r) => ({
            image: r.secure_url,
            meta: {
                public_id: r.public_id,
                format: r.format,
                width: r.width,
                height: r.height,
            },
        }));
        return res.json(garments);
    }
    catch (error) {
        console.error("❌ Failed to fetch garments:", error.message);
        return res.status(500).json({
            success: false,
            message: "Could not fetch garments",
            error: error.message,
        });
    }
});
exports.default = router;
