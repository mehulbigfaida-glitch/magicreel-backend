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
"Single-shot luxury fashion turntable. Smooth continuous full 360-degree orbit around the subject. Begin at the exact front view, reveal the left profile, full back view matching the reference image, right profile, and return to the identical front view, completing one full revolution. Stable studio lighting, consistent framing, seamless motion, luxury fashion catalog quality.",

  start_image_url: payload.heroImageUrl,

  duration: "5",

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
    "partial rotation, incomplete revolution, stopping halfway, reversing direction, pose changes, garment distortion, flicker, cuts, transitions",

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