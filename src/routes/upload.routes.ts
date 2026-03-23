import { Router } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/audio", upload.single("audio"), async (req, res) => {
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

    return res.json({
      success: true,
      url: result.secure_url,
    });
  } catch (error: unknown) {
    const err = error as Error;

    console.error("Audio upload error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Audio upload failed",
      error: err.message,
    });
  }
});

export default router;
