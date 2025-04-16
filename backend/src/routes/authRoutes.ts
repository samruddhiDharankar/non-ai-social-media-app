import { Router } from "express";
import { loginUserByEmailAndPassword } from "../controllers/authController";

const router = Router();
router.post("/login", loginUserByEmailAndPassword);

export default router;
