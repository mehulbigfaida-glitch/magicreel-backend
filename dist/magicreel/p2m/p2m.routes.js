"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("ENABLE_BILLING:", process.env.ENABLE_BILLING);
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_1 = require("express");
const hero_1 = __importDefault(require("../../api/p2m/hero"));
const lookbook_1 = __importDefault(require("../../api/p2m/lookbook"));
const cinematic_routes_1 = __importDefault(require("./cinematic.routes"));
const billing_middleware_1 = require("../../billing/billing.middleware");
const generate_v1_1 = require("../../api/p2m/reel/generate-v1");
const status_1 = require("../../api/p2m/reel/status");
/* ----------------------------------
   CONFIG FLAGS
---------------------------------- */
const ENABLE_BILLING = process.env.ENABLE_BILLING === "true";
/* ----------------------------------
   SAFE MIDDLEWARE WRAPPER
---------------------------------- */
const optionalBilling = (feature) => {
    if (ENABLE_BILLING) {
        return (0, billing_middleware_1.billingGuard)(feature);
    }
    return (_req, _res, next) => next();
};
/* ----------------------------------
   RATE LIMITER
---------------------------------- */
const heroLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Too many hero generation requests. Please wait a moment.",
    },
});
/* ----------------------------------
   ROUTER
---------------------------------- */
const router = (0, express_1.Router)();
/* ----------------------------------
   🎬 CINEMATIC
---------------------------------- */
router.use("/cinematic", cinematic_routes_1.default);
/* ----------------------------------
   🎬 REEL V1 (3 credits)
---------------------------------- */
router.post("/reel/generate-v1", optionalBilling("REEL"), // ✅ 3 credits
generate_v1_1.generateReelV1Controller);
router.get("/reel/status/:jobId", status_1.getReelStatus);
/* ----------------------------------
   👗 HERO (1 credit)
---------------------------------- */
router.use("/hero", heroLimiter, optionalBilling("HERO"), // ✅ FIX ADDED
hero_1.default);
/* ----------------------------------
   📚 LOOKBOOK (2 credits)
---------------------------------- */
router.use("/lookbook", optionalBilling("LOOKBOOK_ECOM"), // ✅ 2 credits
lookbook_1.default);
exports.default = router;
