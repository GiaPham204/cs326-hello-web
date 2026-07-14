import { Router } from "express";
import { readFile, writeFile } from "fs/promises";
const router = Router();

router.get("/", (req, res) => {
  res.status(200).send("Hello, Web!");
});

router.get("/hello", (req, res) => {
  res.status(200).send("I am learning Express in CS326.");
});

router.get("/hello/:name", (req, res) => {
  res.status(200).send(`Hello, ${req.params.name}!`);
});

router.get("/repeat/:word", (req, res) => {
  res
    .status(200)
    .send(`${req.params.word} ${req.params.word} ${req.params.word}`);
});

router.get("/count", (req, res) => {
  const from = Number(req.query.from) || 1;
  const to = Number(req.query.to) || 10;
  res.status(200).send(`Counting from ${from} to ${to}.`);
});

router.get("/entries", async (req, res) => {
  const data = await readFile("entries.json", "utf-8");
  const entries = JSON.parse(data);

  res.set("Cache-Control", "public, max-age=60");
  res.set("X-Total-Count", entries.length);
  res.status(200).render("entries", {
    title: "Entries",
    entries,
  });
});

router.post("/entries", async (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    res.status(400).json({
      error: "title and body are required.",
    });
    return;
  }

  const data = await readFile("entries.json", "utf-8");
  const entries = JSON.parse(data);

  const newEntry = {
    title,
    body,
  };

  entries.push(newEntry);
  await writeFile("entries.json", JSON.stringify(entries, null, 2));

  res.status(201).json(newEntry);
});

router.delete("/entries/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const data = await readFile("entries.json", "utf-8");
  const entries = JSON.parse(data);

  if (id < 0 || id >= entries.length) {
    res.status(404).json({
      error: "Entry not found.",
    });
    return;
  }
  entries.splice(id, 1);
  await writeFile("entries.json", JSON.stringify(entries, null, 2));
  res.status(204).send();
});

router.get("/about", (req, res) => {
  res.status(200).render("about", {
    title: "About",
  });
});

router.get("/three-posts", async (req, res) => {
  const ids = [1, 2, 3];
  const titles = [];

  for (const id of ids) {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
    );

    const post = await response.json();
    titles.push(post.title);
  }
  res.status(200).json({ titles });
});

export default router;
