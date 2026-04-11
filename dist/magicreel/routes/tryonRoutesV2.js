"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
/**
 * Deprecated TryOn V2
 * Kept only to avoid breaking old clients
 */
router.post("/run", (_req, res) => {
    res.status(410).json({
        error: "Deprecated. Use /api/p2m instead.",
    });
});
exports.default = router;
