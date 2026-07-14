import { Router } from "express";
const router = Router();

const entries = [
  {
    title: "First note",
    body: "Notes from the first session.",
  },
  {
    title: "Second note",
    body: "Notes from the second session.",
  },
  {
    title: "Third note",
    body: "Notes from the third session.",
  },
];

router.get("/", (req, res) => {
  res.send("Hello, Web!");
});

router.get("/hello", (req, res) => {
  res.send("I am learning Express in CS326.");
});

router.get("/hello/:name", (req, res) => {
  res.send(`Hello, ${req.params.name}!`);
});

router.get("/repeat/:word", (req, res) => {
  res.send(`${req.params.word} ${req.params.word} ${req.params.word}`);
});

router.get("/count", (req, res) => {
  const from = Number(req.query.from) || 1;
  const to = Number(req.query.to) || 10;
  res.send(`Counting from ${from} to ${to}.`);
});

router.get("/entries", (req, res) => {
  res.render("entries", {
    title: "My Entries",
    entries,
  });
});

router.post("/entries", (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    res.status(400).json({
      error: "title and body are required.",
    });
    return;
  }

  const newEntry = {
    title,
    body,
  };

  entries.push(newEntry);
  res.status(201).json(newEntry);
});

router.delete("/entries/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (id < 0 || id >= entries.length) {
    res.status(404).json({
      error: "Entry not found.",
    });
    return;
  }
  entries.splice(id, 1);
  res.status(204).send();
});

router.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
  });
});

export default router;
