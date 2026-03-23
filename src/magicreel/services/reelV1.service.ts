import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { klingVideoService } from "../../video/services/klingVideo.service";

/* ----------------------------------
   CLOUDINARY CONFIG
---------------------------------- */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

/* ----------------------------------
   REEL CACHE
---------------------------------- */

const reelCache = new Map<
  string,
  { url: string; timestamp: number }
>();

/* ----------------------------------
   🔥 PROMPT BUILDER (LOCKED V1)
---------------------------------- */

function buildReelPrompt(): string {
  return `
Animate the same person from the reference image, preserving the exact face, hairstyle, body proportions, and clothing. Vertical 9:16 fashion reel.

The model begins by walking forward with a controlled, natural motion, taking several small and smooth steps. The walking style is confident, elegant, and realistic, like a high-end fashion campaign.

Body motion is refined with gentle weight shifts. Arms move very slightly and naturally without exaggeration.

As the model approaches closer to the camera, the movement gradually slows down. The model then comes to a natural stop and transitions smoothly into a confident fashion pose.

The model faces the camera directly with strong, composed eye contact. Expression is calm, confident, and powerful, like the final hero frame of a luxury fashion campaign.

After stopping, movement becomes minimal, with only subtle natural breathing and very slight fabric response.

The camera performs a slow, cinematic push-in throughout the sequence, enhancing depth and presence.

Lighting remains soft, balanced, and consistent, with gentle front-facing illumination and subtle fill light reducing harsh shadows while maintaining natural depth.

Background remains clean and minimal.

Ultra-realistic, sharp focus, premium editorial fashion style.

Strict constraints: no fast walking, no large steps, no exaggerated arm swinging, no dramatic motion, no additional movement after stopping, no identity drift, no face change, no body distortion, no garment alteration.
  `.trim();
}

/* ----------------------------------
   GENERATE REEL V1
---------------------------------- */

export async function generateReelV1(params: {
  jobId: string;
  heroPreviewUrl: string;
}): Promise<{ reelVideoUrl: string }> {

  const { jobId, heroPreviewUrl } = params;

  if (!jobId || !heroPreviewUrl) {
    throw new Error("jobId and heroPreviewUrl are required");
  }

  const cacheKey = heroPreviewUrl;
  const existing = reelCache.get(cacheKey);

  if (existing) {
    const age = Date.now() - existing.timestamp;

    if (age < 60000) {
      console.log("♻️ Returning cached reel");
      return { reelVideoUrl: existing.url };
    }
  }

  console.log("🎬 Reel Generation Started");
  console.log("Job ID:", jobId);

  const baseDir = path.join(process.cwd(), "storage", "reels", jobId);
  fs.mkdirSync(baseDir, { recursive: true });

  /* ---------------------------------- */
  /* DOWNLOAD HERO */
  /* ---------------------------------- */

  console.log("⬇️ Downloading hero preview...");

  const response = await fetch(heroPreviewUrl);

  if (!response.ok) {
    throw new Error(`Failed to download hero preview (${response.status})`);
  }

  const imageBuffer = Buffer.from(await response.arrayBuffer());
  const localHeroPath = path.join(baseDir, "hero_preview.png");

  fs.writeFileSync(localHeroPath, imageBuffer);

  console.log("✅ Hero preview saved:", localHeroPath);

  /* ---------------------------------- */
  /* GENERATE VIDEO (SAFE WRAPPER) */
  /* ---------------------------------- */

  console.log("🎬 Generating Reel via Kling 2.1...");

  const localReelPath = path.join(baseDir, "reel.mp4");
  const reelPrompt = buildReelPrompt();

  try {
    await klingVideoService.generateClip({
      imagePath: localHeroPath,
      outputVideoPath: localReelPath,
      prompt: reelPrompt,
      duration: 5,
    });
  } catch (err: any) {

    console.warn("⚠️ Kling error (non-fatal):", err?.message);

    /* 🔥 KEY FIX: DO NOT FAIL HERE */
    if (!fs.existsSync(localReelPath)) {
      throw new Error("Reel generation failed completely");
    }

    console.log("⚠️ Proceeding with existing generated video...");
  }

  if (!fs.existsSync(localReelPath)) {
    throw new Error("Reel generation failed");
  }

  console.log("✅ Reel generated locally:", localReelPath);

  /* ---------------------------------- */
  /* UPLOAD CLOUDINARY */
  /* ---------------------------------- */

  console.log("☁️ Uploading reel...");

  const uploadResult = await cloudinary.uploader.upload(
    localReelPath,
    {
      folder: `magicreel/${jobId}/reel`,
      public_id: "reel",
      overwrite: true,
      resource_type: "video",
    }
  );

  if (!uploadResult.secure_url) {
    throw new Error("Cloudinary upload failed");
  }

  const reelUrl = uploadResult.secure_url;

  console.log("🎥 Reel URL:", reelUrl);

  /* ---------------------------------- */
  /* CACHE STORE */
  /* ---------------------------------- */

  reelCache.set(cacheKey, {
    url: reelUrl,
    timestamp: Date.now(),
  });

  return {
    reelVideoUrl: reelUrl,
  };
}