export const toEntryDto = (entry) => ({
  _id: entry._id,
  title: entry.title,
  body: entry.body,
  favorite: entry.favorite,
});
