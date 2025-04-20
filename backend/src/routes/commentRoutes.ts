import { Router } from "express";
import {
  createComment,
  getCommentByPost,
} from "../controllers/commentController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/:id", protect, getCommentByPost);
router.post("/", protect, createComment);

export default router;
