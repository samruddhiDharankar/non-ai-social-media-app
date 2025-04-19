import User from "../models/User";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { getAverageAuthScore } from "../services/userService";
import { getUserTier } from "../utils/tierUtils";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const users = await User.find();
  res.json(users);
};

export const getUserById = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.params.id;
  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({ message: "User not found" });
  }

  res.json(user);
  return;
};

export const getMe = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }

  const avgScore = await getAverageAuthScore(req.user?.id);
  const { tier, badge } = await getUserTier(avgScore);
  console.log("avg", avgScore);

  const updatedUser = await User.findByIdAndUpdate(
    { _id: req.user.id },
    {
      $set: {
        averageAuthScore: +avgScore.toFixed(2),
        tier: tier,
        badge: badge,
      },
    }
  );

  res.json(updatedUser);
  return;
};
