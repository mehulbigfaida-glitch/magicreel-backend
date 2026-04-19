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
  <meta charset="utf-8" />

  <title>MagicReel Lookbook</title>

  <!-- ✅ OPEN GRAPH -->
  <meta property="og:title" content="MagicReel Lookbook" />
  <meta property="og:description" content="Effortless style powered by MagicReel" />
  <meta property="og:image" content="${hero}" />
  <meta property="og:image:secure_url" content="${hero}" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1080" />
  <meta property="og:image:height" content="1350" />
  <meta property="og:url" content="https://magicreel-frontend.vercel.app/s/${shareId}" />
  <meta property="og:type" content="website" />

  <!-- ✅ TWITTER -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="${hero}" />

  <!-- ❗ DELAY REDIRECT (IMPORTANT) -->
  <script>
    setTimeout(function() {
      window.location.href = "https://magicreel-frontend.vercel.app/s/${shareId}";
    }, 1500);
  </script>
</head>

<body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">
  <div>
    <h2>Loading MagicReel Lookbook...</h2>
  </div>
</body>
</html>
`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};