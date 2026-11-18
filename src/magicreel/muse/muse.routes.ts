import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "../db/prisma";
import { hashManifest, verifyManifestHash } from "./muse.provenance";

const router = Router();
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

function signedMuseUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    secure: true,
    type: "authenticated",
    sign_url: true
  });
}

type TokenPayload = jwt.JwtPayload & { id?: string; userId?: string };

function authenticateMuseRequest(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7).trim()
    : undefined;

  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication required." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    const userId = decoded.id || decoded.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Invalid authentication token." });
    }

    (req as Request & { user?: { id: string } }).user = { id: userId };
    return next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired authentication token." });
  }
}

function hasValidImageSignature(buffer: Buffer, mimeType: string): boolean {
  if (mimeType === "image/jpeg") {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mimeType === "image/png") {
    return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  }
  if (mimeType === "image/webp") {
    return buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";
  }
  return false;
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: (_req, file, callback) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      return callback(new Error("Only JPG, PNG or WebP images are accepted."));
    }
    callback(null, true);
  },
});


router.get("/my-muses", authenticateMuseRequest, async (req: Request, res: Response) => {
  try {
    const userId = (req as Request & { user?: { id: string } }).user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required." });

    const muses = await prisma.muse.findMany({
      where: { userId, status: "READY" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        age: true,
        gender: true,
        candidateNumber: true,
        masterPortraitPublicId: true,
        placeholderPublicId: true,
        processingPublicId: true,
        processingBackPublicId: true,
        status: true,
        createdAt: true
      }
    });

    const privateMuses = muses.map((muse) => ({
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
    }));

    return res.status(200).json({ success: true, data: { muses: privateMuses } });
  } catch (error) {
    console.error("Fetching private Muses failed:", error instanceof Error ? error.message : "Unknown error");
    return res.status(500).json({ success: false, message: "Could not load your saved Muses." });
  }
});

// Soft-delete a customer's Muse: hide it from active workflows while retaining certificate/audit evidence.
router.delete("/my-muses/:id", authenticateMuseRequest, async (req: Request, res: Response) => {
  try {
    const userId = (req as Request & { user?: { id: string } }).user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required." });

    const muse = await prisma.muse.findFirst({
      where: { id: req.params.id, userId, status: "READY" },
      select: { id: true }
    });
    if (!muse) return res.status(404).json({ success: false, message: "Muse not found or already deleted." });

    await prisma.$transaction([
      prisma.muse.updateMany({
        where: { id: muse.id, userId, status: "READY" },
        data: { status: "DELETED" }
      }),
      prisma.museCertificate.updateMany({
        where: { museId: muse.id, status: { not: "REVOKED" } },
        data: {
          status: "REVOKED",
          revokedAt: new Date(),
          revocationNote: "Muse archived at the account owner's request."
        }
      })
    ]);

    return res.status(200).json({
      success: true,
      message: "Muse deleted from active use. Its provenance record has been retained and marked revoked."
    });
  } catch (error) {
    console.error("Deleting private Muse failed:", error instanceof Error ? error.message : "Unknown error");
    return res.status(500).json({ success: false, message: "Could not delete this Muse. Please try again." });
  }
});

router.get("/my-muses/:id", authenticateMuseRequest, async (req: Request, res: Response) => {
  try {
    const userId = (req as Request & { user?: { id: string } }).user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required." });

    const muse = await prisma.muse.findFirst({
      where: { id: req.params.id, userId, status: "READY" },
      select: {
        id: true,
        name: true,
        age: true,
        gender: true,
        candidateNumber: true,
        masterPortraitPublicId: true,
        placeholderPublicId: true,
        processingPublicId: true,
        processingBackPublicId: true,
        status: true,
        createdAt: true
      }
    });
    if (!muse) return res.status(404).json({ success: false, message: "Muse not found." });
    const privateMuse = {
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
    };
    return res.status(200).json({ success: true, data: { muse: privateMuse } });
  } catch (error) {
    console.error("Fetching private Muse failed:", error instanceof Error ? error.message : "Unknown error");
    return res.status(500).json({ success: false, message: "Could not load this Muse." });
  }
});

router.post(
  "/upload-reference",
  authenticateMuseRequest,
  (req, res, next) => {
    upload.single("image")(req, res, (error: unknown) => {
      if (error) {
        const message = error instanceof Error ? error.message : "Image upload failed.";
        const status = message.toLowerCase().includes("file too large") ? 413 : 400;
        return res.status(status).json({ success: false, message });
      }
      next();
    });
  },
  async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ success: false, message: "Please select a portrait image." });
      }

      if (!hasValidImageSignature(file.buffer, file.mimetype)) {
        return res.status(400).json({ success: false, message: "The uploaded file is not a valid JPG, PNG or WebP image." });
      }

      const userId = (req as Request & { user?: { id: string } }).user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Authentication required." });
      }

      const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "magicreel/muse/references",
            resource_type: "image",
            type: "authenticated",
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
            tags: ["muse-reference"],
            context: { owner_id: userId },
          },
          (error, uploaded) => {
            if (error || !uploaded?.secure_url || !uploaded.public_id) {
              return reject(error || new Error("Cloudinary did not return an uploaded image."));
            }
            resolve({ secure_url: uploaded.secure_url, public_id: uploaded.public_id });
          }
        );
        stream.end(file.buffer);
      });

      return res.status(201).json({
        success: true,
        data: { imageUrl: signedMuseUrl(result.public_id), publicId: result.public_id },
      });
    } catch (error) {
      console.error("Muse reference upload failed:", error instanceof Error ? error.message : "Unknown error");
      return res.status(500).json({ success: false, message: "Reference photo upload failed. Please try again." });
    }
  }
);

