"use strict";
// src/video/routes/videoStatusRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const videoStatusController_1 = require("../controllers/videoStatusController");
const router = (0, express_1.Router)();
// GET /api/video-status/:id
router.get("/:id", videoStatusController_1.videoStatusController);
exports.default = router;
