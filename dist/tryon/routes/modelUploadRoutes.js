"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/tryon/routes/modelUploadRoutes.ts
const express_1 = require("express");
const modelUploadController_1 = require("../controllers/modelUploadController");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
// Multer in-memory
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// POST /api/model-upload
router.post("/", upload.single("image"), modelUploadController_1.uploadModel);
exports.default = router;
