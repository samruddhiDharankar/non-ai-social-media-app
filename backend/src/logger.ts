import winston from "winston";

// Define a custom log format with timestamp and message
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    if (level === "error") {
      const stack = new Error().stack?.split("\n")[3];
      const caller = stack ? stack.trim() : "unknown file";
      return `${timestamp} ${level} ${message} (called from ${caller})`;
    }
    return `${timestamp} ${level} ${message}`;
  })
);

// Create a logger instance
const logger = winston.createLogger({
  format: logFormat,
  transports: [
    new winston.transports.Console({
      level: "info", // Logs at 'info' level and above
      format: winston.format.combine(
        winston.format.colorize(), // Adds color to log output
        logFormat // Reuse the custom log format for colorized output
      ),
    }),
  ],
});

export default logger;
