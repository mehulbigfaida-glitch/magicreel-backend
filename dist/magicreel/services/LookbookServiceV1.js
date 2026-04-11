"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LookbookServiceV1 = void 0;
const uuid_1 = require("uuid");
const redisConnection_1 = require("../../config/redisConnection");
const lookbookPromptBuilder_1 = require("../prompts/lookbookPromptBuilder");
const avatarRegistry_1 = require("../registry/avatarRegistry");
class LookbookServiceV1 {
    jobKey(id) {
        return `lookbook:v1:job:${id}`;
    }
    async startLookbook(input) {
        const avatar = avatarRegistry_1.AVATAR_REGISTRY[input.avatarKey];
        if (!avatar)
            throw new Error("INVALID_AVATAR");
        const jobId = (0, uuid_1.v4)();
        const job = {
            id: jobId,
            status: "created",
            avatarKey: input.avatarKey,
            modelImageUrl: avatar.modelImageUrl,
            garmentImageUrl: input.garmentImageUrl,
        };
        await redisConnection_1.redis.set(this.jobKey(jobId), JSON.stringify(job));
        this.runAsync(jobId).catch(console.error);
        return { jobId };
    }
    async runAsync(jobId) {
        try {
            const raw = await redisConnection_1.redis.get(this.jobKey(jobId));
            if (!raw)
                return;
            const job = JSON.parse(raw);
            const avatar = avatarRegistry_1.AVATAR_REGISTRY[job.avatarKey];
            const prompt = (0, lookbookPromptBuilder_1.buildLookbookPrompt)(avatar.size);
            // ⬇️ FASHN CALL WILL BE ADDED NEXT STEP
            job.status = "fashn_running";
            await redisConnection_1.redis.set(this.jobKey(jobId), JSON.stringify(job));
        }
        catch (err) {
            await this.failJob(jobId, err.message);
        }
    }
    async pollJob(jobId) {
        const raw = await redisConnection_1.redis.get(this.jobKey(jobId));
        if (!raw)
            throw new Error("JOB_NOT_FOUND");
        return JSON.parse(raw);
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
exports.LookbookServiceV1 = LookbookServiceV1;
