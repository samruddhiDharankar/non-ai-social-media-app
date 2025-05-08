import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import User from "../models/User";
import logger from "../logger";

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // logger.warn(`Token in authMiddleware: ${req.cookies.token}`);
    // logger.warn(`Req ${JSON.stringify(req)}`);
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({ message: "No token provided" });
      logger.error("No token provided");
      return;
    }

    // Verify the token using the JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      logger.error(`No user found userId: ${decoded.id}`);
      return;
    }

    // Attach the decoded user details to the request object for future access
    req.user = user;
    next();
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    logger.error(`Logout error, Error: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};
