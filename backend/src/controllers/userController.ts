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

// dummy
export const getMe = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  // res.json({ message: `Hello user ${req.user?.id}, you are authorized` });
  if (!req.user) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }

  const avgScore = await getAverageAuthScore(req.user?.id);
  const { tier, badge } = getUserTier(avgScore);

  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    tier,
    averageAuthScore: +avgScore.toFixed(2),
    // add badge in here and model
  });
};
