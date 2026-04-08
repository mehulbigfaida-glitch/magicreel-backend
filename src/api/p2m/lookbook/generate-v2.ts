import { Request, Response } from "express";
import axios from "axios";
import { finalizeBilling } from "../../../billing/billing.middleware";
import { prisma } from "../../../magicreel/db/prisma";
import cloudinary from "cloudinary";

/* =========================
   ✅ CLOUDINARY CONFIG
========================= */
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

async function uploadToCloudinary(imageUrl: string): Promise<string> {
  try {
    const res = await cloudinary.v2.uploader.upload(imageUrl, {
      folder: "magicreel/lookbook",
    });
    return res.secure_url;
  } catch (e) {
    console.error("Cloudinary upload failed:", e);
    return imageUrl; // ✅ fallback (no break)
  }
}

/* =========================
   ORIGINAL CONFIG
========================= */
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN as string;

if (!REPLICATE_API_TOKEN) {
  console.warn("⚠️ REPLICATE_API_TOKEN missing - generation disabled");
}

const QWEN_URL =
  "https://api.replicate.com/v1/models/qwen/qwen-image-edit-plus/predictions";

const LOCKED_PROMPT =
  "The person in image 2 adopts the full body pose from image 1, maintaining full body visibility from head to toe, preserving exact facial identity with natural skin texture and sharp facial details, face in natural sharp focus";

const POSES = [
  { id: "P1", type: "front", url: "https://res.cloudinary.com/duaqfspwa/image/upload/v1773921649/P1_bte2lx.png" },
  { id: "P2", type: "walking", url: "https://res.cloudinary.com/duaqfspwa/image/upload/v1773921649/P2_exbtqy.png" },
  { id: "P3", type: "angle", url: "https://res.cloudinary.com/duaqfspwa/image/upload/v1773921649/P3_hkimui.png" },
  { id: "P4", type: "dynamic", url: "https://res.cloudinary.com/duaqfspwa/image/upload/v1773921648/p4_gilyuf.png" },
];

function getCroppedImage(url: string): string {
  return url.replace("/upload/", "/upload/c_fill,g_face,h_900,w_700/");
}

/* =========================
   MAIN FUNCTION
========================= */
export async function generateLookbookV2(req: Request, res: Response) {
  try {
    const { heroImageUrl, backHeroImageUrl } = req.body;

    if (!heroImageUrl) {
      return res.status(400).json({ error: "heroImageUrl required" });
    }

    const poses: any[] = [];

    poses.push({
      poseId: "HERO",
      poseType: "hero",
      imageUrl: heroImageUrl,
    });

    if (backHeroImageUrl) {
      poses.push({
        poseId: "BACK",
        poseType: "back",
        imageUrl: backHeroImageUrl,
      });
    }

    for (const pose of POSES) {
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

        let finalUrl = heroImageUrl;
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
            const replicateUrl = poll.data.output[0];

            // ✅ SAFE ADDITION (ONLY CHANGE)
            finalUrl = await uploadToCloudinary(replicateUrl);

            break;
          }

          if (status === "failed") break;

          await new Promise((r) => setTimeout(r, 1500));
        }

        poses.push({
          poseId: pose.id,
          poseType: pose.type,
          imageUrl: finalUrl,
        });

      } catch {
        poses.push({
          poseId: pose.id,
          poseType: pose.type,
          imageUrl: heroImageUrl,
        });
      }
    }

    const frontPose = poses.find(p => p.poseId === "P1");

    if (frontPose?.imageUrl) {
      poses.push({
        poseId: "P5",
        poseType: "cropped",
        imageUrl: getCroppedImage(frontPose.imageUrl),
      });
    }

    /* =========================
       BILLING
    ========================= */
    try {
      await finalizeBilling(req);
    } catch (e) {
      console.error("Lookbook billing failed:", e);
    }

    /* =========================
       SAVE TO DB
    ========================= */
    try {
      const lookbookEntry = await prisma.lookbook.create({
        data: {
          presetId: "default",
          status: "completed",
          garmentId: "garment-default-1",
          userId: (req as any).user?.id || "dev-user-1",
          modelId: "model-default-1",
        },
      });

      for (const pose of poses) {
        if (!pose.imageUrl) continue;

        await prisma.render.create({
          data: {
            outputImageUrl: pose.imageUrl,
            type: "LOOKBOOK",
            status: "completed",
            pose: pose.poseType,
            engine: "QWEN",
            modelImageUrl: heroImageUrl,
            garmentImageUrl: heroImageUrl,
            lookbookId: lookbookEntry.id,
          },
        });
      }

      console.log("✅ Lookbook saved to DB:", poses.length);

    } catch (e) {
      console.error("❌ Lookbook DB save failed:", e);
    }

    return res.json({
      success: true,
      poses,
    });

  } catch (error) {
    console.error("Lookbook V2 Error:", error);

    return res.status(500).json({
      error: "Lookbook failed",
    });
  }
}