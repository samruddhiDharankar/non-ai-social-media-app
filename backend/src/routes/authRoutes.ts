import { Router } from "express";
import { loginUserByEmailAndPassword, signupUser } from "../controllers/authController";

const router = Router();
router.post("/login", loginUserByEmailAndPassword);
router.post("/signup", signupUser);

export default router;
