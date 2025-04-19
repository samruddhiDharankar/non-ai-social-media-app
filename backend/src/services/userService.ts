import { FilterQuery, UpdateQuery } from "mongoose";
import Post from "../models/Post";
import User, { IUser } from "../models/User";

export const getAverageAuthScore = async (userId: string): Promise<number> => {
  const posts = await Post.find({ userId: userId })
    .sort({ createdAt: -1 })
    .limit(10)
    .select("authScore");

  if (posts.length === 0) return 0;

  const totalScore = posts.reduce(
    (sum, post) => sum + (post.authScore ?? 0),
    0
  );
  return totalScore / posts.length;
};

export const updateUserByFilter = async (
  filter: FilterQuery<IUser>,
  updateData: UpdateQuery<IUser>
) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      filter,
      {
        $set: {
          updateData,
        },
      },
      { new: true }
    );
    // console.log(updatedUser);
    return updatedUser;
  } catch (err) {
    console.error("Error updating user", err);
  }
};
