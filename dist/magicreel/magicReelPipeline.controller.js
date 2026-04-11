"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMagicReelController = generateMagicReelController;
exports.magicReelStatusController = magicReelStatusController;
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const magicReelPipeline_service_1 = require("./magicReelPipeline.service");
const jobs = new Map();
async function generateMagicReelController(req, res) {
    const { heroImagePath } = req.body;
    if (!heroImagePath) {
        return res.status(400).json({ error: "heroImagePath required" });
    }
    const jobId = (0, uuid_1.v4)();
    jobs.set(jobId, { status: "queued" });
    res.json({ status: "accepted", jobId });
    const outputDir = path_1.default.join(process.cwd(), "src", "magicreel", "outputs", Date.now().toString());
    (async () => {
        try {
            jobs.set(jobId, { status: "running" });
            const result = await (0, magicReelPipeline_service_1.runMagicReelJob)(heroImagePath, outputDir);
            jobs.set(jobId, {
                status: "completed",
                result,
            });
            console.log("======================================");
            console.log("✅ MAGICREEL COMPLETED SUCCESSFULLY");
            console.log("🎬 Video path:", result.videoPath);
            console.log("🌍 Video URL:", result.videoUrl);
            console.log("======================================");
        }
        catch (err) {
            jobs.set(jobId, {
                status: "failed",
                error: err.message,
            });
            console.error("❌ MAGICREEL FAILED:", err.message);
        }
    })();
}
function magicReelStatusController(req, res) {
    const job = jobs.get(req.params.jobId);
    if (!job) {
        return res.status(404).json({ error: "Job not found" });
    }
    res.json(job);
}
