import { Router } from "express";
import {
  createPost,
  deletePostById,
  getAllPosts,
  getPostById,
  getPostByUserId,
} from "../controllers/postController";
import { protect } from "../middleware/authMiddleware";
import { postRateLimiter } from "../middleware/rateLimitMiddleware";

const router = Router();

router.get("/feed", protect, getAllPosts);
router.get("/user/:id", protect, getPostByUserId);
router.get("/:id", protect, getPostById);
router.post("/", protect, postRateLimiter, createPost);
router.post("/:id", protect, deletePostById);

export default router;
