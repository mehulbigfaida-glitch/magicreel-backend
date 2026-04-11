"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/tryon/routes/tryonStatusRoutes.ts
const express_1 = require("express");
const tryonStatusController_1 = require("../controllers/tryonStatusController");
const router = (0, express_1.Router)();
// GET /api/tryon-status/:id
router.get("/:id", tryonStatusController_1.getTryOnStatus);
exports.default = router;
