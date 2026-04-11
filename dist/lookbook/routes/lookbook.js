"use strict";
// src/lookbook/routes/lookbook.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lookbookController_1 = require("../controllers/lookbookController");
const router = (0, express_1.Router)();
// ---- Image Generation ----
router.post("/images", lookbookController_1.generateLookbookImagesController);
// ---- PDF Generation ----
router.post("/pdf", lookbookController_1.generateLookbookPdf);
// ---- Video Generation ----
router.post("/video", lookbookController_1.generateLookbookVideo);
exports.default = router;
