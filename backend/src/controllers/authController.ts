import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import bcrypt from "bcrypt";

export const loginUserByEmailAndPassword = async (
  req: Request,
  res: Response
) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword);
  if (isPasswordCorrect) {
    user.lastLogin = new Date();
    await user.save();
    const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }
};

export const signupUser = async (req: Request, res: Response) => {
  const { username, name, email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });
  if (user) {
    res.status(409).json({ message: "Email is already used" });
    return;
  }
  const hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.BCRYPT_SALT_ROUNDS)
  );
  const createdUser = await User.create({
    username: username,
    name: name,
    email: normalizedEmail,
    hashedPassword: hashedPassword as string,
  });
  res.status(201).json({ message: "User created" });
  return;
};
