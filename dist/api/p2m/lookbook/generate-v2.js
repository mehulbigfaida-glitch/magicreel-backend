"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLookbookV2 = generateLookbookV2;
const axios_1 = __importDefault(require("axios"));
const billing_middleware_1 = require("../../../billing/billing.middleware"); // ✅ FIX
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
if (!REPLICATE_API_TOKEN) {
    console.warn("⚠️ REPLICATE_API_TOKEN missing - generation disabled");
}
const QWEN_URL = "https://api.replicate.com/v1/models/qwen/qwen-image-edit-plus/predictions";
/* -----------------------------------
   LOCKED PROMPT (Face Realism V1)
----------------------------------- */
const LOCKED_PROMPT = "The person in image 2 adopts the full body pose from image 1, maintaining full body visibility from head to toe, preserving exact facial identity with natural skin texture and sharp facial details, face in natural sharp focus";
/* -----------------------------------
   FINAL POSES
----------------------------------- */
const POSES = [
    { id: "P1", type: "front", url: "https://res.cloudinary.com/duaqfspwa/image/upload/v1773921649/P1_bte2lx.png" },
    { id: "P2", type: "walking", url: "https://res.cloudinary.com/duaqfspwa/image/upload/v1773921649/P2_exbtqy.png" },
    { id: "P3", type: "angle", url: "https://res.cloudinary.com/duaqfspwa/image/upload/v1773921649/P3_hkimui.png" },
    { id: "P4", type: "dynamic", url: "https://res.cloudinary.com/duaqfspwa/image/upload/v1773921648/p4_gilyuf.png" },
];
function getCroppedImage(url) {
    return url.replace("/upload/", "/upload/c_fill,g_face,h_900,w_700/");
}
async function generateLookbookV2(req, res) {
    try {
        const { heroImageUrl, backHeroImageUrl } = req.body;
        if (!heroImageUrl) {
            return res.status(400).json({ error: "heroImageUrl required" });
        }
        if (!REPLICATE_API_TOKEN) {
            return res.json({
                success: true,
                poses: [
                    {
                        poseId: "HERO",
                        poseType: "hero",
                        imageUrl: heroImageUrl,
                    },
                ],
            });
        }
        const poses = [];
        poses.push({
            poseId: "HERO",
            poseType: "hero",
            imageUrl: heroImageUrl,
        });
        if (backHeroImageUrl) {
            poses.push({
                poseId: "BACK",
                poseType: "back",
                imageUrl: backHeroImageUrl,
            });
        }
        for (const pose of POSES) {
            try {
                const response = await axios_1.default.post(QWEN_URL, {
                    input: {
                        image: [pose.url, heroImageUrl],
                        prompt: LOCKED_PROMPT,
                        aspect_ratio: "9:16",
                        output_format: "png",
                        output_quality: 95,
                        seed: 42,
                    },
                }, {
                    headers: {
                        Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                });
                const predictionUrl = response.data.urls.get;
                let finalUrl = heroImageUrl;
                const start = Date.now();
                while (true) {
                    if (Date.now() - start > 90000)
                        break;
                    const poll = await axios_1.default.get(predictionUrl, {
                        headers: {
                            Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
                        },
                    });
                    const status = poll.data.status;
                    if (status === "succeeded") {
                        finalUrl = poll.data.output[0];
                        break;
                    }
                    if (status === "failed")
                        break;
                    await new Promise((r) => setTimeout(r, 1500));
                }
                poses.push({
                    poseId: pose.id,
                    poseType: pose.type,
                    imageUrl: finalUrl,
                });
            }
            catch {
                poses.push({
                    poseId: pose.id,
                    poseType: pose.type,
                    imageUrl: heroImageUrl,
                });
            }
        }
        const frontPose = poses.find(p => p.poseId === "P1");
        if (frontPose?.imageUrl) {
            poses.push({
                poseId: "P5",
                poseType: "cropped",
                imageUrl: getCroppedImage(frontPose.imageUrl),
            });
        }
        /* =========================
           ✅ BILLING (UNIFIED)
        ========================= */
        try {
            await (0, billing_middleware_1.finalizeBilling)(req); // ✅ ONLY THIS
        }
        catch (e) {
            console.error("Lookbook billing failed:", e);
        }
        return res.json({
            success: true,
            poses,
        });
    }
    catch (error) {
        console.error("Lookbook V2 Error:", error);
        return res.status(500).json({
            error: "Lookbook failed",
        });
    }
}
