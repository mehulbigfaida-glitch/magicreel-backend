import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export const reelV1Service = {
  async generate({ imageUrl }: { imageUrl: string }) {
    console.log("🎬 Sending to Kling v2.1:", imageUrl);

    const prediction = await replicate.predictions.create({
      model: "kwaivgi/kling-v2.1",
      input: {
        image: imageUrl,
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
      throw new Error("Kling generation failed");
    }

    const videoUrl = result.urls?.stream;

    console.log("✅ Video ready:", videoUrl);

    return { reelVideoUrl: videoUrl };
  },
};