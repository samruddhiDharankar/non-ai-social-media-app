import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import userRoutes from "./routes/userRoutes";
import jwt from "jsonwebtoken";
import { login } from "./controllers/authController";

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.post("/login", login);
app.use("/api/users", userRoutes);

// jwt poc
// dummy login to generate token
// app.post("/login", (req, res) => {
//   const userId = "12345";
//   const token = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
//     expiresIn: "1d",
//   });
//   res.json({ token });
// });

// middleware to protect route
// const protect = (req: Request, res: Response, next: NextFunction): void => {
//   const authHeader = req.headers.authorization;
//   console.log(authHeader);
//   if (!authHeader?.startsWith("Bearer ")) {
//     res.status(401).json({ message: "Unauthorized" });
//     return;
//   }

//   const token = authHeader.split(" ")[1];
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
//       id: string;
//     };
//     console.log(decoded);
//     (req as any).user = decoded;
//     next();
//   } catch {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

// protected route
// app.get("/protected", protect, (req: Request, res: Response) => {
//   res.json({ message: `welcome user ${(req as any).user.id}!` });
// });

export default app;
