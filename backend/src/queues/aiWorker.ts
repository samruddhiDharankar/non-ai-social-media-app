import IORedis from "ioredis";
import { Worker } from "bullmq";
import ContentAnalysis from "../models/ContentAnalysis";
import { analyzeTextContent } from "../services/aiScoringService";
import Post from "../models/Post";
import logger from "../logger";

const connection = new IORedis(process.env.UPSTASH_REDIS_URL as string, {
  maxRetriesPerRequest: null,
});

export const startWorker = async () => {
  try {
    const aiWorker = new Worker(
      "ai-processing",
      async (job) => {
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

        return { result, updatedPost };
      },
      { connection }
    );

    aiWorker.on("completed", (job) => {
      logger.info(`Job ${job.id} has completed`);
    });

    aiWorker.on("failed", (job, err) => {
      logger.info(`Job ${job?.id} failed:`, err);
    });
  } catch (err) {
    logger.error(`Error connecting to MongoDB ${err}`);
  }
};
