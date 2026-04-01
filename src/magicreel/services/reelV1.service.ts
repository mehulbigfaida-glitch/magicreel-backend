import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export const reelV1Service = {
  async generate({ imageUrl }: { imageUrl: string }) {
    if (!imageUrl) {
      throw new Error("imageUrl is required");
    }

    console.log("🎬 Sending to Kling v2.1:", imageUrl);

    const prediction = await replicate.predictions.create({
      version: "kwaivgi/kling-v2.1",
      input: {
        start_image: imageUrl,
        prompt:
          "A fashion model walking naturally towards camera, cinematic lighting, smooth motion",
        duration: 5,
      },
    });

    console.log("⏳ Waiting for result...");

    let result = prediction;
    let attempts = 0;
    const MAX_ATTEMPTS = 60;

    while (
      result.status !== "succeeded" &&
      result.status !== "failed"
    ) {
      if (attempts >= MAX_ATTEMPTS) {
        throw new Error("Kling timeout");
      }

      attempts++;

      await new Promise((r) => setTimeout(r, 3000));
      result = await replicate.predictions.get(result.id);

      console.log("⏳ status:", result.status);
    }

    if (result.status !== "succeeded") {
      console.error("❌ Kling failed:", result);
      throw new Error("Kling generation failed");
    }

    let videoUrl: string | null = null;

    if (typeof result.output === "string") {
      videoUrl = result.output;
    } else if (Array.isArray(result.output) && result.output.length > 0) {
      videoUrl = result.output[0];
    }

    if (!videoUrl) {
      console.error("❌ No valid video URL in result:", result);
      throw new Error("No video URL returned from Kling");
    }

    console.log("✅ Video ready:", videoUrl);
    console.log("🎬 Prediction ID:", result.id);

    return { reelVideoUrl: videoUrl };
  },
};