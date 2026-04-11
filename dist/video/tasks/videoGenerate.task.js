"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = processVideoJob;
async function processVideoJob(job) {
    console.log("🎞 Processing video job:", job.id);
    // Simulated video generation output
    return {
        videoUrl: "https://dummy.video/" + job.id + ".mp4",
        done: true,
    };
}
