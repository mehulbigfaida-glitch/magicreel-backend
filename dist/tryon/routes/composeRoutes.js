"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const composeEngine_1 = require("../services/composeEngine");
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    try {
        const { faceImageUrl, garmentImageUrl } = req.body;
        if (!faceImageUrl || !garmentImageUrl) {
            return res.status(400).json({ error: "Missing inputs" });
        }
        const result = await (0, composeEngine_1.runComposeEngine)({
            faceImageUrl,
            garmentImageUrl,
        });
        res.json(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Compose engine failed" });
    }
});
exports.default = router;
