import "dotenv/config";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function runComposeEngine({
  faceImageUrl,
  garmentImageUrl,
}: {
  faceImageUrl: string;
  garmentImageUrl: string;
}) {
  const prompt = `
High-end Indian fashion catalog photoshoot.
The model is wearing the exact ethnic garment shown.
The garment is full length with natural elegant flare and hem preserved.
Studio lighting, ultra realistic.
`;

  const output = await replicate.run(
    "playgroundai/playground-v2.5",
    {
      input: {
        prompt,
        image: garmentImageUrl,
        strength: 0.85,
        guidance_scale: 6,
        num_inference_steps: 30,
      },
    }
  );

  const finalImageUrl = Array.isArray(output) ? output[0] : output;

  return {
    finalImageUrl,
    engine: "compose",
    source: "replicate",
    model: "playgroundai/playground-v2.5",
  };
}
