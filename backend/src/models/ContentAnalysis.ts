import { timeStamp } from "console";
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAnalysisResult {
  type: "text" | "image" | "video" | "story";
  score: number;
  modelUsed: string;
  isAIContentLikely: boolean;
  confidenceScore: number;
  explanation: string;
  timestamp: Date;
}

export interface IContentAnalysis extends Document {
  postId: Types.ObjectId; // eg: post, story, video...
  contentType: string;
  analysisResults: IAnalysisResult[]; // one or more results
  status: "pending" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const ContentAnalysisSchema = new Schema<IContentAnalysis>(
  {
    postId: { type: Schema.Types.ObjectId, required: true, index: true },
    contentType: { type: String, required: true, index: true },
    analysisResults: [
      {
        type: {
          type: String,
          enum: ["text", "image", "video", "story"],
          required: true,
        },
        score: Number,
        modelUsed: String,
        isAIContentLikely: Boolean,
        confidenceScore: Number,
        explanation: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const ContentAnalysis = mongoose.model<IContentAnalysis>(
  "ContentAnalysis",
  ContentAnalysisSchema
);

export default ContentAnalysis;
