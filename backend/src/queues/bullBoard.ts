import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter.js";
import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis();

const aiQueue = new Queue("ai-processing", { connection });

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

// Use the BullMQAdapter correctly
createBullBoard({
  queues: [
    new BullMQAdapter(aiQueue), // Correct usage of BullMQAdapter
  ],
  serverAdapter,
});

export { serverAdapter };
