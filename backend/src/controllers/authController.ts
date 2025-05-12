import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import bcrypt from "bcrypt";
import logger from "../logger";
import { OAuth2Client } from "google-auth-library";
import { getRandomUsername } from "../services/usernameGeneratorService";

export const loginUserByEmailAndPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      logger.warn(`User not found email: ${email}`);
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.hashedPassword || ""
    );
    if (isPasswordCorrect) {
      user.lastLogin = new Date();
      await user.save();

      const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });

      // res.cookie("token", token, {
      //   httpOnly: true, // Prevents client-side JS access
      //   secure: true, // set to true in production with https
      //   sameSite: "none", // Helps mitigate CSRF attacks
      //   maxAge: 1 * 1 * 60 * 60 * 1000, // 1hr
      // });

      logger.warn(`Token setting: ${token}`);

      res.status(200).json({
        message: "Logged in successfully",
        user: { _id: user._id, username: user.username, token: token },
      });
      return;
    } else {
      res.status(401).json({ message: "Invalid credentials" });
      logger.warn(`Invalid credentials email: ${email}`);
      return;
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    logger.error(
      `Login error for email: ${req.body.email}, Error: ${err.message}`
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signupUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    const userByEmail = await User.findOne({ email: normalizedEmail });
    // const userByUsername = await User.findOne({ username: username });
    if (userByEmail) {
      res.status(409).json({ message: "Email is already used" });
      logger.warn(`Email is already used: ${email}`);
      return;
    }
    // if (userByUsername) {
    //   res.status(409).json({ message: "Username is already used" });
    //   logger.warn(`Username is already used: ${username}`);
    //   return;
    // }
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_SALT_ROUNDS)
    );
    const username = await getRandomUsername();
    await User.create({
      username: username,
      name: name,
      email: normalizedEmail,
      hashedPassword: hashedPassword as string,
    });
    res.status(201).json({ message: "User created" });
    logger.info(`User created email: ${email} username: ${username}`);
    return;
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    logger.error(
      `Signup error for email: ${req.body.email}, Error: ${err.message}`
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginByGoogle = async (req: Request, res: Response) => {
  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID as string);
    const { id_token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID as string,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      res.status(400).json({ message: "Google payload missing email" });
      return;
    }

    const normalizedEmail = payload.email.toLowerCase().trim();
    // Check if user exists
    let user = await User.findOne({ email: normalizedEmail });

    // Create user if doesn't exist
    if (!user) {
      const username = await getRandomUsername();
      user = await User.create({
        username: username, // generate randomly
        name: payload.name,
        email: normalizedEmail,
        // picture: payload.picture,
        authType: "google",
        lastLogin: new Date(),
      });
    } else {
      await User.findByIdAndUpdate(
        { _id: user._id },
        {
          $set: {
            lastLogin: new Date(),
          },
        }
      );
    }

    // Generate your own JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    // Send token in cookie
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: true, // make sure you're using HTTPS in prod
    //   sameSite: "none",
    //   maxAge: 60 * 60 * 1000, // 1 hour
    // });

    res.status(200).json({
      message: "Google Logged in successfully",
      user: { _id: user._id, username: user.username, token: token },
    });
    return;
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    logger.error(`Logout error, Error: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true, // set to true in production with https
      sameSite: "none",
    });
    res.status(200).json({ message: "Logged out successfully" });
    return;
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    logger.error(`Logout error, Error: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};
