import { Request, Response } from "express";
import { supabase } from "../../lib/supabase";

// ==============================
// GET SHARE DATA (JSON)
// ==============================
export const getShareData = async (req: Request, res: Response) => {
  try {
    const { runId } = req.params;

    console.log("🔍 Fetching share for ID:", runId);

    const { data, error } = await supabase
      .from("share_assets")
      .select("*")
      .eq("id", runId)
      .single();

    if (error || !data) {
      console.error("❌ Share fetch error:", error);
      return res.status(404).json({ error: "Not found" });
    }

    return res.json(data);
  } catch (err) {
    console.error("❌ Share API crash:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ==============================
// GET SHARE META (WHATSAPP PREVIEW)
// ==============================
export const getShareMeta = async (req: Request, res: Response) => {
  try {
    const { shareId } = req.params;

    console.log("🔍 Meta fetch for:", shareId);

    const { data, error } = await supabase
      .from("share_assets")
      .select("*")
      .eq("id", shareId)
      .single();

    if (error || !data) {
      console.error("❌ Meta fetch error:", error);
      return res.status(404).send("Not found");
    }

    // ✅ HERO IMAGE
    let hero = data.media?.[0]?.url;

    // 🔥 Cloudinary optimization (VERY IMPORTANT)
    if (hero && hero.includes("res.cloudinary.com")) {
      hero = hero.replace(
        "/upload/",
        "/upload/w_1200,c_limit,f_auto,q_auto/"
      );
    }

    const frontendUrl = `https://magicreel-frontend.vercel.app/s/${shareId}`;

    // ==============================
    // RETURN HTML WITH OG TAGS
    // ==============================
    res.send(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>MagicReel Lookbook</title>

  <!-- ✅ OPEN GRAPH (MINIMAL & STABLE) -->
  <meta property="og:title" content="MagicReel Lookbook" />
  <meta property="og:description" content="Effortless style powered by MagicReel" />
  <meta property="og:image" content="${hero}" />
  <meta property="og:url" content="${frontendUrl}" />
  <meta property="og:type" content="website" />

  <!-- ✅ TWITTER -->
  <meta name="twitter:card" content="summary_large_image" />

  <!-- 🔥 CRITICAL: DELAY REDIRECT -->
  <meta http-equiv="refresh" content="2; url=${frontendUrl}" />
</head>

<body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">
  <div>
    <h2>Loading MagicReel Lookbook...</h2>
  </div>
</body>
</html>
`);
  } catch (err) {
    console.error("❌ Meta API crash:", err);
    return res.status(500).send("Server error");
  }
};