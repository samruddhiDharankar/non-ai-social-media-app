import { Router } from "express";
import { createPost, getAllPosts, getPostById, getPostByUser } from "../controllers/postController";
import { protect } from "../middleware/authMiddleware";

const router = Router();
router.get("/feed", getAllPosts);
router.get("/:id", getPostById);
router.post("/", protect, createPost);
router.get("/user", protect, getPostByUser);

export default router;
