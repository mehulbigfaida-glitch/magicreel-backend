import { v4 as uuidv4 } from "uuid";
import { redis } from "../../config/redisConnection";
import { buildLookbookPrompt } from "../prompts/lookbookPromptBuilder";
import { AVATAR_REGISTRY, AvatarKey } from "../registry/avatarRegistry";

export interface LookbookJob {
  id: string;
  status: "created" | "fashn_running" | "completed" | "failed";
  predictionId?: string;
  avatarKey: AvatarKey;
  modelImageUrl: string;
  garmentImageUrl: string;
  heroImageUrl?: string;
  error?: string;
}

export class LookbookServiceV1 {
  private jobKey(id: string) {
    return `lookbook:v1:job:${id}`;
  }

  async startLookbook(input: {
    avatarKey: AvatarKey;
    garmentImageUrl: string;
  }): Promise<{ jobId: string }> {
    const avatar = AVATAR_REGISTRY[input.avatarKey];
    if (!avatar) throw new Error("INVALID_AVATAR");

    const jobId = uuidv4();

    const job: LookbookJob = {
      id: jobId,
      status: "created",
      avatarKey: input.avatarKey,
      modelImageUrl: avatar.modelImageUrl,
      garmentImageUrl: input.garmentImageUrl,
    };

    await redis.set(this.jobKey(jobId), JSON.stringify(job));

    this.runAsync(jobId).catch(console.error);

    return { jobId };
  }

  private async runAsync(jobId: string) {
    try {
      const raw = await redis.get(this.jobKey(jobId));
      if (!raw) return;

      const job: LookbookJob = JSON.parse(raw);
      const avatar = AVATAR_REGISTRY[job.avatarKey];

      const prompt = buildLookbookPrompt(avatar.size);

      // ⬇️ FASHN CALL WILL BE ADDED NEXT STEP
      job.status = "fashn_running";

      await redis.set(this.jobKey(jobId), JSON.stringify(job));
    } catch (err: any) {
      await this.failJob(jobId, err.message);
    }
  }

  async pollJob(jobId: string): Promise<LookbookJob> {
    const raw = await redis.get(this.jobKey(jobId));
    if (!raw) throw new Error("JOB_NOT_FOUND");
    return JSON.parse(raw);
  }

  private async failJob(jobId: string, message: string) {
    const raw = await redis.get(this.jobKey(jobId));
    if (!raw) return;
    const job: LookbookJob = JSON.parse(raw);
    job.status = "failed";
    job.error = message;
    await redis.set(this.jobKey(jobId), JSON.stringify(job));
  }
}
