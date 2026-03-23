// src/tryon/routes/modelUploadRoutes.ts
import { Router } from "express";
import { uploadModel } from "../controllers/modelUploadController";
import multer from "multer";

const router = Router();

// Multer in-memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/model-upload
router.post("/", upload.single("image"), uploadModel);

export default router;
