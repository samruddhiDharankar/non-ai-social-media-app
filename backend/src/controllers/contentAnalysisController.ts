import { Request, Response } from "express";
import ContentAnalysis from "../models/ContentAnalysis";

export const getAllContentAnalysis = async (req: Request, res: Response) => {
  const analyses = await ContentAnalysis.find().sort({ createdAt: -1 });
  res.json(analyses);
};
