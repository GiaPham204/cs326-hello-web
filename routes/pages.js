import { Router } from "express";
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
