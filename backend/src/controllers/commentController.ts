import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import Comment from "../models/Comment";

export const createComment = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { postId, content } = req.body;
  if (!req.user) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }
  const userId = req.user.id;

  const newComment = await Comment.create({
    postId: postId,
    userId: userId,
    content: content,
  });
  res.status(201).json({ message: "comment created" });
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
