// src/video/queues/videoQueue.ts
// Redis-free stub queue implementation

import { Queue } from "bullmq";

// Dummy queue — does NOT connect to Redis
export const videoQueue = {
  add: async (name: string, data: any) => {
    console.log("🎬 [VIDEO QUEUE STUB] add() called:", { name, data });
    return { id: "stub-job-id" };
  },
};

export default videoQueue;
