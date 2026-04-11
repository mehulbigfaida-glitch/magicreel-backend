"use strict";
// backend/src/magicreel/p2m/p2m.service.ts
// ✅ FINAL — Product-to-Model (P2M) Service
// Purpose: Build prompt → optionally stop → send to FASHN API
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.P2MService = void 0;
const axios_1 = __importDefault(require("axios"));
const client_1 = require("@prisma/client");
const promptBuilder_1 = require("../prompts/promptBuilder");
const prisma = new client_1.PrismaClient();
const FASHN_RUN_URL = "https://api.fashn.ai/v1/run";
const FASHN_API_KEY = process.env.FASHN_API_KEY;
if (!FASHN_API_KEY) {
    throw new Error("FASHN_API_KEY is not set");
}
class P2MService {
    async run(input) {
        // 1️⃣ Build the EXACT prompt (single source of truth)
        const prompt = (0, promptBuilder_1.buildP2MPrompt)({
            category: input.category,
            avatarGender: input.avatarGender,
            attributes: input.attributes,
        });
        // 2️⃣ PROMPT-ONLY MODE (NO FASHN CALL)
        if (process.env.PROMPT_ONLY === "true") {
            console.log("[PROMPT ONLY]", {
                avatarGender: input.avatarGender,
                category: input.category,
                prompt,
            });
            return {
                mode: "PROMPT_ONLY",
                avatarGender: input.avatarGender,
                category: input.category,
                prompt,
            };
        }
        // 3️⃣ SEND TO FASHN API
        console.log("[SENDING TO FASHN]", prompt);
        const response = await axios_1.default.post(FASHN_RUN_URL, {
            model_name: "product-to-model",
            inputs: {
                model_image: input.modelImageUrl,
                product_image: input.productImageUrl,
                prompt,
            },
        }, {
            headers: {
                Authorization: `Bearer ${FASHN_API_KEY}`,
                "Content-Type": "application/json",
            },
        });
        const engineJobId = response.data.id;
        // 4️⃣ Persist job (optional but correct)
        await prisma.productToModelJob.create({
            data: {
                engine: "fashn",
                engineJobId,
                productImageUrl: input.productImageUrl,
                modelImageUrl: input.modelImageUrl,
                status: "fashn_running",
            },
        });
        return {
            jobId: engineJobId,
        };
    }
}
exports.P2MService = P2MService;
