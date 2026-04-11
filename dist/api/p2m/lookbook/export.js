"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportLookbook = exportLookbook;
const jszip_1 = __importDefault(require("jszip"));
const axios_1 = __importDefault(require("axios"));
async function exportLookbook(req, res) {
    try {
        const { images } = req.body;
        if (!images || !Array.isArray(images) || !images.length) {
            return res.status(400).json({
                error: "No images provided",
            });
        }
        const zip = new jszip_1.default();
        let index = 1;
        for (const img of images) {
            try {
                // ✅ HANDLE BASE64
                if (img.startsWith("data:")) {
                    const base64Data = img.split(",")[1];
                    const buffer = Buffer.from(base64Data, "base64");
                    zip.file(`look_${index}.jpg`, buffer);
                    index++;
                    continue;
                }
                // ✅ HANDLE URL
                const response = await axios_1.default.get(img, {
                    responseType: "arraybuffer",
                });
                zip.file(`look_${index}.jpg`, response.data);
                index++;
            }
            catch (err) {
                console.warn("Skipping image:", img);
            }
        }
        const content = await zip.generateAsync({ type: "nodebuffer" });
        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", "attachment; filename=magicreel-lookbook.zip");
        return res.send(content);
    }
    catch (err) {
        console.error("Export error:", err);
        return res.status(500).json({
            error: "Export failed",
        });
    }
}
