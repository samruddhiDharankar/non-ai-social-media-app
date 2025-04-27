import logger from "../logger";
import Post from "../models/Post";

export const getAverageAuthScore = async (userId: string): Promise<number> => {
  try {
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
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    logger.error(`Logout error, Error: ${err.message}`);
    return 0;
  }
};
