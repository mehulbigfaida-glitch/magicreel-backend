import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

const router = Router();
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

type TokenPayload = jwt.JwtPayload & { id?: string; userId?: string };

function authenticateMuseRequest(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7).trim()
    : undefined;

  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication required." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    const userId = decoded.id || decoded.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Invalid authentication token." });
    }

    (req as Request & { user?: { id: string } }).user = { id: userId };
    return next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired authentication token." });
  }
}

function hasValidImageSignature(buffer: Buffer, mimeType: string): boolean {
  if (mimeType === "image/jpeg") {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mimeType === "image/png") {
    return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  }
  if (mimeType === "image/webp") {
    return buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";
  }
  return false;
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: (_req, file, callback) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      return callback(new Error("Only JPG, PNG or WebP images are accepted."));
    }
    callback(null, true);
  },
});

router.post(
  "/upload-reference",
  authenticateMuseRequest,
  (req, res, next) => {
    upload.single("image")(req, res, (error: unknown) => {
      if (error) {
        const message = error instanceof Error ? error.message : "Image upload failed.";
        const status = message.toLowerCase().includes("file too large") ? 413 : 400;
        return res.status(status).json({ success: false, message });
      }
      next();
    });
  },
  async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ success: false, message: "Please select a portrait image." });
      }

      if (!hasValidImageSignature(file.buffer, file.mimetype)) {
        return res.status(400).json({ success: false, message: "The uploaded file is not a valid JPG, PNG or WebP image." });
      }

      const userId = (req as Request & { user?: { id: string } }).user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Authentication required." });
      }

      const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "magicreel/muse/references",
            resource_type: "image",
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
            tags: ["muse-reference"],
            context: { owner_id: userId },
          },
          (error, uploaded) => {
            if (error || !uploaded?.secure_url || !uploaded.public_id) {
              return reject(error || new Error("Cloudinary did not return an uploaded image."));
            }
            resolve({ secure_url: uploaded.secure_url, public_id: uploaded.public_id });
          }
        );
        stream.end(file.buffer);
      });

      return res.status(201).json({
        success: true,
        data: { imageUrl: result.secure_url, publicId: result.public_id },
      });
    } catch (error) {
      console.error("Muse reference upload failed:", error instanceof Error ? error.message : "Unknown error");
      return res.status(500).json({ success: false, message: "Reference photo upload failed. Please try again." });
    }
  }
);

export default router;
