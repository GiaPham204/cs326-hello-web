import { Router } from "express";
const router = Router();
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
  const entries = [
    { title: "First Entry" },
    { title: "Second Entry" },
    { title: "Third Entry" },
  ];

  res.render("entries", {
    title: "My Entries",
    entries,
  });
});

router.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
  });
});

export default router;
