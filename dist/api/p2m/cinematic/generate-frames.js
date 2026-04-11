"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCinematicFrames = generateCinematicFrames;
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = require("../../../magicreel/db/prisma");
const cinematicWorld_registry_1 = require("../../../magicreel/cinematic/cinematicWorld.registry");
const cinematicPrompt_builder_1 = require("../../../magicreel/cinematic/cinematicPrompt.builder");
const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;
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
        if (poll.data.status === "succeeded")
            return poll.data;
        if (poll.data.status === "failed")
            throw new Error("Prediction failed");
        await new Promise((r) => setTimeout(r, 1500));
    }
}
async function generateCinematicFrames(req, res) {
    try {
        const user = req.user;
        const { heroImageUrl, theme = "runway" } = req.body;
        if (!heroImageUrl) {
            return res.status(400).json({
                error: "heroImageUrl required",
            });
        }
        const seed = hashSeed(heroImageUrl + theme);
        const world = (0, cinematicWorld_registry_1.buildWorld)(theme, seed);
        const frameSequence = [
            "entrance",
            "mid_walk",
            "upper_power",
            "angle_45",
            "detail_motion",
            "final_pose",
        ];
        const frames = [];
        for (const frame of frameSequence) {
            const prompt = (0, cinematicPrompt_builder_1.buildCinematicPrompt)(world, frame);
            const prediction = await axios_1.default.post("https://api.replicate.com/v1/models/qwen/qwen-image-edit-plus/predictions", {
                input: {
                    image: [heroImageUrl],
                    prompt,
                    aspect_ratio: "9:16",
                    go_fast: true,
                    output_format: "png",
                },
            }, {
                headers: {
                    Authorization: `Bearer ${REPLICATE_TOKEN}`,
                    "Content-Type": "application/json",
                },
            });
            const result = await pollPrediction(prediction.data.urls.get);
            frames.push(result.output[0]);
        }
        const cinematicLookbook = await prisma_1.prisma.cinematicLookbook.create({
            data: {
                userId: user.id,
                heroImageUrl,
                theme,
                seed,
                worldConfig: world,
                frames: frames,
            },
        });
        return res.json({
            success: true,
            lookbookId: cinematicLookbook.id,
            frames,
            world,
        });
    }
    catch (error) {
        console.error("CINEMATIC FRAME ERROR:", error);
        return res.status(500).json({
            error: "Failed to generate cinematic lookbook",
        });
    }
}