// Private evidence export. Only the authenticated owner can retrieve the complete provenance and consent record.
router.get("/my-muses/:id/provenance", authenticateMuseRequest, async (req: Request, res: Response) => {
  try {
    const userId = (req as Request & { user?: { id: string } }).user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required." });
    const muse = await prisma.muse.findFirst({ where: { id: req.params.id, userId, status: "READY" }, select: { id: true } });
    if (!muse) return res.status(404).json({ success: false, message: "Muse not found." });
    const [certificate, consent] = await Promise.all([
      prisma.museCertificate.findUnique({ where: { museId: muse.id } }),
      prisma.museConsentRecord.findFirst({ where: { museId: muse.id, userId }, orderBy: { acceptedAt: "desc" } })
    ]);
    if (!certificate) return res.status(404).json({ success: false, message: "No provenance certificate exists for this Muse." });
    return res.status(200).json({
      success: true,
      data: {
        certificateId: certificate.certificateId,
        status: certificate.status,
        issuedAt: certificate.issuedAt,
        manifest: certificate.manifest,
        manifestHash: certificate.manifestHash,
        signature: certificate.signature,
        publicKeyPem: certificate.publicKeyPem,
        signingKeyId: certificate.signingKeyId,
        consent: consent ? { eventType: consent.eventType, consentVersion: consent.consentVersion, consentText: consent.consentText, acceptedAt: consent.acceptedAt, referencePublicId: consent.referencePublicId, candidatePublicId: consent.candidatePublicId, candidateNumber: consent.candidateNumber } : null,
        visualEvidence: (() => {
          const manifest = certificate.manifest as Record<string, any>;
          const assetIds = manifest.generatedAssets && typeof manifest.generatedAssets === "object" ? manifest.generatedAssets : {};
          const referenceAssetId = typeof manifest.referenceAssetId === "string" ? manifest.referenceAssetId : consent?.referencePublicId;
          const selectedCandidateAssetId = typeof manifest.selectedCandidateAssetId === "string" ? manifest.selectedCandidateAssetId : consent?.candidatePublicId;
          const finalMuseAssetId = typeof assetIds.placeholder === "string" ? assetIds.placeholder : null;
          return {
            sourceReferenceUrl: referenceAssetId ? signedMuseUrl(referenceAssetId) : null,
            selectedIdentityUrl: selectedCandidateAssetId ? signedMuseUrl(selectedCandidateAssetId) : null,
            finalMuseUrl: finalMuseAssetId ? signedMuseUrl(finalMuseAssetId) : null,
            assetIds: { sourceReference: referenceAssetId || null, selectedIdentity: selectedCandidateAssetId || null, finalMuse: finalMuseAssetId }
          };
        })(),
        legalNotice: "This evidence export records the workflow and declarations held by MagicReel. It is not statutory IPR registration or a legal opinion."
      }
    });
  } catch (error) {
    console.error("Muse provenance export failed:", error instanceof Error ? error.message : "Unknown error");
    return res.status(500).json({ success: false, message: "Muse provenance export is temporarily unavailable." });
  }
});

// Public, privacy-preserving certificate verification. No customer identity or private assets are exposed.
router.get("/verify/:certificateId", async (req: Request, res: Response) => {
  try {
    const certificate = await prisma.museCertificate.findUnique({
      where: { certificateId: req.params.certificateId },
      select: { certificateId: true, manifestHash: true, status: true, issuedAt: true, revokedAt: true, manifest: true, signature: true, publicKeyPem: true, signingKeyId: true }
    });
    if (!certificate) return res.status(404).json({ success: false, message: "Certificate not found." });
    const manifest = certificate.manifest as Record<string, unknown>;
    const recomputedHash = hashManifest(manifest);
    const hashValid = recomputedHash === certificate.manifestHash;
    const signatureValid = hashValid ? verifyManifestHash(certificate.manifestHash, certificate.signature, certificate.publicKeyPem) : false;
    const verificationResult = !hashValid ? "MANIFEST_HASH_MISMATCH" : signatureValid === true ? "SIGNATURE_VALID" : signatureValid === false ? "SIGNATURE_INVALID" : "HASH_ONLY_UNSIGNED";
    return res.status(200).json({
      success: true,
      data: {
        certificateId: certificate.certificateId,
        status: certificate.status,
        verificationResult,
        hashValid,
        signatureValid,
        issuedAt: certificate.issuedAt,
        revokedAt: certificate.revokedAt,
        manifestHash: certificate.manifestHash,
        signature: certificate.signature,
        publicKeyPem: certificate.publicKeyPem,
        signingKeyId: certificate.signingKeyId,
        museName: typeof manifest.museName === "string" ? manifest.museName : "Private Muse",
        assetFingerprintCount: manifest.assetHashes && typeof manifest.assetHashes === "object" ? Object.keys(manifest.assetHashes as object).length : 0,
        scope: "Creation provenance and asset integrity record",
        legalNotice: "This issuer-created record is not statutory IPR registration, a legal opinion, or a guarantee of copyright or exclusive rights in a facial identity."
      }
    });
  } catch (error) {
    console.error("Muse certificate verification failed:", error instanceof Error ? error.message : "Unknown error");
    return res.status(500).json({ success: false, message: "Certificate verification is temporarily unavailable." });
  }
});

export default router;
