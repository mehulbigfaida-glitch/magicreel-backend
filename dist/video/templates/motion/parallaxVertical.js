"use strict";
// src/video/templates/motion/parallaxVertical.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.parallaxVerticalTemplate = void 0;
const child_process_1 = require("child_process");
const easing_1 = require("./easing");
exports.parallaxVerticalTemplate = {
    id: "parallaxVertical",
    label: "Parallax Vertical",
    description: "Smooth vertical parallax drift top → bottom.",
    async render({ imagePath, outputPath, options }) {
        const duration = options?.durationSeconds ?? 5;
        const easing = options?.easing ?? "linear";
        const motionSpeed = options?.motionSpeed ?? 1;
        const fps = 24;
        const width = 720;
        const height = 1280;
        const E = (0, easing_1.easingExpr)(easing, duration, motionSpeed);
        const maxShift = 0.03; // 3%
        const vf = `scale=${width}:${height}:force_original_aspect_ratio=increase,` +
            `crop=${width}:${height}:` +
            `x='(iw-ow)/2':` +
            `y='(ih-oh)/2 + (${maxShift}*ih)*(${E})',` +
            `format=yuv420p`;
        const args = [
            "-y",
            "-loop",
            "1",
            "-i",
            imagePath,
            "-t",
            `${duration}`,
            "-vf",
            vf,
            "-r",
            `${fps}`,
            outputPath,
        ];
        await new Promise((resolve, reject) => {
            const ff = (0, child_process_1.spawn)("ffmpeg", args);
            ff.stderr.on("data", (d) => console.log("[parallaxVertical]", d.toString()));
            ff.on("close", (code) => code === 0 ? resolve() : reject(new Error("parallaxVertical failed")));
        });
    },
};
