import { Request, Response } from "express";
import { P2MService } from "../p2m/p2m.service";

const p2mService = new P2MService();

export async function generateLookbookController(
  req: Request,
  res: Response
) {
  console.log("🚨 RAW REQUEST BODY", JSON.stringify(req.body, null, 2));
  
    try {
    const {
      category,          // 🔴 UI-selected category (SOURCE OF TRUTH)
      avatarGender,
      garmentImageUrl,
      modelImageUrl,
      attributes,
    } = req.body;

    if (!category) {
      return res.status(400).json({ error: "category required" });
    }

    if (!avatarGender) {
      return res.status(400).json({ error: "avatarGender required" });
    }

    if (!garmentImageUrl || !modelImageUrl) {
      return res.status(400).json({ error: "images required" });
    }

    // 🔥 FORCE UI CATEGORY — NO DB OVERRIDE
    const effectiveCategory = category;

    console.log("[LOOKBOOK GENERATE]", {
      effectiveCategory,
      avatarGender,
    });

    const result = await p2mService.run({
      category: effectiveCategory,   // ✅ ALWAYS UI CATEGORY
      avatarGender,
      productImageUrl: garmentImageUrl,
      modelImageUrl,
      attributes,
    });

    if (result?.mode === "PROMPT_ONLY") {
      return res.json(result);
    }

    return res.json({
      status: "submitted",
      jobId: result.jobId,
    });
  } catch (err: any) {
    console.error("❌ LOOKBOOK GENERATION FAILED:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
