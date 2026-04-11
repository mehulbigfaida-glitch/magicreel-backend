"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceLookbookElement = replaceLookbookElement;
const prisma_1 = require("../db/prisma");
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("../../config/cloudinary");
async function replaceLookbookElement(payload) {
    const lookbook = await prisma_1.prisma.lookbook.findUnique({
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
    const tmpDir = path_1.default.join(process.cwd(), "tmp");
    fs_1.default.mkdirSync(tmpDir, { recursive: true });
    const outputPath = path_1.default.join(tmpDir, `replace-${Date.now()}.png`);
    // 🔁 PRODUCT → IMAGE (simple overlay placeholder)
    const baseImage = await axios_1.default.get(baseImageUrl, {
        responseType: "arraybuffer",
    });
    fs_1.default.writeFileSync(outputPath, Buffer.from(baseImage.data));
    const upload = await (0, cloudinary_1.uploadToCloudinary)(outputPath, {
        folder: `magicreel/lookbook/edits/${lookbook.id}`,
    });
    const edit = await prisma_1.prisma.lookbookEdit.create({
        data: {
            lookbookId: lookbook.id,
            elementType: payload.elementType,
            sourceImage: baseImageUrl,
            resultImage: upload.secure_url,
        },
    });
    return edit;
}
