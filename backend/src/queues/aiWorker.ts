import IORedis from "ioredis";
import { Worker } from "bullmq";
import ContentAnalysis from "../models/ContentAnalysis";
import mongoose from "mongoose";
import { analyzeTextContent } from "../services/aiScoringService";
import Post from "../models/Post";

const connection = new IORedis(process.env.UPSTASH_REDIS_URL as string, {
  maxRetriesPerRequest: null,
});

export const startWorker = async () => {
  try {
    // mongoose.set("debug", true);
    // await mongoose.connect(process.env.MONGO_URI as string);
    // console.log("MongoDB connected");

    const aiWorker = new Worker(
      "ai-processing",
      async (job) => {
        console.log("processing job", job.name, job.data);
        const { postId, text, imageUrl } = job.data;
        let analysisResults = [];

        if (text) {
          const textResults = await analyzeTextContent(text);
          analysisResults.push({
            type: "text",
            ...textResults,
            timestamp: new Date(),
          });
        }

        // later add image analysis here

        const result = await ContentAnalysis.findOneAndUpdate(
          { postId },
          {
            $set: {
              status: "completed",
              analysisResults,
            },
          },
          { new: true }
        );
        console.log("Finished job");

        const updatedPost = await Post.findOneAndUpdate(
          { _id: postId },
          {
            $set: {
              authScore: analysisResults[0]?.score,
              aiDetectionSummary: analysisResults[0]?.explanation,
            },
          },
          { new: true }
        );
        console.log("Update post record with ai score");
        return { result, updatedPost };
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

// startWorker();
