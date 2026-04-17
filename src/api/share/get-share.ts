import { Request, Response } from "express";
import { supabase } from "../../lib/supabase";

export const getShareAsset = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Missing share id",
      });
    }

    const { data, error } = await supabase
      .from("share_assets")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: "Share asset not found",
      });
    }

    return res.status(200).json({
      success: true,
      asset: {
        id: data.id,
        type: data.type,
        title: data.title || null,
        brand: data.brand || null,
        media: data.media || [],
        metadata: data.metadata || {},
        createdAt: data.created_at,
      },
    });
  } catch (err) {
    console.error("GET SHARE ERROR:", err);

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};