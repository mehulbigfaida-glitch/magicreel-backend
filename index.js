const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const uploadsDir = path.join(__dirname, "uploads");
const videosDir = path.join(__dirname, "videos");

// Ensure videos folder exists
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir);
}

console.log("🎥 Watching uploads folder for new images...");

fs.watch(uploadsDir, (eventType, filename) => {
  if (eventType === "rename" && filename) {
    const filePath = path.join(uploadsDir, filename);

    // Wait a moment to ensure file is fully written
    setTimeout(() => {
      if (fs.existsSync(filePath)) {
        console.log(`🎞️  Generating video for: ${filename}`);

        const outputVideo = path.join(videosDir, `${path.parse(filename).name}.mp4`);

        // FFmpeg command — cinematic zoom + background music style motion
        const ffmpegCommand = `ffmpeg -y -loop 1 -i "${filePath}" -vf "zoompan=z='min(zoom+0.0015,1.5)':d=250,scale=1280:720" -t 10 -r 30 -pix_fmt yuv420p "${outputVideo}"`;

        exec(ffmpegCommand, (error, stdout, stderr) => {
          if (error) {
            console.error("❌ Error generating video:", error.message);
            return;
          }
          console.log(`✅ Video saved at: ${outputVideo}`);
        });
      }
    }, 1000);
  }
});
