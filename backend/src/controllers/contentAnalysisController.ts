import { Request, Response } from "express";
import ContentAnalysis from "../models/ContentAnalysis";
import logger from "../logger";

export const getAllContentAnalysis = async (req: Request, res: Response) => {
  try {
    const analyses = await ContentAnalysis.find().sort({ createdAt: -1 });
    res.json(analyses);
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    logger.error(`Logout error, Error: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};
