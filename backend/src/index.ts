import express from "express";
import { router as apiRouter } from "./routes/index.router";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  })
);

app.use(
  express.json({
    limit: "4mb",
  })
);

app.get("/", (req, res) => {
  res.send("Salut le monde!");
});

app.use("/api/v1", apiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
