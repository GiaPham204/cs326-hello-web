import {
  listEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  toggleFavorite,
} from "../services/entriesService.js";
import { isValidId } from "../repositories/entriesRepository.js";

export const getEntries = async (req, res) => {
  const entries = await listEntries();
  res.set("Cache-Control", "public, max-age=60");
  res.set("X-Total-Count", entries.length);
  res.status(200).render("entries", {
    title: "Entries",
    entries,
  });
};

export const postEntry = async (req, res) => {
  const result = await createEntry(req.body);
  if (!result.ok) {
    res.status(400).json({
      error: result.error,
    });
    return;
  }
  res.status(201).json(result.value);
};

export const putEntry = async (req, res) => {
  const id = req.params.id;
  if (!isValidId(id)) {
    res.status(400).json({
      error: "Invalid entry ID.",
    });
    return;
  }

  const result = await updateEntry(id, req.body);
  if (!result.ok) {
    const status = result.error === "Entry not found." ? 404 : 400;
    res.status(status).json({
      error: result.error,
    });
    return;
  }
  res.status(200).json(result.value);
};

export const removeEntry = async (req, res) => {
  const id = req.params.id;
  if (!isValidId(id)) {
    res.status(400).json({
      error: "Invalid entry ID.",
    });
    return;
  }

  const result = await deleteEntry(id);
  if (!result.ok) {
    res.status(404).json({
      error: result.error,
    });
    return;
  }
  res.status(204).send();
};

export const toggleFavoriteController = async (req, res) => {
  const id = req.params.id;
  if (!isValidId(id)) {
    res.status(400).json({
      error: "Invalid entry ID.",
    });
    return;
  }
  const result = await toggleFavorite(id);
  if (!result.ok) {
    res.status(404).json({
      error: result.error,
    });
    return;
  }
  res.json(result.value);
};
