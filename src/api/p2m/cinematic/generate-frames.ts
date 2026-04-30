import { Request, Response } from "express";
import axios from "axios";
import crypto from "crypto";
import { prisma } from "../../../magicreel/db/prisma";
import {
  buildWorld,
  CinematicTheme,
} from "../../../magicreel/cinematic/cinematicWorld.registry";
import {
  buildCinematicPrompt,
  CinematicFrameType,
} from "../../../magicreel/cinematic/cinematicPrompt.builder";

const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN!;

function hashSeed(input: string): number {
  const hash = crypto.createHash("md5").update(input).digest("hex");
  return parseInt(hash.substring(0, 8), 16);
}

async function pollPrediction(getUrl: string) {
  while (true) {
    const poll = await axios.get(getUrl, {
      headers: {
        Authorization: `Bearer ${REPLICATE_TOKEN}`,
      },
    });

    if (poll.data.status === "succeeded") return poll.data;
    if (poll.data.status === "failed")
      throw new Error("Prediction failed");

    await new Promise((r) => setTimeout(r, 1500));
  }
}

export async function generateCinematicFrames(
  req: Request,
  res: Response
) {
  try {
    const user = (req as any).user;
    const { heroImageUrl, theme = "runway" } = req.body;

    if (!heroImageUrl) {
      return res.status(400).json({
        error: "heroImageUrl required",
      });
    }

    const seed = hashSeed(heroImageUrl + theme);
    const world = buildWorld(theme as CinematicTheme, seed);

    const frameSequence: CinematicFrameType[] = [
      "entrance",
      "mid_walk",
      "upper_power",
      "angle_45",
      "detail_motion",
      "final_pose",
    ];

    const frames: string[] = [];

    for (const frame of frameSequence) {
      const prompt = buildCinematicPrompt(world, frame);

      const prediction = await axios.post(
        "https://api.replicate.com/v1/models/qwen/qwen-image-edit-plus/predictions",
        {
          input: {
            image: [heroImageUrl],
            prompt,
            aspect_ratio: "9:16",
            go_fast: true,
            output_format: "png",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${REPLICATE_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await pollPrediction(
        prediction.data.urls.get
      );

      frames.push(result.output[0]);
    }

    const cinematicLookbook =
      await prisma.cinematicLookbook.create({
        data: {
          userId: user.id,
          heroImageUrl,
          theme,
          seed,
          worldConfig: world as any,
          frames: frames as any,
        },
      });

    return res.json({
      success: true,
      lookbookId: cinematicLookbook.id,
      frames,
      world,
    });
  } catch (error) {
    console.error("CINEMATIC FRAME ERROR:", error);
    return res.status(500).json({
      error: "Failed to generate cinematic lookbook",
    });
  }
}