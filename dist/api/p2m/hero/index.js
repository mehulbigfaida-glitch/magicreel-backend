"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generate_v2_1 = require("./generate-v2");
const poll_1 = require("./poll");
const router = (0, express_1.Router)();
/* ================= HERO GENERATION ================= */
router.post("/generate-v2", generate_v2_1.generateHeroV2);
/* ================= HERO STATUS ================= */
router.get("/status/:runId", poll_1.pollHeroGeneration);
exports.default = router;
