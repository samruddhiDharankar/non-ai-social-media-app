import User from "../models/User";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { getAverageAuthScore } from "../services/userService";
import { getUserTier } from "../utils/tierUtils";
import logger from "../logger";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find({}, { username: 1, _id: 0 });
    res.json(users);
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    logger.error(`Logout error, Error: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      logger.warn(`User not found userId: ${userId}`);
    }

    res.json(user);
    return;
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    logger.error(`Logout error, Error: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserByUsername = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: username });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      logger.warn(`User not found username: ${username}`);
    }
    res.json(user);
    return;
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    logger.error(`Logout error, Error: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMe = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      logger.error(`Not authorized`);
      return;
    }

    const avgScore = await getAverageAuthScore(req.user.id);
    const { tierNumber, tier, badge } = await getUserTier(avgScore);

    let isTierChanged = 0;
    if (tierNumber > req.user.tierNumber) {
      isTierChanged = 1;
    } else if (tierNumber < req.user.tierNumber) {
      isTierChanged = -1;
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.user.id },
      {
        $set: {
          averageAuthScore: +avgScore.toFixed(2),
          tier: tier,
          badge: badge,
          tierNumber: tierNumber,
          isTierChanged: isTierChanged,
        },
      }
    );

    res.json(updatedUser);
    return;
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    logger.error(`Logout error, Error: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};
