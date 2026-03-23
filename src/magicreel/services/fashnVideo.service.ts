import axios from "axios";
import fs from "fs";
import path from "path";
import { uploadBufferToCloudinary } from "../../utils/cloudinaryUpload";

const FASHN_RUN_URL = "https://api.fashn.ai/v1/run";
const FASHN_STATUS_URL = "https://api.fashn.ai/v1/status";

const FASHN_API_KEY = process.env.FASHN_API_KEY!;

export async function generateFashnVideo(
  localImagePathOrUrl: string,
  options?: {
    duration?: 5 | 10;
    resolution?: "480p" | "720p" | "1080p";
  }
): Promise<string> {
  /* -------------------------------------------------
     1️⃣ ENSURE PUBLIC IMAGE URL (CLOUDINARY)
  -------------------------------------------------- */

  let publicImageUrl = localImagePathOrUrl;

  if (
    localImagePathOrUrl.startsWith("http://localhost") ||
    localImagePathOrUrl.startsWith("/")
  ) {
    const absolutePath = localImagePathOrUrl.startsWith("http")
      ? path.join(
          process.cwd(),
          localImagePathOrUrl.replace(
            "http://localhost:5001",
            ""
          )
        )
      : path.join(process.cwd(), localImagePathOrUrl);

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Image not found: ${absolutePath}`);
    }

    const imageBuffer = fs.readFileSync(absolutePath);

    // ✅ This function returns a STRING (public URL)
    const uploadedImageUrl = await uploadBufferToCloudinary(
      imageBuffer,
      "magicreel/reels/source"
    );

    publicImageUrl = uploadedImageUrl;
  }

  /* -------------------------------------------------
     2️⃣ SUBMIT FASHN IMAGE → VIDEO JOB
  -------------------------------------------------- */

  let predictionId: string;

  try {
    const runRes = await axios.post(
      FASHN_RUN_URL,
      {
        model_name: "image-to-video",
        inputs: {
          image: publicImageUrl,
          duration: options?.duration ?? 5,
          resolution: options?.resolution ?? "480p",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${FASHN_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    predictionId = runRes.data?.id;

    if (!predictionId) {
      console.error("❌ FASHN RUN RESPONSE:", runRes.data);
      throw new Error("No prediction ID returned by Fashn");
    }
  } catch (err: any) {
    console.error(
      "❌ FASHN RUN ERROR:",
      err?.response?.data || err
    );
    throw new Error("Fashn run request failed");
  }

  /* -------------------------------------------------
     3️⃣ POLL STATUS
  -------------------------------------------------- */

  while (true) {
    await new Promise((r) => setTimeout(r, 3000));

    try {
      const statusRes = await axios.get(
        `${FASHN_STATUS_URL}/${predictionId}`,
        {
          headers: {
            Authorization: `Bearer ${FASHN_API_KEY}`,
          },
        }
      );

      const { status, output, error } = statusRes.data;

      if (status === "completed") {
        if (!output || !output[0]) {
          throw new Error(
            "Fashn completed but returned no video"
          );
        }

        return output[0]; // MP4 URL
      }

      if (status === "failed") {
        console.error("❌ FASHN FAILED:", error);
        throw new Error(
          typeof error === "string"
            ? error
            : JSON.stringify(error)
        );
      }
    } catch (err: any) {
      console.error(
        "❌ FASHN STATUS ERROR:",
        err?.response?.data || err
      );
      throw new Error("Fashn status polling failed");
    }
  }
}
