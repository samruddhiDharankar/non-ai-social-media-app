import { Router } from "express";
import { getAllContentAnalysis } from "../controllers/contentAnalysisController";

const router = Router();
router.get("/", getAllContentAnalysis);

export default router;
