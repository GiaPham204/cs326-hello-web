import express from "express";
import pagesRouter from "./routes/pages.js";
import apiRouter from "./routes/api.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/", pagesRouter);
app.use("/api", apiRouter);

app.use((req, res, next) => {
  res.status(404).send("Page not found.");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
