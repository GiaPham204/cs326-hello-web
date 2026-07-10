import { Router } from "express";
const router = Router();

router.get("/info", (req, res) => {
  res.json({
    course: "CS326",
    topic: "Routes and Responses",
  });
});

router.get("/error", (req, res) => {
  res.status(400).send("Bad request.");
});

router.get("/status", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
  });
});

export default router;
