import axios from "axios";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

type Base64Image = {
  mimeType: string;
  data: string;
};

async function imageUrlToBase64(
  imageUrl: string
): Promise<Base64Image> {
  const response = await axios.get<ArrayBuffer>(
    imageUrl,
    {
      responseType: "arraybuffer",
    }
  );

  const mimeType =
    response.headers["content-type"] ||
    "image/png";

  const base64 = Buffer.from(
    response.data
  ).toString("base64");

  return {
    mimeType,
    data: base64,
  };
}

async function uploadBase64ToCloudinary(
  base64: string
): Promise<string> {
  const result = await cloudinary.uploader.upload(
    `data:image/png;base64,${base64}`,
    {
      folder: "magicreel/social-pack",
      resource_type: "image",
    }
  );

  if (!result.secure_url) {
    throw new Error(
      "Cloudinary upload failed"
    );
  }

  return result.secure_url;
}

export async function generateGeminiCampaignImage(args: {
  heroImageUrl: string;
  prompt: string;
}): Promise<string> {

  // 🔥 ESM SAFE IMPORT
  const genaiModule = await import("@google/genai");

  const GoogleGenAI =
    genaiModule.GoogleGenAI;

  const Modality =
    genaiModule.Modality;

  const ai = new GoogleGenAI({
    apiKey:
      process.env.GEMINI_API_KEY as string,
  });

  const heroImage =
    await imageUrlToBase64(
      args.heroImageUrl
    );

  const response =
    await ai.models.generateContent({
      model: "gemini-2.5-flash-image",

      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType:
                  heroImage.mimeType,
                data:
                  heroImage.data,
              },
            },
            {
              text: args.prompt,
            },
          ],
        },
      ],

      config: {
        responseModalities: [
          Modality.IMAGE,
          Modality.TEXT,
        ],
      },
    });

  const candidates =
    response.candidates || [];

  for (const candidate of candidates) {

    const parts =
      candidate.content?.parts || [];

    for (const part of parts) {

      const inlineData =
        (part as any).inlineData;

      if (
        inlineData &&
        typeof inlineData.data ===
          "string"
      ) {

        const uploadedUrl =
          await uploadBase64ToCloudinary(
            inlineData.data
          );

        return uploadedUrl;
      }
    }
  }

  throw new Error(
    "Gemini did not return image output"
  );
}