import { Router } from "express";
import { cloudinary } from "../config/cloudinary";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const folder = "magicreel";

    const result = await cloudinary.search
      .expression(`folder:${folder}`)
      .sort_by("public_id", "desc")
      .max_results(100)
      .execute();

    const garments = result.resources.map((r: any) => ({
      image: r.secure_url,
      meta: {
        public_id: r.public_id,
        format: r.format,
        width: r.width,
        height: r.height,
      },
    }));

    return res.json(garments);

  } catch (error: any) {
    console.error("❌ Failed to fetch garments:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not fetch garments",
      error: error.message,
    });
  }
});

export default router;