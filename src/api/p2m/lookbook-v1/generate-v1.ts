import { Request, Response } from "express";
import axios from "axios";
import { fal } from "@fal-ai/client";
import fs from "fs";
import path from "path";
import os from "os";
import sharp from "sharp";

import { prisma } from "../../../magicreel/db/prisma";
import { finalizeBilling } from "../../../billing/billing.middleware";
import { uploadToCloudinary } from "../../../utils/cloudinary";
import { supabase } from "../../../lib/supabase";

import { buildLookbookPrompt } from "./lookbookPromptComposer";
import { getLookbookCategoryPoses } from "./lookbookPoseRegistry";
import { getEcomLookbookPosePlan } from "./lookbookPoseUpgrade";

fal.config({ credentials: process.env.FAL_KEY! });

const { randomUUID } = require("crypto");

const ECOM_ASPECT_RATIOS = {
  "2:3": { width: 1240, height: 1860 },
  "3:4": { width: 1500, height: 2000 },
  "4:5": { width: 1856, height: 2304 },
  "1:1": { width: 2000, height: 2000 },
} as const;

type EcomAspectRatio = keyof typeof ECOM_ASPECT_RATIOS;

async function downloadImage(url: string, filename: string) {
  const tempDir = os.tmpdir();
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const filePath = path.join(tempDir, filename);
  const response = await axios.get(url, { responseType: "arraybuffer" });
  fs.writeFileSync(filePath, response.data);
  return filePath;
}

async function normalizeOutputDimensions(
  filePath: string,
  width: number,
  height: number
) {
  const tempOutput = `${filePath}.normalized.jpg`;

  await sharp(filePath)
    .resize(width, height, { fit: "fill" })
    .jpeg({ quality: 90, chromaSubsampling: "4:2:0", mozjpeg: true })
    .toFile(tempOutput);

  fs.unlinkSync(filePath);
  return tempOutput;
}

