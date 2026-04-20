import { Request, Response } from "express";
import { supabase } from "../../lib/supabase";
import crypto from "crypto";

export const createShareAsset = async (req: Request, res: Response) => {
  try {
    const { type, media } = req.body;

    if (!type || !Array.isArray(media)) {
      return res.status(400).json({
        success: false,
        error: "Invalid payload",
      });
    }

    // ✅ Clean media format
    const cleanMedia = media.map((m: any) => ({
      url: m.url,
    }));

    // ✅ Generate ID manually
    const shareId = crypto.randomUUID();

    const { data, error } = await supabase
      .from("share_assets")
      .insert([
        {
          id: shareId, // 🔥 IMPORTANT FIX
          type,
          media: cleanMedia,
        },
      ])
      .select()
      .single();

    if (error || !data) {
      console.error("CREATE SHARE ERROR:", error);

      return res.status(500).json({
        success: false,
        error: error?.message || "Insert failed",
      });
    }

    return res.status(200).json({
      success: true,
      asset: {
        id: data.id, // ✅ MUST RETURN
      },
    });

  } catch (err) {
    console.error("CREATE SHARE ERROR:", err);

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};