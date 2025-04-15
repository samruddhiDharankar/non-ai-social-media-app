import express from "express";
import dotenv from "dotenv";

// load the .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
