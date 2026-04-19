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

export const getShareMeta = async (req: any, res: any) => {
  try {
    const { shareId } = req.params;

    const { data, error } = await supabase
      .from("share_assets")
      .select("*")
      .eq("id", shareId)
      .single();

    if (error || !data) {
      return res.status(404).send("Not found");
    }

    const hero = data.media?.[0]?.url;

    const frontendUrl = `https://magicreel-frontend.vercel.app/s/${shareId}`;

    res.send(`
<!DOCTYPE html>
<html>
<head>
  <meta property="og:title" content="MagicReel Lookbook" />
  <meta property="og:description" content="Effortless style powered by MagicReel" />
  <meta property="og:image" content="${hero}" />
  <meta property="og:url" content="${frontendUrl}" />
  <meta property="og:type" content="website" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta http-equiv="refresh" content="0; url=${frontendUrl}" />
</head>
<body>
  Redirecting...
</body>
</html>
`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};