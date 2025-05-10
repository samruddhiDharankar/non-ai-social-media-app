import rateLimit from "express-rate-limit";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";

export const postRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many posts created, please try again later",
  keyGenerator: (req: AuthenticatedRequest) => req.user?.id, // use userId for rate limiting
});
