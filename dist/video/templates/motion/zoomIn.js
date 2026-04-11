"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zoomInTemplate = void 0;
const child_process_1 = require("child_process");
const ffmpegPath_1 = require("../../../utils/ffmpegPath");
exports.zoomInTemplate = {
    id: "zoomIn",
    label: "Zoom In",
    description: "Stable linear zoom-in effect without zoompan.",
    async render({ imagePath, outputPath, options }) {
        const duration = options?.durationSeconds ?? 5;
        const fps = options?.fps ?? 24;
        console.log("🔧 Using FFmpeg:", ffmpegPath_1.ffmpegPath);
        //
        // We do NOT use zoompan anymore.
        // We use clean scale + crop + minterpolate for smooth zooming.
        //
        const vf = `
      scale=720:1280:force_original_aspect_ratio=increase,
      crop=720:1280,
      zoompan=z='min(1.0+0.02*on,1.3)':d=1:x='(iw-ow)/2':y='(ih-oh)/2':fps=${fps},
      format=yuv420p
      `.replace(/\s+/g, ' ');
        const args = [
            "-y",
            "-loop", "1",
            "-i", imagePath,
            "-t", `${duration}`,
            "-vf", vf,
            "-c:v", "libx264",
            "-preset", "fast",
            "-r", `${fps}`,
            outputPath
        ];
        console.log("🎬 CMD:", args);
        await new Promise((resolve, reject) => {
            const ff = (0, child_process_1.spawn)(ffmpegPath_1.ffmpegPath, args);
            ff.stderr.on("data", d => console.log("[zoomIn]", d.toString()));
            ff.on("close", code => {
                if (code === 0)
                    resolve();
                else
                    reject(new Error("zoomIn failed"));
            });
        });
    },
};
