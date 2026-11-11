// Muse collage generation and candidate asset extraction.
import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import axios from "axios";
import { fal } from "@fal-ai/client";
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";
import { buildMusePrompt } from "./muse.prompt";
import { prisma } from "../db/prisma";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const MAX_REFERENCE_AGE = 60;

function signedMuseUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    secure: true,
    type: "authenticated",
    sign_url: true
  });
}

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

    // Check the Muse fee before starting paid image generation.
    const account = await prisma.user.findUnique({ where: { id: userId }, select: { creditsAvailable: true } });
    if (!account || Number(account.creditsAvailable) < 5) {
      return res.status(402).json({ success: false, message: "You need at least 5 credits to generate Muse candidates." });
    }

    // Verify the reference asset belongs to the signed-in user; do not trust a browser-supplied URL.
    const referenceAsset = await cloudinary.api.resource(referencePublicId, { resource_type: "image", type: "authenticated", context: true });
    if (getCustomContext(referenceAsset).owner_id !== userId) {
      return res.status(403).json({ success: false, message: "You do not have permission to use this reference photo." });
    }

    const referenceUrl = signedMuseUrl(referencePublicId);
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
      type: "authenticated",
      format: "png",
      tags: ["muse-generated", "muse-collage"],
      context: {
        owner_id: userId,
        prompt_version: "distinctive-muse-v1",
        reference_public_id: referencePublicId,
      },
    });

    // Split the stored collage into eight independently selectable portrait assets.
    const collageUrl = signedMuseUrl(cloudinaryResult.public_id);
    const collageResponse = await axios.get(collageUrl, { responseType: "arraybuffer" });
    const collageBuffer = Buffer.from(collageResponse.data);
    const metadata = await sharp(collageBuffer).metadata();
    if (!metadata.width || !metadata.height || metadata.width < 4 || metadata.height < 2) {
      throw new Error("The generated Muse collage has invalid dimensions.");
    }

    // Copy validated dimensions to locals so strict TypeScript retains the narrowing inside callbacks.
    const collageWidth = metadata.width;
    const collageHeight = metadata.height;
    const cellWidth = Math.floor(collageWidth / 4);
    const cellHeight = Math.floor(collageHeight / 2);
    const inset = 3;
    const candidates = await Promise.all(
      Array.from({ length: 8 }, async (_unused, index) => {
        const row = Math.floor(index / 4);
        const column = index % 4;
        const left = column * cellWidth + inset;
        const top = row * cellHeight + inset;
        const width = Math.min(cellWidth - inset * 2, collageWidth - left);
        const height = Math.min(cellHeight - inset * 2, collageHeight - top);
        const candidateBuffer = await sharp(collageBuffer)
          .extract({ left, top, width, height })
          .png()
          .toBuffer();

        const candidateAsset = await new Promise<{ secure_url: string; public_id: string; width?: number; height?: number }>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "magicreel/muse/candidates",
              resource_type: "image",
              type: "authenticated",
              format: "png",
              tags: ["muse-candidate", "muse-generated"],
              context: {
                owner_id: userId,
                prompt_version: "distinctive-muse-v1",
                reference_public_id: referencePublicId,
                collage_public_id: cloudinaryResult.public_id,
                candidate_number: String(index + 1),
              },
            },
            (error, uploaded) => {
              if (error || !uploaded?.secure_url || !uploaded.public_id) {
                return reject(error || new Error("Cloudinary did not return a Muse candidate image."));
              }
              resolve({
                secure_url: uploaded.secure_url,
                public_id: uploaded.public_id,
                width: uploaded.width,
                height: uploaded.height,
              });
            }
          );
          stream.end(candidateBuffer);
        });

        return {
          candidateNumber: index + 1,
          imageUrl: signedMuseUrl(candidateAsset.public_id),
          publicId: candidateAsset.public_id,
          width: candidateAsset.width || width,
          height: candidateAsset.height || height,
        };
      })
    );

    // Charge immediately after the eight selectable candidates are safely stored.
    // This prevents refreshing the page after generation from making the collage free.
    await prisma.$transaction(async (tx: any) => {
      const debit = await tx.user.updateMany({
        where: { id: userId, creditsAvailable: { gte: 5 } },
        data: { creditsAvailable: { decrement: 5 } }
      });
      if (debit.count !== 1) throw new Error("INSUFFICIENT_MUSE_CREDITS");
      await tx.creditTransaction.create({
        data: {
          userId,
          feature: "MUSE_GENERATION",
          credits: 5,
          type: "DEBIT",
          status: "COMPLETED",
          referenceId: cloudinaryResult.public_id
        }
      });
    });

    return res.status(201).json({
      success: true,
      data: {
        imageUrl: collageUrl,
        publicId: cloudinaryResult.public_id,
        width: cloudinaryResult.width || generatedImage.width,
        height: cloudinaryResult.height || generatedImage.height,
        candidateCount: 8,
        layout: "4x2",
        candidates,
      },
    });
  } catch (error: any) {
    const message = error instanceof Error ? error.message : "Muse generation failed.";
    console.error("[Muse] Generation failed:", { message, name: error?.name, httpStatus: error?.http_code || error?.status || error?.response?.status, providerBody: error?.response?.data || error?.error || undefined, stack: error?.stack });
    if (message === "INSUFFICIENT_MUSE_CREDITS") {
      return res.status(402).json({ success: false, message: "You need at least 5 credits to generate Muse candidates." });
    }
    if (axios.isAxiosError(error)) {
      return res.status(502).json({ success: false, message: "The image generation provider could not complete the request. Please try again." });
    }
    return res.status(500).json({ success: false, message: "Muse generation failed. Please try again." });
  }
});


