import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express's Request type to include a `user` field
interface AuthenticationRequest extends Request {
  user?: { id: string }; // Optional field that we'll attach after decoding the token
}

export const protect = (
  req: AuthenticationRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    // Attach the decoded user ID to the request object for future access
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
