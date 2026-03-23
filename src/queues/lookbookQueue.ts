import Queue from "bull";

const REDIS_URL = "redis://127.0.0.1:6379";

export interface LookbookJobPayload {
  lookbookId: string;
  renderId: string;
}

export const lookbookImageQueue = new Queue<LookbookJobPayload>(
  "lookbook-image-queue",
  REDIS_URL
);
