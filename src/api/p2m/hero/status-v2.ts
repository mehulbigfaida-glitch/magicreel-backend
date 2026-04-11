import { Request, Response } from "express";
import axios from "axios";
import fs from "fs";
import path from "path";
import { prisma } from "../../../magicreel/db/prisma";
import { uploadToCloudinary } from "../../../config/cloudinary";

const FASHN_STATUS_URL = "https://api.fashn.ai/v1/status";
const FASHN_API_KEY = process.env.FASHN_API_KEY as string;

export async function getHeroStatusV2(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { runId } = req.params;

    if (!runId) {
      res.status(400).json({ error: "Missing runId" });
      return;
    }

    // -------------------------------------------------
    // 1️⃣ Check DB first (avoid unnecessary FASHN calls)
    // -------------------------------------------------

    const existingJob = await prisma.productToModelJob.findFirst({
      where: { engineJobId: runId },
    });

    if (existingJob?.resultImageUrl) {
      res.json({
        status: "completed",
        heroBaseUrl: existingJob.resultImageUrl,
        heroPreviewUrl: existingJob.resultImageUrl,
      });
      return;
    }

    // -------------------------------------------------
    // 2️⃣ Ask FASHN for job status
    // -------------------------------------------------

    const response = await axios.get(
      `${FASHN_STATUS_URL}/${runId}`,
      {
        headers: {
          Authorization: `Bearer ${FASHN_API_KEY}`,
        },
      }
    );

    const data = response.data;

    if (data.status !== "completed") {
      res.json(data);
      return;
    }

    const fashnImageUrl = data.output?.[0];

    if (!fashnImageUrl) {
      res.status(500).json({
        error: "Hero output missing from FASHN",
      });
      return;
    }

    // -------------------------------------------------
    // 3️⃣ Download FASHN image locally
    // -------------------------------------------------

    const tmpDir = path.join(process.cwd(), "tmp");

    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }

    const localPath = path.join(tmpDir, `${runId}.png`);

    const imageResponse = await axios({
      url: fashnImageUrl,
      method: "GET",
      responseType: "stream",
    });

    const writer = fs.createWriteStream(localPath);

    imageResponse.data.pipe(writer);

    await new Promise<void>((resolve, reject) => {
      writer.on("finish", () => resolve());
      writer.on("error", (err) => reject(err));
    });

    // -------------------------------------------------
    // 4️⃣ Upload to Cloudinary (white-label storage)
    // -------------------------------------------------

    const uploadResult = await uploadToCloudinary(localPath, {
      folder: "magicreel/heroes",
      public_id: runId,
    });

    const cloudinaryUrl = uploadResult.secure_url;

    // -------------------------------------------------
    // 5️⃣ Update database
    // -------------------------------------------------

    await prisma.productToModelJob.updateMany({
      where: {
        engineJobId: runId,
      },
      data: {
        status: "completed",
        resultImageUrl: cloudinaryUrl,
      },
    });

    // -------------------------------------------------
    // 6️⃣ Return result
    // -------------------------------------------------

    res.json({
      status: "completed",
      heroBaseUrl: cloudinaryUrl,
      heroPreviewUrl: cloudinaryUrl,
    });

  } catch (err: any) {
    console.error(
      "HERO STATUS ERROR:",
      err?.response?.data || err
    );

    res.status(500).json({
      error: err?.message || "Hero status failed",
    });
  }
}