"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnchorVolumeTransferService = void 0;
const sharp_1 = __importDefault(require("sharp"));
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class AnchorVolumeTransferService {
    constructor() {
        this.outputDir = path_1.default.join(process.cwd(), "storage", "tryon", "volume-transfer");
        if (!fs_1.default.existsSync(this.outputDir)) {
            fs_1.default.mkdirSync(this.outputDir, { recursive: true });
        }
    }
    async transferVolume(input) {
        console.log("🧠 AnchorVolumeTransferService — START");
        const jobId = (0, uuid_1.v4)();
        const anchorPath = path_1.default.join(this.outputDir, `${jobId}_anchor.png`);
        const fashnPath = path_1.default.join(this.outputDir, `${jobId}_fashn.png`);
        const finalPath = path_1.default.join(this.outputDir, `${jobId}_final.png`);
        /* -------------------------------------------
           1️⃣ Download anchor & FASHN output
        ------------------------------------------- */
        await this.download(input.anchorModelUrl, anchorPath);
        await this.download(input.fashnOutputUrl, fashnPath);
        /* -------------------------------------------
           2️⃣ Extract anchor silhouette (alpha mask)
           → This locks leg spread, hips, hem width
        ------------------------------------------- */
        const anchorMask = await (0, sharp_1.default)(anchorPath)
            .resize(1024, 1600)
            .removeAlpha()
            .threshold(245) // aggressive silhouette lock
            .toBuffer();
        /* -------------------------------------------
           3️⃣ Prepare FASHN image (texture source)
        ------------------------------------------- */
        const fashnImage = await (0, sharp_1.default)(fashnPath)
            .resize(1024, 1600)
            .toBuffer();
        /* -------------------------------------------
           4️⃣ Volume-preserving composite
           - Anchor defines SHAPE
           - FASHN defines TEXTURE
        ------------------------------------------- */
        await (0, sharp_1.default)(anchorPath)
            .resize(1024, 1600)
            .composite([
            {
                input: fashnImage,
                blend: "over",
            },
            {
                input: anchorMask,
                blend: "dest-in", // 🔥 critical: silhouette lock
            },
        ])
            .png({ quality: 100 })
            .toFile(finalPath);
        /* -------------------------------------------
           5️⃣ Upload / expose final image
           (local URL for now – Cloudinary-ready)
        ------------------------------------------- */
        const finalUrl = `/storage/tryon/volume-transfer/${jobId}_final.png`;
        console.log("✅ Volume transfer complete:", finalUrl);
        return {
            finalUrl,
        };
    }
    /* -------------------------------------------
       Utility: download image
    ------------------------------------------- */
    async download(url, outPath) {
        const response = await axios_1.default.get(url, {
            responseType: "arraybuffer",
        });
        fs_1.default.writeFileSync(outPath, response.data);
    }
}
exports.AnchorVolumeTransferService = AnchorVolumeTransferService;
