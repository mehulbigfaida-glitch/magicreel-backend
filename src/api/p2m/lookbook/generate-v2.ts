import { Request, Response } from "express";
import axios from "axios";
import { finalizeBilling } from "../../../billing/billing.middleware";
import { prisma } from "../../../magicreel/db/prisma";
import fs from "fs";
import path from "path";
import { uploadToCloudinary } from "../../../utils/cloudinary";

// 🔥 NEW IMPORTS
import { supabase } from "../../../lib/supabaseClient";
const { randomUUID } = require("crypto");

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN as string;

const QWEN_URL =
  "https://api.replicate.com/v1/models/qwen/qwen-image-edit-plus/predictions";

const LOCKED_PROMPT =
  "The person in image 2 adopts the full body pose from image 1, maintaining full body visibility from head to toe, preserving exact facial identity with natural skin texture and sharp facial details, face in natural sharp focus";

const POSES = [
  { id: "p1", type: "front", url: "https://res.cloudinary.com/duaqfspwa/image/upload/v1776236833/left_angle_natb6a.png" },
  { id: "p2", type: "walking", url: "https://res.cloudinary.com/duaqfspwa/image/upload/v1776236833/right_angle_zi2unn.png" },
  { id: "p3", type: "angle", url: "https://res.cloudinary.com/duaqfspwa/image/upload/v1776236833/Front_Walking_c2inmz.png" },
  { id: "p4", type: "dynamic", url: "https://res.cloudinary.com/duaqfspwa/image/upload/v1776236833/both_hand_on_hip_vga17c.png" },
];

async function downloadImage(url: string, filename: string) {
  const filePath = path.join("/tmp", filename);
  const response = await axios.get(url, { responseType: "arraybuffer" });
  fs.writeFileSync(filePath, response.data);
  return filePath;
}

export async function generateLookbookV2(req: Request, res: Response) {
  try {
    const { heroImageUrl, backHeroImageUrl } = req.body;

    if (!heroImageUrl) {
      return res.status(400).json({ error: "heroImageUrl required" });
    }

    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const lookbook = await prisma.lookbook.create({
      data: {
        user: { connect: { id: userId } },
        garment: { connect: { id: "garment-default-1" } },
        modelId: "default",
        presetId: "default",
        status: "completed",
      },
    });

    const poses: any[] = [];

    /* HERO */
    poses.push({ poseId: "hero", imageUrl: heroImageUrl });

    await prisma.render.create({
      data: {
        pose: "hero",
        engine: "QWEN",
        type: "LOOKBOOK",
        status: "completed",
        modelImageUrl: heroImageUrl,
        garmentImageUrl: heroImageUrl,
        outputImageUrl: heroImageUrl,
        lookbookId: lookbook.id,
      },
    });

    /* BACK */
    if (backHeroImageUrl) {
      poses.push({ poseId: "back", imageUrl: backHeroImageUrl });

      await prisma.render.create({
        data: {
          pose: "back",
          engine: "QWEN",
          type: "LOOKBOOK",
          status: "completed",
          modelImageUrl: backHeroImageUrl,
          garmentImageUrl: backHeroImageUrl,
          outputImageUrl: backHeroImageUrl,
          lookbookId: lookbook.id,
        },
      });
    }

    /* AI POSES */
    for (const pose of POSES) {
      let finalUrl: string | null = null;

      try {
        const response = await axios.post(
          QWEN_URL,
          {
            input: {
              image: [pose.url, heroImageUrl],
              prompt: LOCKED_PROMPT,
              aspect_ratio: "9:16",
              output_format: "png",
            },
          },
          {
            headers: {
              Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
            },
          }
        );

        const predictionUrl = response.data.urls.get;

        let outputUrl = null;

        for (let i = 0; i < 60; i++) {
          const poll = await axios.get(predictionUrl, {
            headers: {
              Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
            },
          });

          if (poll.data.status === "succeeded") {
            outputUrl = poll.data.output[0];
            break;
          }

          await new Promise((r) => setTimeout(r, 1500));
        }

        if (outputUrl) {
          const localPath = await downloadImage(
            outputUrl,
            `${pose.id}.png`
          );

          const uploaded = await uploadToCloudinary(localPath, {
            folder: "magicreel/lookbooks",
          });

          finalUrl = uploaded.secure_url;
        }

      } catch (err) {
        console.error("Pose failed:", pose.id);
      }

      poses.push({
        poseId: pose.id,
        imageUrl: finalUrl || "",
      });

      await prisma.render.create({
        data: {
          pose: pose.id,
          engine: "QWEN",
          type: "LOOKBOOK",
          status: "completed",
          modelImageUrl: heroImageUrl,
          garmentImageUrl: heroImageUrl,
          outputImageUrl: finalUrl,
          lookbookId: lookbook.id,
        },
      });
    }

    // 🔥 CREATE SHARE ASSET (SAFE, NON-BLOCKING)
    const shareId = randomUUID();

    try {
      await supabase.from("share_assets").insert([
        {
          id: shareId,
          type: "lookbook",
          media: poses.map((p, index) => ({
            kind: "image",
            url: p.imageUrl,
            pose: index,
          })),
          metadata: {
            poses: poses.map((_, i) => i),
            aspectRatio: "2:3",
          },
        },
      ]);
    } catch (err) {
      console.error("Share asset creation failed:", err);
    }

    return res.json({
      success: true,
      runId: lookbook.id,
      poses,
      shareId, // 🔥 IMPORTANT
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Lookbook failed" });
  }
}