import { jest } from "@jest/globals";

jest.unstable_mockModule("../repositories/entriesRepository.js", () => ({
  isValidId: jest.fn(() => true),
  getAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn((data) => ({ _id: "fake-id", favorite: false, ...data })),
  updateById: jest.fn(),
  removeById: jest.fn(),
  toggleFavoriteById: jest.fn(),
}));

const { createEntry, updateEntry, deleteEntry, listEntries } =
  await import("../services/entriesService.js");

test("createEntry rejects a missing title", async () => {
  const result = await createEntry({ title: "", body: "something" });
  expect(result.ok).toBe(false);
});

test("createEntry saves a valid entry and returns its DTO", async () => {
  const result = await createEntry({ title: "Groceries", body: "Milk, eggs" });
  expect(result.ok).toBe(true);
  expect(result.value).toEqual({
    _id: "fake-id",
    title: "Groceries",
    body: "Milk, eggs",
    favorite: false,
  });
});

test("updateEntry returns an error when the entry is not found", async () => {
  const repository = await import("../repositories/entriesRepository.js");
  repository.findById.mockResolvedValue(null);
  const result = await updateEntry("fake-id", {
    title: "Updated title",
    body: "Updated body",
  });
  expect(result.ok).toBe(false);
  expect(result.error).toBe("Entry not found.");
});

test("deleteEntry returns an error when the entry is not found", async () => {
  const repository = await import("../repositories/entriesRepository.js");
  repository.findById.mockResolvedValue(null);
  const result = await deleteEntry("fake-id");
  expect(result.ok).toBe(false);
  expect(result.error).toBe("Entry not found.");
});

test("listEntries returns entries sorted by title", async () => {
  const repository = await import("../repositories/entriesRepository.js");
  repository.getAll.mockResolvedValue([
    {
      _id: "2",
      title: "Zebra",
      body: "Second",
      favorite: false,
    },
    {
      _id: "1",
      title: "Apple",
      body: "First",
      favorite: false,
    },
  ]);
  const result = await listEntries();
  expect(result).toEqual([
    {
      _id: "1",
      title: "Apple",
      body: "First",
      favorite: false,
    },
    {
      _id: "2",
      title: "Zebra",
      body: "Second",
      favorite: false,
    },
  ]);
});
