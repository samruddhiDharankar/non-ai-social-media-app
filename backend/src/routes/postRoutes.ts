import { Router } from "express";

const router = Router();
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/", protect, createPost);
router.get("/user", protect, getPostByUser);

export default router;
