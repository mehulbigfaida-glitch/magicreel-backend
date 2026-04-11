"use strict";
// src/video/templates/motion/rotateLeft.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.rotateLeftTemplate = void 0;
const child_process_1 = require("child_process");
const easing_1 = require("./easing");
exports.rotateLeftTemplate = {
    id: "rotateLeft",
    label: "Rotate Left",
    description: "Gentle leftward rotation (counter-clockwise).",
    async render({ imagePath, outputPath, options }) {
        const duration = options?.durationSeconds ?? 5;
        const easing = options?.easing ?? "linear";
        const motionSpeed = options?.motionSpeed ?? 1;
        const fps = 24;
        const width = 720;
        const height = 1280;
        const E = (0, easing_1.easingExpr)(easing, duration, motionSpeed);
        // Rotation angle: 0° → -5°
        const vf = `scale=${width}:${height}:force_original_aspect_ratio=increase,` +
            `rotate='(-5*PI/180)*(${E})':ow=${width}:oh=${height},` +
            `crop=${width}:${height}:x='(iw-ow)/2':y='(ih-oh)/2',` +
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
            ff.stderr.on("data", (d) => console.log("[rotateLeft]", d.toString()));
            ff.on("close", (code) => code === 0 ? resolve() : reject(new Error("rotateLeft failed")));
        });
    },
};
