import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import Follow from "../models/Follow";
import logger from "../logger";

export const followUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { targetUserId } = req.body;
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      logger.error(`Not authorized`);
      return;
    }
    const userId = req.user.id;
    if (targetUserId === userId) {
      return;
    }

    // prevent duplicate follows
    const exists = await Follow.findOne({
      follower: userId,
      following: targetUserId,
    });

    if (exists) {
      res.status(400).json({ message: "Already following" });
      logger.warn("Already following");
      return;
    }

    const follow = await Follow.create({
      follower: userId,
      following: targetUserId,
    });
    res.status(201).json(follow);
    return;
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    logger.error(`Logout error, Error: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const unFollowUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { targetUserId } = req.body;

    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      logger.error(`Not authorized`);
      return;
    }
    const userId = req.user.id;

    // if (targetUserId === userId) return;

    await Follow.deleteOne({ follower: userId, following: targetUserId });
    res.json({ message: "Unfollowed successfully" });
    return;
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    logger.error(`Logout error, Error: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFollowers = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      logger.error(`Not authorized`);
      return;
    }

    const targetUserId = req.query.userId || req.user.id;

    const followers = await Follow.find({ following: targetUserId }).populate(
      "follower",
      "username name"
    );
    res.json(followers);
    return;
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    logger.error(`Logout error, Error: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFollowing = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      logger.error(`Not authorized`);
      return;
    }
    const targetUserId = req.query.userId || req.user.id;

    const following = await Follow.find({ follower: targetUserId }).populate(
      "following",
      "username name"
    );
    res.json(following);
    return;
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    logger.error(`Logout error, Error: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};
