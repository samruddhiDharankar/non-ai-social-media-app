import app from "./app";
import { connectDB } from "./config/db";
import { startWorker } from "./queues/aiWorker";

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected");

    // start worker
    startWorker();
    console.log("AI worker started");

    // Start the Express server
    app.listen(port, () => {
      console.log(`Server running on port http://localhost:${port}`);
      console.log(
        `Bull Board available at http://localhost:${port}/admin/queues`
      );
    });
  } catch (err) {
    console.error("Error starting the server:", err);
  }
};

startServer();

// connectDB().then(() => {
//   app.listen(port, () => {
//     console.log(`Server running on port http://localhost:${port}`);
//     console.log(
//       `Bull Board available at http://localhost:${port}/admin/queues`
//     );
//   });
// });
