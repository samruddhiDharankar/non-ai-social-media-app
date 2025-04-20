import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  hashedPassword: string;
  username: string;
  bio?: string;
  profilePictUrl?: string;
  tier: string;
  averageAuthScore: number;
  badge: string;
  postCount: number;
  streakCount: number;
  lastLogin?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    bio: { type: String },
    profilePictUrl: { type: String },
    tier: { type: String, default: "Newbie" },
    averageAuthScore: { type: Number, default: 0 },
    badge: { type: String, default: "🐣" },
    postCount: { type: Number, default: 0 },
    streakCount: { type: Number, default: 0 },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
