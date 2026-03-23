import { Router } from "express";
import { runComposeEngine } from "../services/composeEngine";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { faceImageUrl, garmentImageUrl } = req.body;

    if (!faceImageUrl || !garmentImageUrl) {
      return res.status(400).json({ error: "Missing inputs" });
    }

    const result = await runComposeEngine({
      faceImageUrl,
      garmentImageUrl,
    });

    res.json(result);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Compose engine failed" });
  }
});

export default router;
