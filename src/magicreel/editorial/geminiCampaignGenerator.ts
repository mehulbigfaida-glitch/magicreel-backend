import axios from "axios";

import { uploadBufferToCloudinary } from "../services/cloudinary.service";

interface GenerateGeminiCampaignImageInput {
  prompt: string;

  heroImageUrl: string;

  logoImageUrl?: string;
}

export interface GeneratedCampaignImage {
  imageUrl: string;

  prompt: string;
}

async function imageUrlToBase64(
  imageUrl: string
) {
  const response =
    await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

  return Buffer.from(
    response.data
  ).toString("base64");
}

export async function generateGeminiCampaignImage(
  input: GenerateGeminiCampaignImageInput
): Promise<GeneratedCampaignImage> {
  const GEMINI_API_KEY =
    process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    throw new Error(
      "Missing GEMINI_API_KEY"
    );
  }

  const heroBase64 =
    await imageUrlToBase64(
      input.heroImageUrl
    );

  let logoBase64:
    | string
    | null = null;

  if (input.logoImageUrl) {
    logoBase64 =
      await imageUrlToBase64(
        input.logoImageUrl
      );
  }

  const parts: any[] = [
    {
      text: `
Use the uploaded hero image as the primary campaign subject reference.

Preserve:
- garment identity
- silhouette
- embroidery
- styling
- luxury realism
- couture structure

Transform the image into a cinematic luxury editorial campaign.

${input.prompt}
`,
    },

    {
      inlineData: {
        mimeType: "image/png",

        data: heroBase64,
      },
    },
  ];

  if (logoBase64) {
    parts.push({
      text: `
Use the uploaded logo subtly and elegantly inside the luxury campaign composition.
`,
    });

    parts.push({
      inlineData: {
        mimeType: "image/png",

        data: logoBase64,
      },
    });
  }

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI_API_KEY}`,

    {
      contents: [
        {
          role: "user",

          parts,
        },
      ],

      generationConfig: {
        responseModalities: [
          "TEXT",
          "IMAGE",
        ],
      },
    },

    {
      headers: {
        "Content-Type":
          "application/json",
      },
    }
  );

  const responseParts =
    response.data?.candidates?.[0]
      ?.content?.parts || [];

  const imagePart =
    responseParts.find(
      (part: any) =>
        part.inlineData?.data
    );

  if (!imagePart) {
    console.error(
      JSON.stringify(
        response.data,
        null,
        2
      )
    );

    throw new Error(
      "Gemini did not return image data"
    );
  }

  const buffer = Buffer.from(
    imagePart.inlineData.data,
    "base64"
  );

  const uploadResult =
    await uploadBufferToCloudinary(
      buffer
    );

  return {
    imageUrl:
      uploadResult.secure_url,

    prompt: input.prompt,
  };
}