import express from "express";
import pagesRouter from "./routes/pages.js";
import apiRouter from "./routes/api.js";
import entriesRouter from "./routes/entries.js";
import morgan from "morgan";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.set("views", "views");

app.use("/", pagesRouter);
app.use("/api", apiRouter);
app.use("/entries", entriesRouter);

app.use((req, res, next) => {
  res.status(404).send("Page not found.");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong.");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
