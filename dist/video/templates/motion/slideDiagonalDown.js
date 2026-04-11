"use strict";
// src/video/templates/motion/slideDiagonalDown.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.slideDiagonalDownTemplate = void 0;
const child_process_1 = require("child_process");
const easing_1 = require("./easing");
exports.slideDiagonalDownTemplate = {
    id: "slideDiagonalDown",
    label: "Slide Diagonal Down",
    description: "Smooth diagonal slide: top-left → bottom-right.",
    async render({ imagePath, outputPath, options }) {
        const duration = options?.durationSeconds ?? 5;
        const easing = options?.easing ?? "linear";
        const motionSpeed = options?.motionSpeed ?? 1;
        const fps = 24;
        const width = 720;
        const height = 1280;
        const E = (0, easing_1.easingExpr)(easing, duration, motionSpeed);
        const vf = `scale=${width}:${height}:force_original_aspect_ratio=increase,` +
            `crop=${width}:${height}:` +
            `x='(iw-ow)*(${E})':` +
            `y='(ih-oh)*(${E})',` +
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
            ff.stderr.on("data", (d) => console.log("[slideDiagonalDown]", d.toString()));
            ff.on("close", (code) => code === 0 ? resolve() : reject(new Error("slideDiagonalDown failed")));
        });
    },
};
