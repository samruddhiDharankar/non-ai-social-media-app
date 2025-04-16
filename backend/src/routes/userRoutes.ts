import { Router, Request, Response, NextFunction } from "express";
import { getMe, getUsers } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
const router = Router();

// protected route
router.get("/me", protect, getMe);
router.get("/", getUsers); // using for testing
export default router;
