import { Request, Response } from "express";
import axios from "axios";
import { finalizeBilling } from "../../../billing/billing.middleware";
import { prisma } from "../../../magicreel/db/prisma";

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN as string;

if (!REPLICATE_API_TOKEN) {
  console.warn("⚠️ REPLICATE_API_TOKEN missing - generation disabled");
}

const QWEN_URL =
  "https://api.replicate.com/v1/models/qwen/qwen-image-edit-plus/predictions";

const LOCKED_PROMPT =
  "The person in image 2 adopts the full body pose from image 1, maintaining full body visibility from head to toe, preserving exact facial identity with natural skin texture and sharp facial details, face in natural sharp focus";

const POSES = [
  { id: "P1", type: "front", url: "https://res.cloudinary.com/duaqfspwa/image/upload/v1776236833/left_angle_natb6a.png" },
  { id: "P2", type: "walking", url: "https://res.cloudinary.com/duaqfspwa/image/upload/v1776236833/right_angle_zi2unn.png" },
  { id: "P3", type: "angle", url: "https://res.cloudinary.com/duaqfspwa/image/upload/v1776236833/Front_Walking_c2inmz.png" },
  { id: "P4", type: "dynamic", url: "https://res.cloudinary.com/duaqfspwa/image/upload/v1776236833/both_hand_on_hip_vga17c.png" },
];

function getCroppedImage(url: string): string {
  return url.replace("/upload/", "/upload/c_fill,g_face,h_900,w_700/");
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

    /* ----------------------------------
       ✅ CREATE LOOKBOOK
    ---------------------------------- */

    const lookbook = await prisma.lookbook.create({
      data: {
        userId,
        modelId: "default",
        presetId: "default",
        status: "completed",
        garmentId: "default",
      },
    });

    const poses: any[] = [];

    /* ----------------------------------
       HERO (FRONT)
    ---------------------------------- */

    poses.push({
      poseId: "HERO",
      poseType: "hero",
      imageUrl: heroImageUrl,
    });

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

    /* ----------------------------------
       BACK HERO (OPTIONAL)
    ---------------------------------- */

    if (backHeroImageUrl) {
      poses.push({
        poseId: "BACK",
        poseType: "back",
        imageUrl: backHeroImageUrl,
      });

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

    /* ----------------------------------
       AI POSES
    ---------------------------------- */

    for (const pose of POSES) {
      let finalUrl = heroImageUrl;

      if (REPLICATE_API_TOKEN) {
        try {
          const response = await axios.post(
            QWEN_URL,
            {
              input: {
                image: [pose.url, heroImageUrl],
                prompt: LOCKED_PROMPT,
                aspect_ratio: "9:16",
                output_format: "png",
                output_quality: 95,
                seed: 42,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
                "Content-Type": "application/json",
              },
            }
          );

          const predictionUrl = response.data.urls.get;

          const start = Date.now();

          while (true) {
            if (Date.now() - start > 90000) break;

            const poll = await axios.get(predictionUrl, {
              headers: {
                Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
              },
            });

            const status = poll.data.status;

            if (status === "succeeded") {
              finalUrl = poll.data.output[0];
              break;
            }

            if (status === "failed") break;

            await new Promise((r) => setTimeout(r, 1500));
          }
        } catch {
          finalUrl = heroImageUrl;
        }
      }

      poses.push({
        poseId: pose.id,
        poseType: pose.type,
        imageUrl: finalUrl,
      });

      await prisma.render.create({
        data: {
          pose: pose.type,
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

    /* ----------------------------------
       CROPPED
    ---------------------------------- */

    const frontPose = poses.find(p => p.poseId === "P1");

    if (frontPose?.imageUrl) {
      const croppedUrl = getCroppedImage(frontPose.imageUrl);

      poses.push({
        poseId: "P5",
        poseType: "cropped",
        imageUrl: croppedUrl,
      });

      await prisma.render.create({
        data: {
          pose: "cropped",
          engine: "QWEN",
          type: "LOOKBOOK",
          status: "completed",
          modelImageUrl: heroImageUrl,
          garmentImageUrl: heroImageUrl,
          outputImageUrl: croppedUrl,
          lookbookId: lookbook.id,
        },
      });
    }

    /* ----------------------------------
       BILLING
    ---------------------------------- */

    try {
      await finalizeBilling(req);
    } catch (e) {
      console.error("Lookbook billing failed:", e);
    }

    /* ----------------------------------
       RESPONSE
    ---------------------------------- */

    return res.json({
      success: true,
      poses,
      runId: lookbook.id,
      type: "LOOKBOOK",
    });

  } catch (error) {
    console.error("Lookbook V2 Error:", error);

    return res.status(500).json({
      error: "Lookbook failed",
    });
  }
}