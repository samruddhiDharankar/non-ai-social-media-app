import mongoose from "mongoose";
import app from "./app";
// import { connectDB } from "./config/db";

const port = process.env.PORT || 5000;

mongoose.set("debug", true); // Enable mongoose debug logging

mongoose
  .connect(process.env.MONGO_URI as string, {
    serverSelectionTimeoutMS: 5000, // Increased timeout for server selection
    socketTimeoutMS: 60000, // Increased socket timeout
  })
  .then(async () => {
    app.listen(port, () => {
      console.log(`Server running on port http://localhost:${port}`);
      console.log(
        `Bull Board available at http://localhost:${port}/admin/queues`
      );
    });
  });
