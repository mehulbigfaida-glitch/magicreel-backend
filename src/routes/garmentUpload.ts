import { Router } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

const router = Router();
const upload = multer();

router.post("/garment-upload", upload.single("garment"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) return res.status(400).json({ success: false, error: "No file uploaded" });

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "magicreel/garments" },
      (error, result) => {
        if (error) return res.status(500).json({ success: false, error });

        return res.json({
          success: true,
          data: { garmentUrl: result.secure_url },
        });
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  } catch (err) {
    console.error("GARMENT UPLOAD ERROR:", err);
    res.status(500).json({ success: false, error: "Upload failed" });
  }
});

export default router;
