import { Router } from "express";
import {
  loginByGoogle,
  loginUserByEmailAndPassword,
  logoutUser,
  signupUser,
} from "../controllers/authController";

const router = Router();
router.post("/login", loginUserByEmailAndPassword);
router.post("/signup", signupUser);
router.post("/logout", logoutUser);
router.post("/google-login", loginByGoogle);

export default router;
