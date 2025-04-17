import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Post from "../models/Post";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";

// @desc Get all posts
// @route GET /api/posts
// @access public/protected => NEED TO DECIDE
export const getAllPosts = async (req: Request, res: Response) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
  return;
};

// @desc Get a post by id
// @route GET /api/posts/:id
// @access public/protected => = NEED TO DECIDE
export const getPostById = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const post = await Post.findById(postId);
  if (!post) {
    res.status(404).json({ message: "Post not found" });
  }
  res.json(post);
  return;
};

// @desc Create a new post
// @route POST /api/posts
// @access protected
export const createPost = async (req: AuthenticatedRequest, res: Response) => {
  const { text, imageUrl, authScore, aiDetectionSummary, tierAtPostTime } =
    req.body;
  if (!req.user) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }
  // call the ai api to get score
  const createdPost = await Post.create({
    text: text,
    imageUrl: imageUrl,
    authScore: authScore,
    aiDetectionSummary: aiDetectionSummary,
    tierAtPostTime: req.user.tier,
    userId: req.user.id,
  });
  res.status(202).json({ message: "Post created" });
  return;
};

// @desc Get all posts for a specific user
// @route GET /api/posts/user/:userId
// @access public/protected => this should be protected?
export const getPostByUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }
  const userId = req.user.id;
  const posts = await Post.find({ userId: userId });
  res.json(posts);
  return;
};
