import User from "../models/User";
import { Request, Response, NextFunction } from "express";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const users = await User.find();
  res.json(users);
};
