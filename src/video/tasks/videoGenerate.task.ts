export default async function processVideoJob(job: any) {
  console.log("🎞 Processing video job:", job.id);

  // Simulated video generation output
  return {
    videoUrl: "https://dummy.video/" + job.id + ".mp4",
    done: true,
  };
}
