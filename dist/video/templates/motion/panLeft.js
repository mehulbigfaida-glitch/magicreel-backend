"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.panLeftTemplate = void 0;
const child_process_1 = require("child_process");
exports.panLeftTemplate = {
    id: "panLeft",
    label: "Pan Left",
    description: "Smooth horizontal pan from right to left.",
    async render({ imagePath, outputPath, options }) {
        const duration = options?.durationSeconds ?? 5;
        const fps = 24;
        const totalFrames = duration * fps;
        const vf = "scale=720:1280:force_original_aspect_ratio=increase," +
            `zoompan=z='1':x='iw*(1-on/${totalFrames})':y='(ih-oh)/2':d=1:fps=${fps},` +
            "crop=720:1280,format=yuv420p";
        await new Promise((resolve, reject) => {
            const ff = (0, child_process_1.spawn)("ffmpeg", [
                "-y",
                "-loop", "1",
                "-i", imagePath,
                "-t", `${duration}`,
                "-vf", vf,
                "-c:v", "libx264",
                "-preset", "fast",
                "-r", `${fps}`,
                outputPath,
            ]);
            ff.stderr.on("data", d => console.log("[panLeft]", d.toString()));
            ff.on("close", code => (code === 0 ? resolve() : reject(new Error("panLeft failed"))));
        });
    },
};
