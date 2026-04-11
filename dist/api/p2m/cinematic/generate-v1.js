"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCinematicV1 = generateCinematicV1;
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;
if (!REPLICATE_TOKEN) {
    console.warn("⚠️ REPLICATE_API_TOKEN missing - cinematic disabled");
}
function hashSeed(input) {
    const hash = crypto_1.default.createHash("md5").update(input).digest("hex");
    return parseInt(hash.substring(0, 8), 16);
}
async function pollPrediction(getUrl) {
    while (true) {
        const poll = await axios_1.default.get(getUrl, {
            headers: {
                Authorization: `Bearer ${REPLICATE_TOKEN}`,
            },
        });
        const status = poll.data.status;
        if (status === "succeeded")
            return poll.data;
        if (status === "failed")
            throw new Error("Prediction failed");
        await new Promise((r) => setTimeout(r, 1500));
    }
}
/* =======================================================
   MAIN CONTROLLER
======================================================= */
async function generateCinematicV1(req, res) {
    try {
        const { heroImageUrl, theme = "dark_runway", type = "lookbook", // "lookbook" | "reel"
         } = req.body;
        if (!heroImageUrl) {
            return res.status(400).json({ error: "heroImageUrl required" });
        }
        const seed = hashSeed(heroImageUrl + theme + type);
        /* =======================================================
           STEP 1 — Generate CINEMATIC HERO (from HERO)
        ======================================================= */
        const themePrompts = {
            dark_runway: "Place the model walking on a dark luxury fashion runway with dramatic spotlight from above. Audience softly blurred. Maintain exact face and garment consistency. High fashion editorial photography.",
            golden_hour: "Place the model walking during golden sunset hour runway show. Warm cinematic lighting, soft shadows, glowing ambience. Maintain exact face and garment consistency.",
            urban_night: "Place the model walking confidently in a high-end urban night fashion show with neon reflections and city light backdrop. Maintain exact face and garment consistency.",
        };
        const prompt = themePrompts[theme] || themePrompts["dark_runway"];
        const imagePrediction = await axios_1.default.post("https://api.replicate.com/v1/models/google/gemini-2.5-flash-image-preview/predictions", {
            input: {
                image: heroImageUrl,
                prompt,
                aspect_ratio: "1:1",
                seed,
            },
        }, {
            headers: {
                Authorization: `Bearer ${REPLICATE_TOKEN}`,
                "Content-Type": "application/json",
            },
        });
        const imageResult = await pollPrediction(imagePrediction.data.urls.get);
        const cinematicHeroUrl = imageResult.output[0];
        /* =======================================================
           IF LOOKBOOK → RETURN HERE (3 CREDITS)
        ======================================================= */
        if (type === "lookbook") {
            return res.json({
                success: true,
                type: "lookbook",
                cinematicHeroUrl,
            });
        }
        /* =======================================================
           STEP 2 — GENERATE CINEMATIC REEL (5 CREDITS)
        ======================================================= */
        const videoPrediction = await axios_1.default.post("https://api.replicate.com/v1/models/kwaivgi/kling-v2.1/predictions", {
            input: {
                prompt: "High fashion cinematic runway film. Smooth professional camera tracking shot. Luxury atmosphere.",
                start_image: cinematicHeroUrl,
                duration: 5,
            },
        }, {
            headers: {
                Authorization: `Bearer ${REPLICATE_TOKEN}`,
                "Content-Type": "application/json",
            },
        });
        const videoResult = await pollPrediction(videoPrediction.data.urls.get);
        const videoUrl = videoResult.output[0];
        return res.json({
            success: true,
            type: "reel",
            cinematicHeroUrl,
            videoUrl,
        });
    }
    catch (error) {
        console.error("CINEMATIC ERROR:", error);
        return res.status(500).json({
            error: "Failed to generate cinematic output",
        });
    }
}
