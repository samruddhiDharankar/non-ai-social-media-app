import mongoose, { Schema, Document } from "mongoose";

export interface IAiScore extends Document {
  score: number;
  modelUsed: string;
  isAiContentLikely: boolean;
  confidenceScore: number;
  explanation: string;
}

const AiScoreSchema = new Schema<IAiScore>(
  {
    score: { type: Number },
    modelUsed: { type: String },
    isAiContentLikely: { type: Boolean },
    confidenceScore: { type: Number },
    explanation: { type: String },
  },
  { timestamps: true }
);

const AiScore = mongoose.model<IAiScore>("AiScore", AiScoreSchema);

export default AiScore;
