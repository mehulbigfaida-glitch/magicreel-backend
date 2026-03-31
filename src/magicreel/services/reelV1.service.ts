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
      version: "kwaivgi/kling-v2.1", // ✅ FIXED
      input: {
        start_image: imageUrl, // ✅ FIXED
        prompt:
          "A fashion model walking naturally towards camera, cinematic lighting, smooth motion",
        duration: 5,
      },
    });

    console.log("⏳ Waiting for result...");

    let result = prediction;

    while (
      result.status !== "succeeded" &&
      result.status !== "failed"
    ) {
      await new Promise((r) => setTimeout(r, 3000));

      result = await replicate.predictions.get(result.id);

      console.log("⏳ status:", result.status);
    }

    if (result.status !== "succeeded") {
      console.error("❌ Kling failed:", result);
      throw new Error("Kling generation failed");
    }

    // ✅ SAFE OUTPUT EXTRACTION
    const videoUrl =
      (result.output && result.output[0]) ||
      result.urls?.stream ||
      null;

    if (!videoUrl) {
      console.error("❌ No video URL in result:", result);
      throw new Error("No video URL returned from Kling");
    }

    console.log("✅ Video ready:", videoUrl);

    return { reelVideoUrl: videoUrl };
  },
};