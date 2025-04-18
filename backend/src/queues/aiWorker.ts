import IORedis from "ioredis";
import { Worker } from "bullmq";
import ContentAnalysis from "../models/ContentAnalysis";
import mongoose from "mongoose";

const connection = new IORedis({ maxRetriesPerRequest: null });

const startWorker = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB connected");

    const aiWorker = new Worker(
      "ai-processing",
      async (job) => {
        console.log("processing job", job.name, job.data);
        const { postId, text, imageUrl } = job.data;

        const result = await ContentAnalysis.findOneAndUpdate(
          { postId: postId },
          {
            $set: {
              status: "completed",
              analysisResults: [
                {
                  type: "text",
                },
              ],
            },
          }
        );
        console.log("Finished job");
        return { result };
      },
      { connection }
    );

    aiWorker.on("completed", (job) => {
      console.log(`Job ${job.id} has completed`);
    });

    aiWorker.on("failed", (job, err) => {
      console.error(`Job ${job?.id} failed:`, err);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  }
};

startWorker();
