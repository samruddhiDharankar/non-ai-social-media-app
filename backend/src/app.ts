import dotenv from "dotenv";
import express from "express";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import { serverAdapter } from "./queues/bullBoard";
import contentAnalysisRoutes from "./routes/contentAnalysisRoutes";

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/content-analyses", contentAnalysisRoutes);

app.use("/admin/queues", serverAdapter.getRouter());

export default app;
