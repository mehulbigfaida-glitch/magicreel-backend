import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export const reelV1Service = {
  async generate({ imageUrl }: { imageUrl: string }) {
    console.log("🎬 Sending to Replicate:", imageUrl);

    const output = await replicate.run(
      "kwaivgi/kling-v1",
      {
        input: {
          image: imageUrl,
          prompt:
            "A fashion model walking naturally towards camera, cinematic lighting, smooth motion",
          duration: 5,
        },
      }
    );

    const videoUrl = Array.isArray(output)
      ? output[0]
      : output;

    return { reelVideoUrl: videoUrl };
  },
};