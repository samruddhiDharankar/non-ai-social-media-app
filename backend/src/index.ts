import app from "./app";
import { connectDB } from "./config/db";
import logger from "./logger";
import { startWorker } from "./queues/aiWorker";

const port = process.env.PORT || 5000;
const baseUrl = process.env.BASE_URL || "http://localhost";

const startServer = async () => {
  try {
    await connectDB();
    logger.info("MongoDB connected");

    // start worker
    startWorker();
    logger.info("AI worker started");

    // Start the Express server
    app.listen(port, () => {
      logger.info(`Server running on port ${baseUrl}:${port}`);
      logger.info(`Bull Board available at ${baseUrl}:${port}/admin/queues`);
    });
  } catch (err) {
    logger.error(`Error starting the server: ${err}`);
  }
};

startServer();
