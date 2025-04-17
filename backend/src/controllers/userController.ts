import User from "../models/User";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const users = await User.find();
  res.json(users);
};

// dummy
export const getMe = (req: AuthenticatedRequest, res: Response): void => {
  // res.json({ message: `Hello user ${req.user?.id}, you are authorized` });
  if (!req.user) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }
  // test these
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    tier: req.user.tier,
  });
};
