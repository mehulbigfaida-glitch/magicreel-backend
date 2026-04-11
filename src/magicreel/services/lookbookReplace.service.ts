import { prisma } from "../db/prisma";
import axios from "axios";
import fs from "fs";
import path from "path";
import { uploadToCloudinary } from "../../config/cloudinary";

interface ReplaceElementPayload {
  lookbookId: string;
  elementType: "bottom" | "accessory" | "jewelry";
  elementImageUrl: string;
}

export async function replaceLookbookElement(
  payload: ReplaceElementPayload
) {
  const lookbook = await prisma.lookbook.findUnique({
    where: { id: payload.lookbookId },
  });

  if (!lookbook) {
    throw new Error("Lookbook not found");
  }

  if (lookbook.status === "sealed") {
    throw new Error("Lookbook is sealed");
  }

  // TEMP: base image resolution
  const baseImageUrl = `http://localhost:5001/tryon/latest/${lookbook.garmentId}`;

  const tmpDir = path.join(process.cwd(), "tmp");
  fs.mkdirSync(tmpDir, { recursive: true });

  const outputPath = path.join(
    tmpDir,
    `replace-${Date.now()}.png`
  );

  // 🔁 PRODUCT → IMAGE (simple overlay placeholder)
  const baseImage = await axios.get(baseImageUrl, {
    responseType: "arraybuffer",
  });

  fs.writeFileSync(outputPath, Buffer.from(baseImage.data));

  const upload = await uploadToCloudinary(outputPath, {
    folder: `magicreel/lookbook/edits/${lookbook.id}`,
  });

  const edit = await prisma.lookbookEdit.create({
    data: {
      lookbookId: lookbook.id,
      elementType: payload.elementType,
      sourceImage: baseImageUrl,
      resultImage: upload.secure_url,
    },
  });

  return edit;
}
