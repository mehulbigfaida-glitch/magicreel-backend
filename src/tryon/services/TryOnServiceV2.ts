import { v4 as uuidv4 } from "uuid";
import { redis } from "../../config/redisConnection";
import { ResolutionNormalizerService } from "./ResolutionNormalizerService";
import { PreFashnGarmentLockService } from "./PreFashnGarmentLockService";
import { AnchorVolumeTransferService } from "./AnchorVolumeTransferService";
import { FashnBaseTryOnService } from "./FashnBaseTryOnService";

export interface TryOnJob {
  id: string;
  status: "created" | "fashn_running" | "post_processing" | "completed" | "failed";
  predictionId?: string;
  modelImageUrl: string;
  garmentImageUrl: string;
  normalizedModelUrl?: string;
  normalizedGarmentUrl?: string;
  baseTryOnUrl?: string;
  finalImageUrl?: string;
  error?: string;
}

export class TryOnServiceV2 {
  private normalizer = new ResolutionNormalizerService();
  private preLocker = new PreFashnGarmentLockService();
  private fashn = new FashnBaseTryOnService();
  private volumeTransfer = new AnchorVolumeTransferService();

  private jobKey(id: string) {
    return `tryon:v2:job:${id}`;
  }

  /* ---------------- START JOB ---------------- */
  async startTryOn(input: {
    modelImageUrl: string;
    garmentImageUrl: string;
  }): Promise<{ jobId: string }> {
    const jobId = uuidv4();

    const job: TryOnJob = {
      id: jobId,
      status: "created",
      modelImageUrl: input.modelImageUrl,
      garmentImageUrl: input.garmentImageUrl,
    };

    await redis.set(this.jobKey(jobId), JSON.stringify(job));

    // Fire and forget async execution
    this.runAsync(jobId).catch(console.error);

    return { jobId };
  }

  /* ---------------- ASYNC PIPELINE ---------------- */
  private async runAsync(jobId: string) {
    try {
      const raw = await redis.get(this.jobKey(jobId));
      if (!raw) return;

      const job: TryOnJob = JSON.parse(raw);

      // 1️⃣ Pre-lock garment
      const locked = await this.preLocker.lockBeforeFashn(job.garmentImageUrl);

      // 2️⃣ Normalize
      const normalizedModel = await this.normalizer.normalizeImage(job.modelImageUrl);
      const normalizedGarment = await this.normalizer.normalizeImage(
        locked.lockedGarmentUrl
      );

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

      await redis.set(this.jobKey(jobId), JSON.stringify(job));
    } catch (err: any) {
      await this.failJob(jobId, err.message);
    }
  }

  /* ---------------- POLL + COMPLETE ---------------- */
  async pollJob(jobId: string): Promise<TryOnJob> {
    const raw = await redis.get(this.jobKey(jobId));
    if (!raw) throw new Error("JOB_NOT_FOUND");

    const job: TryOnJob = JSON.parse(raw);

    if (job.status === "completed" || job.status === "failed") {
      return job;
    }

    if (job.status === "fashn_running" && job.predictionId) {
      try {
        const { imageUrl } = await this.fashn.pollBaseTryOn(job.predictionId);

        job.status = "post_processing";
        job.baseTryOnUrl = imageUrl;
        await redis.set(this.jobKey(jobId), JSON.stringify(job));

        // Volume transfer
        const volume = await this.volumeTransfer.transferVolume({
          anchorModelUrl: job.normalizedModelUrl!,
          fashnOutputUrl: imageUrl,
        });

        job.finalImageUrl = volume.finalUrl;
        job.status = "completed";
        await redis.set(this.jobKey(jobId), JSON.stringify(job));
      } catch (err: any) {
        if (err.message !== "NOT_READY") {
          await this.failJob(jobId, err.message);
        }
      }
    }

    return JSON.parse((await redis.get(this.jobKey(jobId)))!);
  }

  private async failJob(jobId: string, message: string) {
    const raw = await redis.get(this.jobKey(jobId));
    if (!raw) return;
    const job: TryOnJob = JSON.parse(raw);
    job.status = "failed";
    job.error = message;
    await redis.set(this.jobKey(jobId), JSON.stringify(job));
  }
}
