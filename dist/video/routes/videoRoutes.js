"use strict";
// src/video/routes/videoRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const videoGenerateController_1 = require("../controllers/videoGenerateController");
const router = (0, express_1.Router)();
// NEW correct handler:
router.post("/generate", videoGenerateController_1.videoGenerateController.generate);
exports.default = router;
