import { Request, Response } from "express";
import axios from "axios";
import { fal } from "@fal-ai/client";
import fs from "fs";
import path from "path";
import os from "os";

import { prisma } from "../../../magicreel/db/prisma";
import { finalizeBilling } from "../../../billing/billing.middleware";
import { uploadToCloudinary } from "../../../utils/cloudinary";
import { supabase } from "../../../lib/supabase";

import {
  buildLookbookPrompt,
} from "./lookbookPromptComposer";

import {
  getLookbookCategoryPoses,
} from "./lookbookPoseRegistry";

fal.config({
  credentials: process.env.FAL_KEY!,
});

const { randomUUID } = require("crypto");

async function downloadImage(
  url: string,
  filename: string
) {
  const tempDir = os.tmpdir();

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, {
      recursive: true,
    });
  }

  const filePath =
    path.join(
      tempDir,
      filename
    );

  const response =
    await axios.get(
      url,
      {
        responseType:
          "arraybuffer",
      }
    );

  fs.writeFileSync(
    filePath,
    response.data
  );

  return filePath;
}

export async function generateLookbookV1(
  req: Request,
  res: Response
) {

  try {

    const {
      heroImageUrl,
      backHeroImageUrl,
      lookbookWorld,
      gender,
      category,
    } = req.body;

    /* -------------------------
       VALIDATION
    -------------------------- */

    if (!heroImageUrl) {
      return res.status(400).json({
        error:
          "heroImageUrl required",
      });
    }

    if (!lookbookWorld) {
      return res.status(400).json({
        error:
          "lookbookWorld required",
      });
    }

    if (!gender || !category) {
      return res.status(400).json({
        error:
          "gender and category required",
      });
    }

    const categoryPosePlan =
      getLookbookCategoryPoses(
        category
      );

    if (!categoryPosePlan) {
      return res.status(400).json({
        error:
          `Unsupported Lookbook category: ${category}`,
      });
    }

    const userId =
      (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        error:
          "Unauthorized",
      });
    }

    /* -------------------------
       LOOKBOOK ROW
    -------------------------- */

    const lookbook =
      await prisma.lookbook.create({

        data: {

          user: {
            connect: {
              id: userId,
            },
          },

          garment: {
            connect: {
              id:
                "garment-default-1",
            },
          },

          modelId:
            "default",

          presetId:
            lookbookWorld ||
            "default",

          status:
            "running",

        },

      });

    /* -------------------------
       BILLING OBJECT
    -------------------------- */

    (req as any).billing = {

      userId,

      feature:
        "LOOKBOOK_ECOM",

      creditsRequired:
        2,

      predictionId:
        lookbook.id,

    };

    /* -------------------------
       RETURN IMMEDIATELY
    -------------------------- */

    res.status(202).json({

      success:
        true,

      runId:
        lookbook.id,

      status:
        "processing",

    });

    /* -------------------------
       BACKGROUND LOOKBOOK JOB
    -------------------------- */

    setImmediate(async () => {

      const poses: any[] = [];

      /* -------------------------
         LOOKBOOK SHOT GENERATOR
      -------------------------- */

      async function generateShot(
        poseId: string,
        shotType:
          | "front"
          | "back"
          | "pose",
        referenceImages: string[],
        pose?: any
      ) {

        const prompt =
          buildLookbookPrompt({
            category,
            gender,
            worldId:
              lookbookWorld,
            shotType,
            pose,
          });

        console.log(
          "🎨 LOOKBOOK SHOT:",
          {
            poseId,
            shotType,
            world:
              lookbookWorld,
            category,
          }
        );

        const result =
          await fal.subscribe(
            "openai/gpt-image-2/edit",
            {
              input: {

                prompt,

                image_urls:
                  referenceImages,

                num_images:
                  1,

                quality:
                  "medium",

                output_format:
                  "png",

                image_size: {
                  width:
                    2048,
                  height:
                    2736,
                },

              },

              logs:
                true,

            }
          );

        const image =
          result?.data
            ?.images?.[0];

        if (!image?.url) {

          throw new Error(
            `GPT Image 2 returned no image for ${poseId}`
          );

        }

        const localPath =
          await downloadImage(
            image.url,
            `${lookbook.id}_${poseId}.png`
          );

        const uploaded =
          await uploadToCloudinary(
            localPath,
            {
              folder:
                "magicreel/lookbooks",

              public_id:
                `${lookbook.id}_${poseId}`,
            }
          );

        const finalUrl =
          uploaded.secure_url;

        poses.push({

          poseId,

          imageUrl:
            finalUrl,

        });

        await prisma.render.create({

          data: {

            pose:
              poseId,

            engine:
              "GPT_IMAGE_2_MEDIUM",

            type:
              "LOOKBOOK",

            status:
              "completed",

            modelImageUrl:
              referenceImages[0],

            garmentImageUrl:
              referenceImages[0],

            outputImageUrl:
              finalUrl,

            lookbookId:
              lookbook.id,

          },

        });

        console.log(
          `✅ LOOKBOOK ${poseId} complete`
        );

        return finalUrl;
      }

      try {

        /* -------------------------
           FRONT REGENERATION
        -------------------------- */

        const lookbookFrontUrl =
          await generateShot(
            "front",
            "front",
            [heroImageUrl]
          );

        /* -------------------------
           BACK REGENERATION
        -------------------------- */

        if (backHeroImageUrl) {

          await generateShot(
            "back",
            "back",
            [backHeroImageUrl]
          );

        }

        /* -------------------------
           CATEGORY POSES
        -------------------------- */

        for (
          const pose
          of categoryPosePlan.poses
        ) {

          await generateShot(
            pose.id,
            "pose",
            [lookbookFrontUrl],
            pose
          );

        }

        console.log(
          "✅ LOOKBOOK V3 COMPLETE"
        );

        /* -------------------------
           SHARE ASSET
        -------------------------- */

        const shareId =
          randomUUID();

        await supabase
          .from(
            "share_assets"
          )
          .insert([

            {

              id:
                shareId,

              type:
                "lookbook",

              media:
                poses.map(
                  (
                    p,
                    index
                  ) => ({

                    kind:
                      "image",

                    url:
                      p.imageUrl,

                    pose:
                      index,

                  })
                ),

              metadata: {

                poses:
                  poses.map(
                    (
                      _,
                      i
                    ) => i
                  ),

                aspectRatio:
                  "2:3",

              },

            },

          ]);

        console.log(
          "✅ SHARE ASSET INSERTED"
        );

        /* -------------------------
           FINAL BILLING
        -------------------------- */

        console.log(
          "✅ STARTING BILLING"
        );

        await finalizeBilling(
          req
        );

        console.log(
          "✅ BILLING COMPLETE"
        );

        /* -------------------------
           MARK COMPLETE
        -------------------------- */

        await prisma.lookbook.update({

          where: {
            id:
              lookbook.id,
          },

          data: {
            status:
              "completed",
          },

        });

        console.log(
          "✅ LOOKBOOK BACKGROUND JOB COMPLETE",
          {
            runId:
              lookbook.id,

            poses:
              poses.length,

            shareId,
          }
        );

      } catch (
        error: any
      ) {

        console.error(
          "❌ LOOKBOOK BACKGROUND JOB FAILED",
          error
        );

        await prisma.lookbook.update({

          where: {
            id:
              lookbook.id,
          },

          data: {
            status:
              "failed",
          },

        }).catch(
          (
            updateError
          ) => {

            console.error(
              "❌ Failed updating Lookbook status:",
              updateError
            );

          }
        );

      }

    });

  } catch (
    error: any
  ) {

    console.error(
      "❌ LOOKBOOK REQUEST FAILED",
      error
    );

    return res.status(500).json({

      error:
        "Lookbook failed",

    });

  }

}