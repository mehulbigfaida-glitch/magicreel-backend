import { Router } from "express";
import multer from "multer";
import cloudinary from "../../config/cloudinary";
import fs from "fs";

const router = Router();
const upload = multer({ dest: "uploads/" });

// IMPORTANT: Route must be "/" because index.ts mounts "/api/upload/audio"
router.post("/", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No audio file uploaded",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
      folder: "magicreel/audio",
    });

    fs.unlinkSync(req.file.path);

    return res.json({
      success: true,
      url: result.secure_url,
    });
  } catch (err) {
    const error = err as Error;

    console.error("Cloudinary audio upload error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Audio upload failed",
      error: error.message,
    });
  }
});

export default router;
