import express from "express";
import archiver from "archiver";
import axios from "axios";
import { authenticate } from "../../auth/jwt.middleware";
import prisma from "../db/prisma";

const router = express.Router();

/*
  POST /api/lookbook/export
*/
router.post(
  "/lookbook/export",
  authenticate,
  async (req, res) => {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({
          error: "User not found",
        });
      }

      if (user.plan === "FREE") {
        return res.status(403).json({
          error: "Upgrade required for export",
        });
      }

      const { images } = req.body;

      if (!images || !Array.isArray(images)) {
        return res.status(400).json({
          error: "Invalid images payload",
        });
      }

      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=magicreel-campaign-pack.zip"
      );

      const archive = archiver("zip", {
        zlib: { level: 9 },
      });

      archive.pipe(res);

      for (let i = 0; i < images.length; i++) {
        const imageUrl = images[i];

        try {
          const response = await axios.get(
            imageUrl,
            { responseType: "arraybuffer" }
          );

          archive.append(response.data, {
            name: `look_${i + 1}.jpg`,
          });
        } catch (err) {
          console.error(
            "Failed to fetch image:",
            imageUrl
          );
        }
      }

      await archive.finalize();
    } catch (err) {
      console.error("LOOKBOOK EXPORT ERROR:", err);
      res.status(500).json({
        error: "Export failed",
      });
    }
  }
);

export default router;