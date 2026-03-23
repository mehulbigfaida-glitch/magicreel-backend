// src/lookbook/services/fashn.ts

import axios from "axios";

const FASHN_KEY = process.env.FASHN_API_KEY;
const BASE_URL = "https://api.fashn.ai/v1";

if (!FASHN_KEY) {
  throw new Error("FASHN_API_KEY missing at runtime");
}

export interface FashnTryOnInput {
  modelImageUrl: string;    // pose-specific model image
  garmentImageUrl: string;  // front garment image
}

export interface FashnTryOnResult {
  imageUrl: string;
  raw: any;
}

// --------------------------------------------
// START TRY-ON JOB (v1.6 – OFFICIAL)
// --------------------------------------------
export async function startTryOnJob(
  input: FashnTryOnInput
): Promise<{ jobId: string }> {
  const response = await axios.post(
    `${BASE_URL}/run`,
    {
      model_name: "tryon-v1.6",
      inputs: {
        model_image: input.modelImageUrl,
        garment_image: input.garmentImageUrl,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${FASHN_KEY}`, // ✅ CORRECT
        "Content-Type": "application/json",
      },
      timeout: 60000,
    }
  );

  if (!response.data?.id) {
    throw new Error("FASHN did not return job id");
  }

  return { jobId: response.data.id };
}

// --------------------------------------------
// POLL JOB STATUS
// --------------------------------------------
export async function pollJobStatus(
  jobId: string
): Promise<FashnTryOnResult> {
  while (true) {
    const response = await axios.get(
      `${BASE_URL}/status/${jobId}`,
      {
        headers: {
          Authorization: `Bearer ${FASHN_KEY}`, // ✅ CORRECT
        },
        timeout: 60000,
      }
    );

    const data = response.data;

    if (data.status === "completed") {
      const imageUrl = data?.output?.[0];

      if (!imageUrl) {
        throw new Error("No image URL returned by FASHN");
      }

      return { imageUrl, raw: data };
    }

    if (data.status === "failed") {
      throw new Error(
        data?.error?.message || "FASHN job failed"
      );
    }

    await new Promise((r) => setTimeout(r, 2000));
  }
}