const MUSE_IMAGE_MODEL = "openai/gpt-image-2.5/sunburst/edit";
const MUSE_ASSET_WIDTH = 1856;
const MUSE_ASSET_HEIGHT = 2304;

type MuseAssetRole = "master-portrait" | "placeholder" | "front-hero" | "back-hero";
type UploadedMuseAsset = { secure_url: string; public_id: string; width: number; height: number };

const MUSE_ASSET_PROMPTS: Record<MuseAssetRole, string> = {
  "master-portrait": [
    "Create a premium, photorealistic master identity portrait of the exact adult fashion model shown in the reference image.",
    "Preserve the selected face identity precisely: same facial structure, eyes, nose, lips, skin tone, age appearance and hairstyle. Do not reinterpret or substitute the identity.",
    "Straight-on, perfectly front-facing passport-style fashion portrait; head, neck and both shoulders visible; eyes looking directly into camera; calm neutral expression.",
    "Simple light grey to white seamless studio background, soft even studio lighting, natural skin texture, no accessories, no text, no watermark.",
    "Vertical 4:5 composition. Keep the complete head and shoulders comfortably inside frame."
  ].join(" "),
  placeholder: [
    "Create a photorealistic customer-facing full upper-body fashion model placeholder using the exact adult model identity in the reference image.",
    "Preserve the face, facial proportions, skin tone and hairstyle exactly. Straight-on front-facing pose, symmetrical shoulders, natural confident expression.",
    "The model wears a plain royal-blue crew-neck T-shirt. Place a small, clean white MagicReel wordmark/logo on the wearer's anatomical LEFT chest (viewer-right side), discreet and correctly aligned. No other text or graphics.",
    "Light grey/white seamless studio background, soft even lighting, premium commercial fashion photography, natural anatomy and skin texture.",
    "Vertical 4:5 composition. Show head, shoulders and upper torso."
  ].join(" "),
  "front-hero": [
    "Create a photorealistic front Hero reference image for the exact adult fashion model in the reference image.",
    "Preserve the selected face identity and hairstyle precisely. Straight-on, directly front-facing, symmetrical head position and level shoulders; both shoulders evenly visible.",
    "Bare shoulders and upper chest, modest non-sexual fashion-model reference styling, no garment, no jewellery, no accessories.",
    "Light grey studio background, soft even studio lighting, neutral expression, natural skin texture, realistic anatomy.",
    "Vertical 4:5 composition. Keep head, neck, shoulders and upper chest fully inside frame."
  ].join(" "),
  "back-hero": [
    "Create a photorealistic BACK Hero reference image for the exact same adult fashion model shown in the reference image.",
    "Preserve the same identity, hair colour, hairstyle, hair length, skin tone and body proportions.",
    "Show a true rear three-quarter fashion reference: rotate the model's torso only about 25–30 degrees away from a full back view, so the upper back is visible while the full width of BOTH shoulders remains inside the frame.",
    "Keep the shoulder line horizontal and unobstructed. Frame wide enough to include the complete left shoulder tip, right shoulder tip, neck, and upper back with generous space on both sides. Do not crop either shoulder or let either shoulder disappear behind the torso.",
    "Turn the model's head gently toward the model's OWN RIGHT shoulder, showing only a subtle partial profile. Keep the head aligned naturally with the neck; do not over-rotate the head or torso.",
    "Bare shoulders and upper back, modest non-sexual fashion-model reference styling, no garment, no jewellery, no accessories.",
    "Light grey studio background, soft even studio lighting, natural skin texture and realistic anatomy. Anatomically correct shoulder width and symmetrical shoulder placement.",
    "Vertical 4:5 composition, medium upper-body crop from head to mid-back. The complete head, neck, both shoulder caps and full shoulder width must be visible with no cropping."
  ].join(" ")
};

