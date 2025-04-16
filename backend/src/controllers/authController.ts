import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const loginUserByEmailAndPassword = async (
  req: Request,
  res: Response
) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({ message: "User not found" });
  }

  if (password === user?.hashedPassword) {
    const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

export const signupUser = async (req: Request, res: Response) => {
  const {username, name, email, password} = req.body;
  const user - await User.findOne({ email });
  if(user) {
    res.status(404).json({ message: "Email is already used" });
  }

  const createdUser = await User.create({
    username: username,
    name: name,
    email: email,
    hashedPassword: password
  });

  console.log("user created", createdUser);
};
