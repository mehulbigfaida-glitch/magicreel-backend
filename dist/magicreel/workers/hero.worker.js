"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const bullmq_1 = require("bullmq");
const fashn_service_1 = require("../services/fashn.service");
console.log("🟢 Hero Worker running and waiting for jobs...");
const fashn = new fashn_service_1.FashnService();
const worker = new bullmq_1.Worker("heroQueue", async (job) => {
    const { prompt, modelImageUrl, garmentImageUrl, jobData } = job.data;
    console.log("Processing hero job:", job.id);
    await fashn.runProductToModel({
        ...jobData,
        prompt,
        modelImageUrl,
        garmentImageUrl
    });
}, {
    connection: {
        host: "127.0.0.1",
        port: 6379
    }
});
worker.on("completed", job => {
    console.log("Hero job completed:", job.id);
});
worker.on("failed", (job, err) => {
    console.error("Hero job failed:", job?.id, err);
});