async function generateAndStoreMuseAsset(
  userId: string,
  candidateUrl: string,
  role: MuseAssetRole
): Promise<UploadedMuseAsset> {
  const result = await fal.subscribe(MUSE_IMAGE_MODEL, {
    input: {
      prompt: MUSE_ASSET_PROMPTS[role],
      image_urls: [candidateUrl],
      num_images: 1,
      output_format: "png",
      quality: "medium",
      image_size: { width: MUSE_ASSET_WIDTH, height: MUSE_ASSET_HEIGHT }
    },
    logs: true,
    onQueueUpdate(update) {
      if (update.status === "IN_PROGRESS") {
        for (const log of update.logs ?? []) console.info("[Muse/Assets]", role, log.message);
      }
    }
  });

  const data = result.data as { images?: Array<{ url: string; width?: number; height?: number }> };
  const generated = data.images?.[0];
  if (!generated?.url) throw new Error(`Fal returned no image for Muse asset: ${role}`);

  const response = await axios.get<ArrayBuffer>(generated.url, {
    responseType: "arraybuffer",
    timeout: 120000
  });
  const source = Buffer.from(response.data);
  const normalized = await sharp(source)
    .resize(MUSE_ASSET_WIDTH, MUSE_ASSET_HEIGHT, { fit: "cover", position: "attention" })
    .png()
    .toBuffer();

  return new Promise<UploadedMuseAsset>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "magicreel/muse/assets",
        resource_type: "image",
        type: "authenticated",
        format: "png",
        tags: ["muse-generated", "muse-private-asset", role],
        context: {
          owner_id: userId,
          asset_role: role,
          model_endpoint: MUSE_IMAGE_MODEL,
          width: String(MUSE_ASSET_WIDTH),
          height: String(MUSE_ASSET_HEIGHT)
        }
      },
      (error, uploaded) => {
        if (error || !uploaded?.secure_url || !uploaded.public_id) {
          return reject(error || new Error(`Cloudinary did not store Muse asset: ${role}`));
        }
        if (uploaded.width !== MUSE_ASSET_WIDTH || uploaded.height !== MUSE_ASSET_HEIGHT) {
          return reject(new Error(`Muse asset dimensions were not normalized for ${role}`));
        }
        resolve({
          secure_url: uploaded.secure_url,
          public_id: uploaded.public_id,
          width: uploaded.width,
          height: uploaded.height
        });
      }
    );
    stream.end(normalized);
  });
}


