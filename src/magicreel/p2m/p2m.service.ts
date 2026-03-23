// backend/src/magicreel/p2m/p2m.service.ts
// ✅ FINAL — Product-to-Model (P2M) Service
// Purpose: Build prompt → optionally stop → send to FASHN API

import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { buildP2MPrompt } from "../prompts/promptBuilder";

const prisma = new PrismaClient();

const FASHN_RUN_URL = "https://api.fashn.ai/v1/run";
const FASHN_API_KEY = process.env.FASHN_API_KEY as string;

if (!FASHN_API_KEY) {
  throw new Error("FASHN_API_KEY is not set");
}

export class P2MService {
  async run(input: {
    productImageUrl: string;
    modelImageUrl: string;
    avatarGender: "male" | "female";
    category: string;
    attributes?: any;
  }): Promise<any> {
    // 1️⃣ Build the EXACT prompt (single source of truth)
    const prompt = buildP2MPrompt({
      category: input.category,
      avatarGender: input.avatarGender,
      attributes: input.attributes,
    });

    // 2️⃣ PROMPT-ONLY MODE (NO FASHN CALL)
    if (process.env.PROMPT_ONLY === "true") {
      console.log("[PROMPT ONLY]", {
        avatarGender: input.avatarGender,
        category: input.category,
        prompt,
      });

      return {
        mode: "PROMPT_ONLY",
        avatarGender: input.avatarGender,
        category: input.category,
        prompt,
      };
    }

    // 3️⃣ SEND TO FASHN API
    console.log("[SENDING TO FASHN]", prompt);

    const response = await axios.post(
      FASHN_RUN_URL,
      {
        model_name: "product-to-model",
        inputs: {
          model_image: input.modelImageUrl,
          product_image: input.productImageUrl,
          prompt,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${FASHN_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const engineJobId = response.data.id;

    // 4️⃣ Persist job (optional but correct)
    await prisma.productToModelJob.create({
      data: {
        engine: "fashn",
        engineJobId,
        productImageUrl: input.productImageUrl,
        modelImageUrl: input.modelImageUrl,
        status: "fashn_running",
      },
    });

    return {
      jobId: engineJobId,
    };
  }
}