export async function generateLookbookV1(req: Request, res: Response) {
  try {
    const {
      heroImageUrl,
      backHeroImageUrl,
      lookbookWorld,
      gender,
      category,
      aspectRatio = "2:3",
    } = req.body;

    if (!heroImageUrl) return res.status(400).json({ error: "heroImageUrl required" });
    if (!lookbookWorld) return res.status(400).json({ error: "lookbookWorld required" });
    if (!gender || !category) return res.status(400).json({ error: "gender and category required" });

    if (!(aspectRatio in ECOM_ASPECT_RATIOS)) {
      return res.status(400).json({
        error: `Unsupported aspect ratio: ${aspectRatio}. Supported values: 2:3, 3:4, 4:5, 1:1`,
      });
    }

    const legacyPlan = getLookbookCategoryPoses(category);
    if (!legacyPlan) {
      return res.status(400).json({ error: `Unsupported Lookbook category: ${category}` });
    }

    const categoryPosePlan = getEcomLookbookPosePlan(legacyPlan);
    const imageSize = ECOM_ASPECT_RATIOS[aspectRatio as EcomAspectRatio];
    const deliveryFormat = "jpeg" as const;
    const userId = (req as any).user?.id;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const lookbook = await prisma.lookbook.create({
      data: {
        user: { connect: { id: userId } },
        garment: { connect: { id: "garment-default-1" } },
        modelId: "default",
        presetId: lookbookWorld,
        status: "running",
      },
    });

    (req as any).billing = {
      userId,
      feature: "LOOKBOOK_ECOM",
      creditsRequired: 2,
      predictionId: lookbook.id,
    };

    res.status(202).json({
      success: true,
      runId: lookbook.id,
      status: "processing",
      aspectRatio,
      targetImageSize: imageSize,
      deliveryFormat,
    });

    setImmediate(async () => {
      const poses: Array<{ poseId: string; imageUrl: string }> = [];

      async function generateShot(
        poseId: string,
        shotType: "front" | "back" | "pose",
        referenceImages: string[],
        pose?: any
      ) {
        const prompt = buildLookbookPrompt({
          category,
          gender,
          worldId: lookbookWorld,
          shotType,
          pose,
        });

        // Retry the COMPLETE shot pipeline, not only the Fal request.
        // A shot can fail after Fal succeeds (download, Sharp, Cloudinary,
        // or Prisma). If that happens, the next Lookbook shots must still
        // be attempted rather than silently stopping the entire pack.
        const MAX_SHOT_ATTEMPTS = 3;
        let lastShotError: unknown;

        for (let attempt = 1; attempt <= MAX_SHOT_ATTEMPTS; attempt++) {
          let stage = "fal";

          try {
            console.log("🎬 LOOKBOOK SHOT START", {
              runId: lookbook.id,
              poseId,
              shotType,
              attempt,
              maxAttempts: MAX_SHOT_ATTEMPTS,
              referenceCount: referenceImages.length,
            });

            const result = await fal.subscribe("openai/gpt-image-2.5/sunburst/edit", {
              input: {
                prompt,
                image_urls: referenceImages,
                num_images: 1,
                quality: "medium",
                output_format: "png",
                image_size: imageSize,
              },
              logs: true,
            });

            const imageUrl = result?.data?.images?.[0]?.url;
            if (!imageUrl) {
              throw new Error(
                `GPT Image 2.5 Sunburst returned no image for ${poseId}`
              );
            }

            stage = "download";
            const localPath = await downloadImage(
              imageUrl,
              `${lookbook.id}_${poseId}.png`
            );

            stage = "normalize";
            // GPT Image 2.5 Sunburst generates internally as PNG. MagicReel Ecom Lookbook
            // delivers every aspect ratio as optimized JPEG while preserving the
            // sealed pixel dimensions.
            const normalizedPath = await normalizeOutputDimensions(
              localPath,
              imageSize.width,
              imageSize.height
            );

            stage = "cloudinary";
            const uploaded = await uploadToCloudinary(normalizedPath, {
              folder: "magicreel/lookbooks",
              public_id: `${lookbook.id}_${poseId}`,
            });

            const finalUrl = uploaded.secure_url;

            stage = "prisma";
            await prisma.render.create({
              data: {
                pose: poseId,
                engine: "GPT_IMAGE_2_5_SUNBURST_MEDIUM",
                type: "LOOKBOOK",
                status: "completed",
                modelImageUrl: referenceImages[0],
                garmentImageUrl: referenceImages[0],
                outputImageUrl: finalUrl,
                lookbookId: lookbook.id,
              },
            });

            poses.push({ poseId, imageUrl: finalUrl });

            console.log("✅ LOOKBOOK SHOT COMPLETE", {
              runId: lookbook.id,
              poseId,
              shotType,
              attempt,
              stage: "complete",
            });

            return finalUrl;
          } catch (shotError) {
            lastShotError = shotError;

            console.error(
              `⚠️ LOOKBOOK ${poseId} failed at ${stage} (attempt ${attempt}/${MAX_SHOT_ATTEMPTS})`,
              shotError
            );

            if (attempt < MAX_SHOT_ATTEMPTS) {
              await new Promise((resolve) =>
                setTimeout(resolve, attempt * 2000)
              );
            }
          }
        }

        throw new Error(
          `Lookbook shot ${poseId} failed after ${MAX_SHOT_ATTEMPTS} attempts: ${String(lastShotError)}`
        );
      }

      try {
        const lookbookFrontUrl = await generateShot("front", "front", [heroImageUrl]);

        if (backHeroImageUrl) {
          // Back Hero is the exclusive reference for the dedicated Back image.
          // Do not provide the Front Hero as a second visual reference.
          await generateShot("back", "back", [backHeroImageUrl]);
        }

        // Ecom V1 is a 6-image pack: Front + Back + 4 Lookbook poses.
        // The Front Hero is the exclusive reference for every front-derived pose.
        // World continuity is prompt-driven; generated Lookbook images are never reused as references.
        for (const pose of categoryPosePlan.poses) {
          await generateShot(pose.id, "pose", [heroImageUrl], pose);
        }

        const shareId = randomUUID();
        const shareMedia = poses.map((p, index) => ({
          kind: "image",
          url: p.imageUrl,
          pose: index,
        }));

        const { error: shareError } = await supabase.from("share_assets").insert([
          {
            id: shareId,
            type: "lookbook",
            media: shareMedia,
            metadata: {
              runId: lookbook.id,
              poses: poses.map((_, i) => i),
              aspectRatio,
              width: imageSize.width,
              height: imageSize.height,
              deliveryFormat,
            },
          },
        ]);

        if (shareError) throw new Error(`Share asset creation failed: ${shareError.message}`);

        await finalizeBilling(req);
        await prisma.lookbook.update({ where: { id: lookbook.id }, data: { status: "completed" } });

        console.log("✅ LOOKBOOK BACKGROUND JOB COMPLETE", {
          runId: lookbook.id,
          poses: poses.length,
          shareId,
          aspectRatio,
          width: imageSize.width,
          height: imageSize.height,
          deliveryFormat,
        });
      } catch (error: any) {
        console.error("❌ LOOKBOOK BACKGROUND JOB FAILED", error);
        await prisma.lookbook.update({ where: { id: lookbook.id }, data: { status: "failed" } }).catch((updateError) => {
          console.error("❌ Failed updating Lookbook status:", updateError);
        });
      }
    });
  } catch (error: any) {
    console.error("❌ LOOKBOOK REQUEST FAILED", error);
    return res.status(500).json({ error: "Lookbook failed" });
  }
}
