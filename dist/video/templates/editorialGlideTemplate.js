"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editorialGlideTemplate = void 0;
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
exports.editorialGlideTemplate = {
    id: "editorial_glide",
    label: "Editorial Parallax Glide",
    description: "Smooth lateral glide for an editorial-style fashion shot.",
    async render(params) {
        const { imagePath, outputPath, options } = params;
        const durationSeconds = options?.durationSeconds ?? 8;
        const fps = 25;
        const width = 854;
        const height = 480;
        const filterComplex = [
            `[0:v]scale=${width}:${height},`,
            `zoompan=z='1.03':x='iw*0.002*on':y='ih*0.001*on':d=1:s=${width}x${height}:fps=${fps},`,
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
        console.log("[EditorialGlideTemplate] ffmpeg args:", args);
        await runFfmpeg(args);
        console.log("[EditorialGlideTemplate] Completed:", outputPath);
    },
};
