import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import User from "../models/User";

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // const authHeader = req.headers.authorization;
  const token = req.cookies.token;

  // if (!authHeader || !authHeader.startsWith("Bearer ")) {
  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  // const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Attach the decoded user ID to the request object for future access
    // req.user = { id: decoded.id };
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};
