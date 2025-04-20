import { Router } from "express";
import {
  loginUserByEmailAndPassword,
  logoutUser,
  signupUser,
} from "../controllers/authController";

const router = Router();
router.post("/login", loginUserByEmailAndPassword);
router.post("/signup", signupUser);
router.post("/logout", logoutUser);

export default router;
