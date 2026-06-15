import { fal } from "@fal-ai/client";
import { prisma } from "../db/prisma";
import {
  Generate360ReelRequest,
  Generate360ReelResponse,
  Reel360StatusResponse,
} from "./reels360.types";

export class Reels360Service {
  async generate(
    payload: Generate360ReelRequest
  ): Promise<Generate360ReelResponse> {
    console.log("================================");
    console.log("360 REEL GENERATION REQUEST");
    console.log("Hero:", payload.heroImageUrl);
    console.log("Back Hero:", payload.backHeroImageUrl);
    console.log("================================");

    const result = await fal.queue.submit(
      "fal-ai/kling-video/v3/standard/image-to-video",
      {
        input: {
          prompt:
            "A single-shot fashion turntable sequence in a professional studio. The camera performs a smooth continuous 360-degree orbit around the model at a constant speed. Begin at the exact front view of the subject. Rotate smoothly past the left side profile, fully reveal the back view matching the provided back-reference image exactly, continue past the right side profile, and return precisely to the original front view, completing a seamless full 360-degree loop. Maintain perfect identity consistency throughout the entire rotation. Preserve identical facial features, hairstyle, body proportions, skin tone, pose structure, and overall appearance from start to finish. Maintain complete garment consistency throughout the orbit. Preserve all garment details including fabric texture, stitching, embroidery, prints, logos, patterns, folds, draping, fit, silhouette, sleeve structure, hemline, and garment construction exactly as shown in the provided reference images. The back view must accurately match the provided back-reference image. Side profiles must appear as natural transitions between the front and back views without distortion, hallucination, or garment reconstruction errors. Use smooth cinematic motion with uniform rotational speed. Keep the subject centered throughout the entire orbit. Clean luxury fashion studio environment, neutral seamless backdrop, professional softbox lighting, stable shadows, premium commercial fashion photography quality, realistic fabric behavior, photorealistic rendering, high detail, 30fps. Seamless full-orbit motion, continuous single take, no cuts, no transitions, no scene changes, no black frames, no freeze frames, no duplicate frames, and no interruptions.",

          start_image_url: payload.heroImageUrl,

          duration: "6",

          generate_audio: false,

          elements: [
            {
              reference_image_urls: [
                payload.backHeroImageUrl,
              ],
              frontal_image_url:
                payload.heroImageUrl,
            },
          ],

          shot_type: "customize",

          negative_prompt:
            "180-degree rotation only, incomplete orbit, stopping halfway, reversing direction, snap-back motion, teleporting, camera shake, camera drift, camera wobble, zooming, reframing, subject movement, walking, pose changes, face distortion, identity drift, hairstyle changes, body shape changes, garment warping, fabric melting, texture loss, logo distortion, embroidery distortion, sleeve deformation, silhouette changes, incorrect back view, inconsistent side views, flickering lighting, changing shadows, background flicker, scene changes, cuts, transitions, crossfades, black frames, duplicate frames, low detail, blur, artifacts",

          cfg_scale: 0.5,
        },
      }
    );

    console.log("================================");
    console.log("FAL REQUEST CREATED");
    console.log(result);
    console.log("================================");

    return {
      success: true,
      runId:
        (result as any).request_id ??
        (result as any).requestId,
    };
  }

  async getStatus(
  runId: string
): Promise<Reel360StatusResponse> {
  console.log("================================");
  console.log("360 REEL STATUS REQUEST");
  console.log("Run ID:", runId);
  console.log("================================");

  const status = await fal.queue.status(
    "fal-ai/kling-video/v3/standard/image-to-video",
    {
      requestId: runId,
      logs: true,
    }
  );

  console.log("FAL STATUS:", status);

  if (status.status === "COMPLETED") {

  const result = await fal.queue.result(
    "fal-ai/kling-video/v3/standard/image-to-video",
    {
      requestId: runId,
    }
  );

  const videoUrl =
    (result as any)?.data?.video?.url;

  const reelJob =
    await (prisma as any).reelJob.findUnique({
      where: {
        id: runId,
      },
    });

  if (reelJob) {

    await (prisma as any).reelJob.update({
      where: {
        id: runId,
      },
      data: {
        status: "completed",
        reelVideoUrl: videoUrl,
      },
    });

    const existingRender =
      await prisma.render.findFirst({
        where: {
          reelVideoUrl: videoUrl,
        },
      });

    if (!existingRender) {

      await prisma.render.create({
        data: {
          outputImageUrl: null,

          reelVideoUrl: videoUrl,

          type: "REEL",

          status: "completed",

          pose: "REEL_360",

          engine: "KLING_V3",

          modelImageUrl:
            reelJob.inputImageUrl,

          garmentImageUrl:
            reelJob.inputImageUrl,

          lookbook: {
            connect: {
              id: "lookbook-default-1",
            },
          },
        },
      });

    }
  }

  return {
    success: true,
    status: "completed",
    videoUrl,
  };
}

  if ((status as any).status === "FAILED") {
  return {
    success: false,
    status: "failed",
  };
}

  if (status.status === "IN_QUEUE") {
    return {
      success: true,
      status: "queued",
    };
  }

  return {
    success: true,
    status: "processing",
  };
}
}

export const reels360Service =
  new Reels360Service();