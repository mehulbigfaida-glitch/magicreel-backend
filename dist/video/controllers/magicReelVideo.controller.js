"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMagicReelVideo = void 0;
const path_1 = __importDefault(require("path"));
const magicReelConcat_service_1 = require("../services/magicReelConcat.service");
const generateMagicReelVideo = async (req, res) => {
    try {
        const { clips } = req.body;
        if (!clips || !Array.isArray(clips) || clips.length < 2) {
            return res.status(400).json({
                success: false,
                error: "clips must be an array of at least 2 video paths"
            });
        }
        // You can later make this configurable
        const outputDir = path_1.default.join(process.cwd(), "src", "video", "outputs", Date.now().toString());
        const outputVideoPath = await magicReelConcat_service_1.magicReelConcatService.generateMagicReel({
            clips,
            outputDir
        });
        return res.status(200).json({
            success: true,
            outputVideoPath
        });
    }
    catch (error) {
        console.error("MagicReel video generation failed:", error.message || error);
        return res.status(500).json({
            success: false,
            error: "MagicReel video generation failed"
        });
    }
};
exports.generateMagicReelVideo = generateMagicReelVideo;
