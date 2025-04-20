import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import Comment from "../models/Comment";
import Post from "../models/Post";

export const createComment = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { postId, content } = req.body;
  if (!req.user) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }
  const user = req.user.id;

  const newComment = await Comment.create({
    postId: postId,
    user: user,
    content: content,
  });

  // populate user details for frontend display
  await newComment.populate("user", "username");

  // add comment to the post
  await Post.findByIdAndUpdate(postId, {
    $push: { comments: newComment._id },
  });
  res.status(201).json(newComment);
  return;
};

export const getCommentByPost = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const postId = req.params.id;
  const comments = await Comment.find({ postId: postId })
    .populate("userId", "username")
    .sort({ createdAt: -1 });

  res.json(comments);
  return;
};
