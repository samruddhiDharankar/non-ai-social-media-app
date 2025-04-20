import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Post from "../models/Post";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import ContentAnalysis from "../models/ContentAnalysis";
import { aiQueue } from "../queues/aiQueue";
import Comment from "../models/Comment";

// @desc Get all posts
// @route GET /api/posts
// @access public/protected => NEED TO DECIDE
export const getAllPosts = async (req: Request, res: Response) => {
  const posts = await Post.find({})
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "username",
      },
      select: "content username",
    })
    .populate({
      path: "user",
      select: "username",
    })
    .sort({ createdAt: -1 });
  res.json(posts);
  return;
};

// @desc Get a post by id
// @route GET /api/posts/:id
// @access public/protected => = NEED TO DECIDE
export const getPostById = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const post = await Post.findById(postId);

  const analysis = await ContentAnalysis.findOne({
    postId: postId,
    contentType: "Post",
  });

  if (!post) {
    res.status(404).json({ message: "Post not found" });
  }
  // res.json(post);
  res.json({ post, analysis });
  return;
};

// @desc Create a new post
// @route POST /api/posts
// @access protected
export const createPost = async (req: AuthenticatedRequest, res: Response) => {
  const { text, imageUrl, authScore, aiDetectionSummary } = req.body;
  if (!req.user) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }

  const createdPost = await Post.create({
    text: text,
    imageUrl: imageUrl,
    authScore: authScore,
    aiDetectionSummary: aiDetectionSummary,
    tierAtPostTime: req.user.tier,
    user: req.user.id,
  });

  const analysis = await ContentAnalysis.create({
    postId: createdPost._id,
    contentType: "Post",
    analysisResults: [],
    status: "pending",
  });

  await aiQueue.add("analyze-post", {
    postId: analysis.postId,
    text: createdPost.text,
    imageUrl: createdPost.imageUrl,
  });

  res.status(201).json({
    message: "Post created, Content created",
    postId: createdPost._id,
  });

  // call the ai api to get score
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

  const posts = await Post.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });
  res.json(posts);
  return;
};
