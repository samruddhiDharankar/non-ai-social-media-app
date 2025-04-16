import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const login = (req: Request, res: Response) => {
  // dummy user Id => fetch from db
  const userId = "12345";

  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
  res.json({ token });
};
