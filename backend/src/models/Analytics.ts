import mongoose, { Schema, Document } from "mongoose";

export interface IAnalytics extends Document {
  ipAddress: string;
  userAgent: string;
  location: string;
  sessionId: string;
  referrer: string;
}

const analyticsSchema = new Schema<IAnalytics>({
  ipAddress: { type: String, default: "" },
  userAgent: { type: String, default: "" },
  location: { type: String, default: "" },
  sessionId: { type: String, default: "" },
  referrer: { type: String, default: "" },
});

const Analytics = mongoose.model<IAnalytics>("Analytics", analyticsSchema);

export default Analytics;
