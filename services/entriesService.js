import { Ok, Err } from "../result.js";
import {
  getAll,
  findById,
  create,
  updateById,
  removeById,
  toggleFavoriteById,
} from "../repositories/entriesRepository.js";
import { toEntryDto } from "../dtos/entryDto.js";

const validateEntry = ({ title, body }) => {
  const trimmedTitle = title.trim();
  const trimmedBody = body.trim();
  if (!trimmedTitle || !trimmedBody) {
    return Err("title and body are required.");
  }
  return Ok({
    title: trimmedTitle,
    body: trimmedBody,
  });
};

export const listEntries = async () => {
  const entries = await getAll();
  return entries.map(toEntryDto).sort((a, b) => a.title.localeCompare(b.title));
};

export const createEntry = async (data) => {
  const result = validateEntry(data);
  if (!result.ok) {
    return result;
  }
  const newEntry = await create(result.value);
  return Ok(toEntryDto(newEntry));
};

export const updateEntry = async (id, data) => {
  const entry = await findById(id);
  if (!entry) {
    return Err("Entry not found.");
  }
  const result = validateEntry(data);
  if (!result.ok) {
    return result;
  }
  const updatedEntry = await updateById(id, result.value);
  return Ok(toEntryDto(updatedEntry));
};

export const deleteEntry = async (id) => {
  const entry = await findById(id);
  if (!entry) {
    return Err("Entry not found.");
  }
  await removeById(id);
  return Ok();
};

export const toggleFavorite = async (id) => {
  const entry = await findById(id);
  if (!entry) {
    return Err("Entry not found.");
  }
  const updatedEntry = await toggleFavoriteById(id);
  return Ok(toEntryDto(updatedEntry));
};
