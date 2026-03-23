// src/video/services/videoStatusService.ts

export async function getVideoJob(jobId: string) {
  return {
    id: jobId,
    status: "completed",
    progress: 100,
    videoUrl: `https://dummy.video/${jobId}.mp4`,
  };
}
