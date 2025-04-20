import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import {
  followUser,
  getFollowers,
  getFollowing,
  unFollowUser,
} from "../controllers/followController";

const router = Router();

router.post("/follow", protect, followUser);
router.post("/unfollow", protect, unFollowUser);
router.get("/followers", protect, getFollowers);
router.get("/following", protect, getFollowing);

export default router;
