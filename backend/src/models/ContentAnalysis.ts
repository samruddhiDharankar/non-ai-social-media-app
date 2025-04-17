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
  contentId: Types.ObjectId;  // eg: post, story, video...
  contentType: string;      
  results: IAnalysisResult[]; // one or more results
  status: "pending" | "completed" | "failed";
}

const ContentAnalysisSchema = new Schema<IContentAnalysis>(
  {
    contentId: { type: Schema.Types.ObjectId, required: true, index: true },
    contentType: { type: String, required: true, index: true},
    results: [
      {
        type: { type: String, enum: ["text","image","video","story"], required: true },
        score: Number,
        modelUsed: String,
        isAIContentLikely: Boolean,
        confidenceScore: Number,
        explanation: String,
      }
    ]
  },
  { timestamps: true }
);

const ContentAnalysis = mongoose.model<IContentAnalysis>("ContentAnalysis", ContentAnalysisSchema);

export default ContentAnalysis;