router.post("/create-from-candidate", authenticateMuseRequest, async (req: MuseRequest, res: Response) => {
  const createdPublicIds: string[] = [];
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required." });

    const { candidatePublicId, candidateNumber, age, gender, consent, name } = req.body ?? {};
    const numericAge = Number(age);
    const numericCandidateNumber = Number(candidateNumber);

    if (consent !== true) {
      return res.status(400).json({ success: false, message: "Please confirm that you have the right and necessary consent to use this photograph." });
    }
    if (!Number.isInteger(numericAge) || numericAge < 18 || numericAge > MAX_REFERENCE_AGE) {
      return res.status(400).json({ success: false, message: "Muse age must be between 18 and 60." });
    }
    if (![ "auto", "female", "male" ].includes(gender)) {
      return res.status(400).json({ success: false, message: "Gender must be Auto, Female or Male." });
    }
    if (!Number.isInteger(numericCandidateNumber) || numericCandidateNumber < 1 || numericCandidateNumber > 8) {
      return res.status(400).json({ success: false, message: "Select one of the eight generated Muse candidates." });
    }
    if (typeof candidatePublicId !== "string" || !candidatePublicId.startsWith("magicreel/muse/candidates/")) {
      return res.status(400).json({ success: false, message: "A valid Muse candidate is required." });
    }
    const museName = typeof name === "string" && name.trim() ? name.trim().slice(0, 48) : `My Muse ${numericCandidateNumber}`;

    const candidateAsset = await cloudinary.api.resource(candidatePublicId, { resource_type: "image", type: "authenticated", context: true });
    const candidateContext = getCustomContext(candidateAsset);
    if (candidateContext.owner_id !== userId) {
      return res.status(403).json({ success: false, message: "You do not have permission to use this Muse candidate." });
    }
    if (candidateContext.candidate_number && Number(candidateContext.candidate_number) !== numericCandidateNumber) {
      return res.status(400).json({ success: false, message: "The selected candidate number does not match the uploaded candidate." });
    }
    const candidateUrl = signedMuseUrl(candidatePublicId);

    console.info("[Muse] Generating four selected-identity assets", { userId, candidateNumber: numericCandidateNumber });

    const masterPortrait = await generateAndStoreMuseAsset(userId, candidateUrl, "master-portrait");
    createdPublicIds.push(masterPortrait.public_id);

    const placeholder = await generateAndStoreMuseAsset(userId, candidateUrl, "placeholder");
    createdPublicIds.push(placeholder.public_id);

    const frontHero = await generateAndStoreMuseAsset(userId, candidateUrl, "front-hero");
    createdPublicIds.push(frontHero.public_id);

    const backHero = await generateAndStoreMuseAsset(userId, candidateUrl, "back-hero");
    createdPublicIds.push(backHero.public_id);

    // Save the four private production assets against the authenticated user.
    // The Muse fee was already charged when the eight candidates were generated.
    const muse = await prisma.muse.create({
        data: {
          userId,
          name: museName,
          age: numericAge,
          gender,
          candidateNumber: numericCandidateNumber,
          candidateImageUrl: candidateUrl,
          candidatePublicId,
          masterPortraitUrl: masterPortrait.secure_url,
          masterPortraitPublicId: masterPortrait.public_id,
          placeholderImageUrl: placeholder.secure_url,
          placeholderPublicId: placeholder.public_id,
          processingImageUrl: frontHero.secure_url,
          processingPublicId: frontHero.public_id,
          processingBackImageUrl: backHero.secure_url,
          processingBackPublicId: backHero.public_id,
          promptVersion: "distinctive-muse-v1",
          status: "READY"
        }
    });

    return res.status(201).json({
      success: true,
      data: {
        id: muse.id,
        name: muse.name,
        age: muse.age,
        gender: muse.gender,
        candidateNumber: muse.candidateNumber,
        masterPortraitUrl: signedMuseUrl(muse.masterPortraitPublicId),
        placeholderImageUrl: signedMuseUrl(muse.placeholderPublicId),
        processingImageUrl: signedMuseUrl(muse.processingPublicId),
        processingBackImageUrl: signedMuseUrl(muse.processingBackPublicId),
        status: muse.status,
        createdAt: muse.createdAt
      }
    });
  } catch (error: any) {
    if (createdPublicIds.length) {
      try {
        await cloudinary.api.delete_resources(createdPublicIds, { resource_type: "image", type: "authenticated" });
      } catch (cleanupError) {
        console.error("[Muse] Failed to clean up incomplete asset set:", cleanupError instanceof Error ? cleanupError.message : "Unknown cleanup error");
      }
    }
    const message = error instanceof Error ? error.message : "Muse asset generation failed.";
    console.error("[Muse] Selected-identity asset generation failed:", { message, name: error?.name, httpStatus: error?.http_code || error?.status || error?.response?.status, providerBody: error?.response?.data || error?.error || undefined, stack: error?.stack });
    if (message === "INSUFFICIENT_MUSE_CREDITS") {
      return res.status(402).json({ success: false, message: "You need at least 5 credits to create a Muse. No credits were deducted." });
    }
    if (axios.isAxiosError(error)) {
      return res.status(502).json({ success: false, message: "The image generation provider could not complete the Muse assets. Please try again." });
    }
    return res.status(500).json({ success: false, message: "Muse asset generation failed. No incomplete Muse was saved." });
  }
});

// Railway production rebuild trigger: keep deployment source on main.
export default router;
