import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api", router);

app.get("/health", (req, res) => {
  res.send("OK");
});

// Export the app for Vercel
export default app;

// Only start the server if not running in Vercel serverless environment
if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
