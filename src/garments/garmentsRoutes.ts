import { Router } from "express";

const router = Router();

/**
 * POST /garments/validate
 * Dev-safe garment validation endpoint
 */
router.post("/validate", async (req, res) => {
  const { frontImageUrl, backImageUrl, category } = req.body;

  if (!frontImageUrl) {
    return res.status(400).json({
      ok: false,
      error: "missing_front_image",
    });
  }

  // 🔓 DEV MODE:
  // We intentionally DO NOT reject images here.
  // This unblocks full MagicReel flow for beta.
  return res.json({
    ok: true,
    garment: {
      id: `garment_${Date.now()}`,
      category: category || "auto",
      frontImageUrl,
      backImageUrl: backImageUrl ?? null,
    },
    warning: null,
  });
});

export default router;
