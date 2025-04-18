import app from "./app";
import { connectDB } from "./config/db";

const port = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
    console.log(
      `Bull Board available at http://localhost:${port}/admin/queues`
    );
  });
});
