import { Queue } from "bullmq";

import IORedis from "ioredis";

const connection = new IORedis();

export const aiQueue = new Queue("ai-processing", { connection });
