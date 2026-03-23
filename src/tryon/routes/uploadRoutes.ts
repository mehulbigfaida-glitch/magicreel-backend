import { Router } from "express";
import multer from "multer";
import { uploadImage } from "../controllers/uploadController";

// Configure multer to store uploads locally
const upload = multer({ dest: "uploads/" });

const router = Router();

// Upload user model image
router.post("/", upload.single("image"), uploadImage);

export default router;
