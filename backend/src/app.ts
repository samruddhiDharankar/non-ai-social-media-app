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

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: "http://localhost:5173", credentials: true })); // your frontend port

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/content-analyses", contentAnalysisRoutes);
app.use("/api/comments", commentRoutes);

app.use("/admin/queues", serverAdapter.getRouter());

export default app;
