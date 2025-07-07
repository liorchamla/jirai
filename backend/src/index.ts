import express from "express";
import { router as apiRouter } from "./routers/index.router";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Salut le monde!");
});

app.use("/api/v1", apiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
