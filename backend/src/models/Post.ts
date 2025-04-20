import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPost extends Document {
  text: string;
  imageUrl?: string;
  authScore: number;
  aiDetectionSummary: string;
  tierAtPostTime: string;
  userId: Types.ObjectId; // refers to User document
  comments: Types.Array<Types.ObjectId>; // array of comment references
}

const postSchema = new Schema<IPost>(
  {
    text: { type: String, default: "" },
    imageUrl: { type: String },
    authScore: { type: Number, default: 0 },
    aiDetectionSummary: { type: String, default: "" },
    tierAtPostTime: { type: String, default: "" },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", //reference to the User model
      required: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment", // ref to comment model
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;
