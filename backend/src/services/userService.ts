import Post from "../models/Post";

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
