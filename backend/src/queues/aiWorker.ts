import IORedis from "ioredis";
import { Worker } from "bullmq";
import ContentAnalysis from "../models/ContentAnalysis";
import mongoose from "mongoose";

const connection = new IORedis({ maxRetriesPerRequest: null });

export const aiWorker = new Worker(
  "ai-processing",
  async (job) => {
    console.log("processing job", job.name, job.data);
    const { postId, text, imageUrl } = job.data;
    // call AI api
    const ObjectId = mongoose.Types.ObjectId.createFromHexString(postId);
    console.log("ObjectId ", ObjectId);
    const result = await ContentAnalysis.findOneAndUpdate(
      { contentId: ObjectId },
      {
        $set: {
          status: "completed",
          results: [
            {
              type: "text",
            },
          ],
        },
      }
    );
    return Promise.resolve({ result });
    console.log("Finished job");
  },
  { connection }
);
