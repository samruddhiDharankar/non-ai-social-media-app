import { Router } from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  getPostByUserId,
} from "../controllers/postController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/feed", getAllPosts);
router.get("/user/:id", protect, getPostByUserId);
router.get("/:id", getPostById);
router.post("/", protect, createPost);

export default router;
