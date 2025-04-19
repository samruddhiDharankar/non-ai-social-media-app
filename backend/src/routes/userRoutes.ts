import { Router } from "express";
import { getMe, getUserById, getUsers } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";
const router = Router();

// protected route
router.get("/me", protect, getMe);
router.get("/", getUsers);
router.get("/:id", protect, getUserById);

export default router;
