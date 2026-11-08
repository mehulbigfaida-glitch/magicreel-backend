import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import axios from "axios";
import { fal } from "@fal-ai/client";
import { v2 as cloudinary } from "cloudinary";
import { buildMusePrompt } from "./muse.prompt";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const MAX_REFERENCE_AGE = 60;

type TokenPayload = jwt.JwtPayload & { id?: string; userId?: string };
type MuseRequest = Request & { user?: { id: string } };

fal.config({ credentials: process.env.FAL_KEY! });

function authenticateMuseRequest(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7).trim() : undefined;
  if (!token) return res.status(401).json({ success: false, message: "Authentication required." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    const userId = decoded.id || decoded.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Invalid authentication token." });
    (req as MuseRequest).user = { id: userId };
    return next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired authentication token." });
  }
}

function getCustomContext(resource: any): Record<string, string> {
  return resource?.context?.custom || {};
}

router.post("/generate-faces", authenticateMuseRequest, async (req: MuseRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required." });

    const { referencePublicId, age, gender, consent } = req.body ?? {};
    const numericAge = Number(age);

    if (consent !== true) {
      return res.status(400).json({ success: false, message: "Please confirm that you have the right and necessary consent to use this photograph." });
    }
    if (!Number.isInteger(numericAge) || numericAge < 18 || numericAge > MAX_REFERENCE_AGE) {
      return res.status(400).json({ success: false, message: "Target age must be between 18 and 60." });
    }
    if (!["auto", "female", "male"].includes(gender)) {
      return res.status(400).json({ success: false, message: "Gender must be Auto, Female or Male." });
    }
    if (typeof referencePublicId !== "string" || !referencePublicId.startsWith("magicreel/muse/references/")) {
      return res.status(400).json({ success: false, message: "A valid uploaded Muse reference photo is required." });
    }

    // Verify the reference asset belongs to the signed-in user; do not trust a browser-supplied URL.
    const referenceAsset = await cloudinary.api.resource(referencePublicId, { context: true });
    if (getCustomContext(referenceAsset).owner_id !== userId) {
      return res.status(403).json({ success: false, message: "You do not have permission to use this reference photo." });
    }

    const referenceUrl = referenceAsset.secure_url;
    if (!referenceUrl) throw new Error("The reference photo is missing its secure Cloudinary URL.");

    const prompt = buildMusePrompt(numericAge, gender);
    console.info("[Muse] Starting eight-face collage generation", { userId, age: numericAge, gender });

    const result = await fal.subscribe("openai/gpt-image-2.5/sunburst/edit", {
      input: {
        prompt,
        image_urls: [referenceUrl],
        num_images: 1,
        output_format: "png",
        quality: "medium",
        image_size: { width: 2048, height: 1024 },
      },
      logs: true,
      onQueueUpdate(update) {
        if (update.status === "IN_PROGRESS") {
          for (const log of update.logs ?? []) console.info("[Muse/Fal]", log.message);
        }
      },
    });

    const data = result.data as { images?: Array<{ url: string; width?: number; height?: number }> };
    const generatedImage = data.images?.[0];
    if (!generatedImage?.url) throw new Error("Fal returned no Muse collage image.");

    const cloudinaryResult = await cloudinary.uploader.upload(generatedImage.url, {
      folder: "magicreel/muse/generated",
      resource_type: "image",
      format: "png",
      tags: ["muse-generated", "muse-collage"],
      context: {
        owner_id: userId,
        prompt_version: "distinctive-muse-v1",
        reference_public_id: referencePublicId,
      },
    });

    return res.status(201).json({
      success: true,
      data: {
        imageUrl: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
        width: cloudinaryResult.width || generatedImage.width,
        height: cloudinaryResult.height || generatedImage.height,
        candidateCount: 8,
        layout: "4x2",
      },
    });
  } catch (error: any) {
    const message = error instanceof Error ? error.message : "Muse generation failed.";
    console.error("[Muse] Generation failed:", message);
    if (axios.isAxiosError(error)) {
      return res.status(502).json({ success: false, message: "The image generation provider could not complete the request. Please try again." });
    }
    return res.status(500).json({ success: false, message: "Muse generation failed. Please try again." });
  }
});

export default router;
