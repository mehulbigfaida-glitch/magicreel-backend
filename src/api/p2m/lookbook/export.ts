import { Request, Response } from "express";
import JSZip from "jszip";
import axios from "axios";

export async function exportLookbook(req: Request, res: Response) {
  try {
    const { images } = req.body;

    if (!images || !Array.isArray(images) || !images.length) {
      return res.status(400).json({
        error: "No images provided",
      });
    }

    const zip = new JSZip();
    let index = 1;

    for (const img of images) {
      try {
        // ✅ HANDLE BASE64
        if (img.startsWith("data:")) {
          const base64Data = img.split(",")[1];
          const buffer = Buffer.from(base64Data, "base64");

          zip.file(`look_${index}.jpg`, buffer);
          index++;
          continue;
        }

        // ✅ HANDLE URL
        const response = await axios.get(img, {
          responseType: "arraybuffer",
        });

        zip.file(`look_${index}.jpg`, response.data);
        index++;

      } catch (err) {
        console.warn("Skipping image:", img);
      }
    }

    const content = await zip.generateAsync({ type: "nodebuffer" });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=magicreel-lookbook.zip"
    );

    return res.send(content);

  } catch (err) {
    console.error("Export error:", err);
    return res.status(500).json({
      error: "Export failed",
    });
  }
}