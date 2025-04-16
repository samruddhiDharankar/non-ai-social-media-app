import User from "../models/User";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const users = await User.find();
  res.json(users);
};

// dummy
export const getMe = (req: AuthenticatedRequest, res: Response) => {
  res.json({ message: `Hello user ${req.user?.id}, you are authorized` });
};
