import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import { serverAdapter } from "./queues/bullBoard";
import contentAnalysisRoutes from "./routes/contentAnalysisRoutes";
import commentRoutes from "./routes/commentRoutes";
import followRoutes from "./routes/followRoutes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1); // very important for Render + Cloudflare

// Set Content Security Policy (CSP) header globally
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; object-src 'none';"
  );
  next(); // Proceed to the next middleware or route handler
});

app.use(
  cors({
    origin: [process.env.FRONTEND_URL as string],
    // credentials: true,
  })
); // your frontend port

// Custom CORS headers middleware
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
//   next();
// });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/content-analyses", contentAnalysisRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api", followRoutes);

app.use("/admin/queues", serverAdapter.getRouter());

export default app;
