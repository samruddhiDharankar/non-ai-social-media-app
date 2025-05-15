import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Post from "../models/Post";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import ContentAnalysis from "../models/ContentAnalysis";
import { aiQueue } from "../queues/aiQueue";
import Comment from "../models/Comment";
import User from "../models/User";
import logger from "../logger";

// @desc Get all posts
// @route GET /api/posts
// @access public/protected => NEED TO DECIDE
export const getAllPosts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      logger.error(`Not authorized`);
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const totalPosts = await Post.countDocuments(); // for frontend pagination UI
    const posts = await Post.find({})
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username",
        },
        select: "content username createdAt updatedAt",
      })
      .populate({
        path: "user",
        select: "username",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
    });

    return;
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    logger.error(`Logout error, Error: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc Get a post by id
// @route GET /api/posts/:id
// @access public/protected => = NEED TO DECIDE
export const getPostById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      logger.error(`Not authorized`);
      return;
    }
    const postId = req.params.id;
    const post = await Post.findById(postId);

    const analysis = await ContentAnalysis.findOne({
      postId: postId,
      contentType: "Post",
    });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      logger.error(`Post not found postId: ${postId}`);
    }

    res.json({ post, analysis });
    return;
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    logger.error(`Logout error, Error: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc Create a new post
// @route POST /api/posts
// @access protected
export const createPost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { text, imageUrl, authScore, aiDetectionSummary } = req.body;
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      logger.error(`Not authorized`);
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

    await User.findByIdAndUpdate(
      { _id: req.user.id },
      { $inc: { postCount: 1 } }
    );

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

    return;
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    logger.error(`Logout error, Error: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc Get all posts for a specific user
// @route GET /api/posts/user/:userId
// @access public/protected => this should be protected?
export const getPostByUserId = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      logger.error(`Not authorized`);
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const totalPosts = await Post.countDocuments({ user: id });

    const posts = await Post.find({ user: id })
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username",
        },
        select: "content username createdAt updatedAt",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
    });

    return;
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    logger.error(`Logout error, Error: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePostById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      logger.error(`Not authorized`);
      return;
    }
    const postId = req.params.id;
    // soft delete for now
    const deletedPost = await Post.findByIdAndUpdate(
      { _id: postId },
      {
        $set: {
          isDeleted: true,
        },
      }
    );
    if (deletedPost) {
      const userPostCount = await User.findByIdAndUpdate(
        { _id: req.user.id },
        {
          $inc: { postCount: -1 },
        },
        { new: true }
      );
    }
    res.status(200).json({ message: "Post deleted", post: { postId } });
    return;
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    logger.error(`Logout error, Error: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};
