import { Router } from "express";
import { getMe, getUsers } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";
const router = Router();

// protected route
router.get("/me", protect, getMe);
router.get("/", getUsers);
export default router;
