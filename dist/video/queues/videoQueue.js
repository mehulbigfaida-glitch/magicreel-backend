"use strict";
// src/video/queues/videoQueue.ts
// Redis-free stub queue implementation
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoQueue = void 0;
// Dummy queue — does NOT connect to Redis
exports.videoQueue = {
    add: async (name, data) => {
        console.log("🎬 [VIDEO QUEUE STUB] add() called:", { name, data });
        return { id: "stub-job-id" };
    },
};
exports.default = exports.videoQueue;
