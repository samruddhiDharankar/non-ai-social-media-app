import { Queue } from "bullmq";

import IORedis from "ioredis";

const connection = new IORedis(process.env.UPSTASH_REDIS_URL as string);

export const aiQueue = new Queue("ai-processing", { connection });
