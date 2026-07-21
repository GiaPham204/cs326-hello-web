import { Router } from "express";
import { readFile, writeFile } from "node:fs/promises";
import { Ok, Err, Some, None } from "../result.js";

const router = Router();

const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

const validateEntry = ({ title, body }) => {
  if (!title || !body) {
    return Err("title and body are required.");
  }
  return Ok({ title, body });
};

const findEntryById = (entries, id) => {
  const entry = entries[id];
  return entry ? Some(entry) : None;
};

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const data = await readFile("entries.json", "utf-8");
    const entries = JSON.parse(data);

    res.set("Cache-Control", "public, max-age=60");
    res.set("X-Total-Count", entries.length);
    res.status(200).render("entries", {
      title: "Entries",
      entries,
    });
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const result = validateEntry(req.body);
    if (!result.ok) {
      res.status(400).json({
        error: result.error,
      });
      return;
    }

    const data = await readFile("entries.json", "utf-8");
    const entries = JSON.parse(data);

    const newEntry = result.value;
    entries.push(newEntry);
    await writeFile("entries.json", JSON.stringify(entries, null, 2));

    res.status(201).json(newEntry);
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    const data = await readFile("entries.json", "utf-8");
    const entries = JSON.parse(data);

    const found = findEntryById(entries, id);

    if (!found.some) {
      res.status(404).json({
        error: "Entry not found.",
      });
      return;
    }

    entries.splice(id, 1);
    await writeFile("entries.json", JSON.stringify(entries, null, 2));
    res.status(204).send();
  }),
);

export default router;
