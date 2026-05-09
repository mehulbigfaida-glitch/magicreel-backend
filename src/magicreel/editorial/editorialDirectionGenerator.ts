import axios from "axios";

import {
  buildEditorialDraftPrompt,
} from "./editorialDraftPrompt";

import {
  uploadBufferToCloudinary,
} from "../services/cloudinary.service";

interface GenerateEditorialDirectionInput {
  heroImageUrl: string;

  logoImageUrl?: string;

  editorialWorld: string;

  output: string;
}

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY || "";

export async function generateEditorialDirection(
  input: GenerateEditorialDirectionInput
) {
  if (!GEMINI_API_KEY) {
    throw new Error(
      "Missing GEMINI_API_KEY"
    );
  }

  const prompt =
    buildEditorialDraftPrompt({
      editorialWorld:
        input.editorialWorld as any,

      output:
        input.output as any,
    });

  const parts: any[] = [
    {
      text: prompt,
    },
    {
      fileData: {
        mimeType: "image/png",
        fileUri:
          input.heroImageUrl,
      },
    },
  ];

  if (input.logoImageUrl) {
    parts.push({
      fileData: {
        mimeType: "image/png",
        fileUri:
          input.logoImageUrl,
      },
    });
  }

  const response =
    await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",

            parts,
          },
        ],
      },
      {
        timeout: 120000,
      }
    );

  const candidates =
    response.data
      ?.candidates || [];

  const imagePart =
    candidates?.[0]
      ?.content?.parts?.find(
        (part: any) =>
          part.inlineData
      );

  if (!imagePart) {
    throw new Error(
      "No image generated"
    );
  }

  const imageBuffer =
  Uint8Array.from(
    Buffer.from(
      imagePart.inlineData.data,
      "base64"
    )
  ).buffer;

  const uploaded =
  await uploadBufferToCloudinary(
    Buffer.from(imageBuffer)
  );

  return {
    imageUrl:
      uploaded.secure_url,

    prompt,
  };
}