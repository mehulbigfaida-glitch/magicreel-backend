import { Request, Response } from "express";
import { supabase } from "../../lib/supabase"; // adjust path if needed

export const getShareData = async (req: Request, res: Response) => {
  try {
    const { runId } = req.params; // we keep name, but it is actually shareId

    console.log("🔍 Fetching share for ID:", runId);

    const { data, error } = await supabase
      .from("share_assets") // ✅ correct table
      .select("*")
      .eq("id", runId) // ✅ IMPORTANT FIX
      .single();

    if (error || !data) {
      console.error("❌ Share fetch error:", error);
      return res.status(404).json({ error: "Not found" });
    }

    console.log("✅ Share data found");

    return res.json(data);
  } catch (err) {
    console.error("❌ Share API crash:", err);
    return res.status(500).json({ error: "Server error" });
  }
};