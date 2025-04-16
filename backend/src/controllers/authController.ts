import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const loginUserByEmailAndPassword = (req: Request, res: Response) => {
  const { email, password } = req.body;

  // dummy validation
  if (email === "test@gmail.com" && password === "123456") {
    const token = jwt.sign({ id: "user123" }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};
