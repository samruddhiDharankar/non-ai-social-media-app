import mongoose, { Schema, Types } from "mongoose";

export interface IComment extends Document {
  postId: Types.ObjectId;
  user: Types.ObjectId;
  content: string;
}

const commentSchema = new Schema<IComment>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Comment = mongoose.model<IComment>("Comment", commentSchema);

export default Comment;
