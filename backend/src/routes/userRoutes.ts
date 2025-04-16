import { Router, Request, Response, NextFunction } from "express";
import { getUsers } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";
const router = Router();

// Extend the Request type to include the custom user field added by the auth middleware
interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

// router.get("/", getUsers);

router.get(
  "/protected",
  protect,
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    res.json({
      message: `Hello user ${req.user?.id}, you are authorized`,
    });
  }
);

export default router;
