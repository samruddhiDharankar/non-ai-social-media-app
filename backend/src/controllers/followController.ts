import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import Follow from "../models/Follow";

export const followUser = async (req: AuthenticatedRequest, res: Response) => {
  const { targetUserId } = req.body;
  if (!req.user) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }
  const userId = req.user.id;

  // prevent duplicate follows
  const exists = await Follow.findOne({
    follower: userId,
    following: targetUserId,
  });
  if (exists) {
    res.status(400).json({ message: "Already following" });
    return;
  }

  const follow = await Follow.create({
    follower: userId,
    following: targetUserId,
  });
  res.status(201).json(follow);
  return;
};

export const unFollowUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { targetUserId } = req.body;
  if (!req.user) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }
  const userId = req.user.id;

  await Follow.deleteOne({ follower: userId, following: targetUserId });
  res.json({ message: "Unfollowed successfully" });
  return;
};

export const getFollowers = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }

  const followers = await Follow.find({ following: req.user.id }).populate(
    "follower",
    "username name"
  );
  res.json(followers);
  return;
};

export const getFollowing = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }

  const following = await Follow.find({ follower: req.user.id }).populate(
    "following",
    "username name"
  );
  res.json(following);
  return;
};
