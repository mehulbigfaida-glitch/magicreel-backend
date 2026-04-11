"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TryOnServiceV2 = void 0;
const uuid_1 = require("uuid");
const redisConnection_1 = require("../../config/redisConnection");
const ResolutionNormalizerService_1 = require("./ResolutionNormalizerService");
const PreFashnGarmentLockService_1 = require("./PreFashnGarmentLockService");
const AnchorVolumeTransferService_1 = require("./AnchorVolumeTransferService");
const FashnBaseTryOnService_1 = require("./FashnBaseTryOnService");
class TryOnServiceV2 {
    constructor() {
        this.normalizer = new ResolutionNormalizerService_1.ResolutionNormalizerService();
        this.preLocker = new PreFashnGarmentLockService_1.PreFashnGarmentLockService();
        this.fashn = new FashnBaseTryOnService_1.FashnBaseTryOnService();
        this.volumeTransfer = new AnchorVolumeTransferService_1.AnchorVolumeTransferService();
    }
    jobKey(id) {
        return `tryon:v2:job:${id}`;
    }
    /* ---------------- START JOB ---------------- */
    async startTryOn(input) {
        const jobId = (0, uuid_1.v4)();
        const job = {
            id: jobId,
            status: "created",
            modelImageUrl: input.modelImageUrl,
            garmentImageUrl: input.garmentImageUrl,
        };
        await redisConnection_1.redis.set(this.jobKey(jobId), JSON.stringify(job));
        // Fire and forget async execution
        this.runAsync(jobId).catch(console.error);
        return { jobId };
    }
    /* ---------------- ASYNC PIPELINE ---------------- */
    async runAsync(jobId) {
        try {
            const raw = await redisConnection_1.redis.get(this.jobKey(jobId));
            if (!raw)
                return;
            const job = JSON.parse(raw);
            // 1️⃣ Pre-lock garment
            const locked = await this.preLocker.lockBeforeFashn(job.garmentImageUrl);
            // 2️⃣ Normalize
            const normalizedModel = await this.normalizer.normalizeImage(job.modelImageUrl);
            const normalizedGarment = await this.normalizer.normalizeImage(locked.lockedGarmentUrl);
            // 3️⃣ Start FASHN
            const { predictionId } = await this.fashn.startBaseTryOn({
                modelImageUrl: normalizedModel.normalizedUrl,
                garmentImageUrl: normalizedGarment.normalizedUrl,
                segmentationFree: true,
            });
            Object.assign(job, {
                status: "fashn_running",
                predictionId,
                normalizedModelUrl: normalizedModel.normalizedUrl,
                normalizedGarmentUrl: normalizedGarment.normalizedUrl,
            });
            await redisConnection_1.redis.set(this.jobKey(jobId), JSON.stringify(job));
        }
        catch (err) {
            await this.failJob(jobId, err.message);
        }
    }
    /* ---------------- POLL + COMPLETE ---------------- */
    async pollJob(jobId) {
        const raw = await redisConnection_1.redis.get(this.jobKey(jobId));
        if (!raw)
            throw new Error("JOB_NOT_FOUND");
        const job = JSON.parse(raw);
        if (job.status === "completed" || job.status === "failed") {
            return job;
        }
        if (job.status === "fashn_running" && job.predictionId) {
            try {
                const { imageUrl } = await this.fashn.pollBaseTryOn(job.predictionId);
                job.status = "post_processing";
                job.baseTryOnUrl = imageUrl;
                await redisConnection_1.redis.set(this.jobKey(jobId), JSON.stringify(job));
                // Volume transfer
                const volume = await this.volumeTransfer.transferVolume({
                    anchorModelUrl: job.normalizedModelUrl,
                    fashnOutputUrl: imageUrl,
                });
                job.finalImageUrl = volume.finalUrl;
                job.status = "completed";
                await redisConnection_1.redis.set(this.jobKey(jobId), JSON.stringify(job));
            }
            catch (err) {
                if (err.message !== "NOT_READY") {
                    await this.failJob(jobId, err.message);
                }
            }
        }
        return JSON.parse((await redisConnection_1.redis.get(this.jobKey(jobId))));
    }
    async failJob(jobId, message) {
        const raw = await redisConnection_1.redis.get(this.jobKey(jobId));
        if (!raw)
            return;
        const job = JSON.parse(raw);
        job.status = "failed";
        job.error = message;
        await redisConnection_1.redis.set(this.jobKey(jobId), JSON.stringify(job));
    }
}
exports.TryOnServiceV2 = TryOnServiceV2;
