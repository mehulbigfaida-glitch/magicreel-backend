"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runwayZoomTemplate = void 0;
const child_process_1 = require("child_process");
function runFfmpeg(args) {
    return new Promise((resolve, reject) => {
        const ffmpeg = (0, child_process_1.spawn)("ffmpeg", args);
        ffmpeg.stdout.on("data", (data) => {
            console.log("[FFmpeg STDOUT]", data.toString());
        });
        ffmpeg.stderr.on("data", (data) => {
            console.log("[FFmpeg STDERR]", data.toString());
        });
        ffmpeg.on("close", (code) => {
            if (code === 0) {
                resolve();
            }
            else {
                reject(new Error(`FFmpeg exited with code ${code}`));
            }
        });
    });
}
exports.runwayZoomTemplate = {
    id: "runway_zoom",
    label: "Runway Zoom-In Cinematic",
    description: "Slow, elegant zoom-in runway style cinematic motion.",
    async render(params) {
        const { imagePath, outputPath, options } = params;
        const durationSeconds = options?.durationSeconds ?? 8;
        const fps = 25;
        const width = 854;
        const height = 480;
        const filterComplex = [
            `[0:v]scale=${width}:${height},`,
            `zoompan=z='1+0.0012*on':d=1:s=${width}x${height}:fps=${fps},`,
            `format=yuv420p[v]`,
        ].join("");
        const args = [
            "-y",
            "-loop",
            "1",
            "-i",
            imagePath,
            "-t",
            String(durationSeconds),
            "-filter_complex",
            filterComplex,
            "-map",
            "[v]",
            "-r",
            String(fps),
            "-c:v",
            "libx264",
            "-preset",
            "medium",
            "-movflags",
            "+faststart",
            outputPath,
        ];
        console.log("[RunwayZoomTemplate] ffmpeg args:", args);
        await runFfmpeg(args);
        console.log("[RunwayZoomTemplate] Completed:", outputPath);
    },
};
