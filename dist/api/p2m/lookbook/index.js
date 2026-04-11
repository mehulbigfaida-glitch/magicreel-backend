"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generate_v2_1 = require("./generate-v2");
const status_1 = require("./status");
const export_1 = require("./export");
const billing_middleware_1 = require("../../../billing/billing.middleware");
const jwt_middleware_1 = require("../../../auth/jwt.middleware");
const router = (0, express_1.Router)();
/* -------------------------------
   LOOKBOOK GENERATION
-------------------------------- */
router.post("/generate-v2", jwt_middleware_1.authenticate, (0, billing_middleware_1.billingGuard)("LOOKBOOK_ECOM"), generate_v2_1.generateLookbookV2);
/* -------------------------------
   STATUS
-------------------------------- */
router.get("/status", jwt_middleware_1.authenticate, status_1.getLookbookStatus);
/* -------------------------------
   EXPORT (SAFE WRAP)
-------------------------------- */
router.post("/export", jwt_middleware_1.authenticate, (req, res) => (0, export_1.exportLookbook)(req, res) // ✅ prevents undefined crash
);
exports.default = router;
