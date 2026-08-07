const form = document.querySelector("#entry-form");
const list = document.querySelector("#entries");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const entry = Object.fromEntries(data);

  const response = await fetch("/entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });

  if (!response.ok) {
    const { error } = await response.json();
    alert(error);
    return;
  }

  const saved = await response.json();

  const item = document.createElement("li");
  item.dataset.id = saved._id;
  item.dataset.title = saved.title;
  item.dataset.body = saved.body;
  item.dataset.favorite = saved.favorite;
  item.innerHTML = `<span class="entry-display"><strong>${saved.title}:</strong> ${saved.body}</span>
  <button class="favorite-btn" type="button">${saved.favorite ? "★" : "☆"}
  </button>

  <button class="edit-btn" type="button">Edit</button>
  <button
  class="delete-btn hover:bg-red-100 hover:text-red-800"
  type="button"
  hx-delete="/entries/${saved._id}"
  hx-target="closest li"
  hx-swap="outerHTML"
  hx-confirm="Delete this entry?"
  hx-indicator="#delete-indicator-${saved._id}"
  >Delete</button>

  <span
    id="delete-indicator-${saved._id}"
    class="delete-indicator htmx-indicator"
  >
    Deleting...
  </span>
  `;
  list.append(item);
  htmx.process(item);
  form.reset();
});

const startEdit = (item) => {
  const display = item.querySelector(".entry-display");
  const buttons = item.querySelectorAll(
    ".favorite-btn, .edit-btn, .delete-btn",
  );

  const editForm = document.createElement("form");
  editForm.className = "flex flex-1 flex-col gap-2 sm:flex-row";
  editForm.innerHTML = `
    <input
    class="form-input"
    type="text"
    name="title"
    value="${item.dataset.title}"
    required
    >

    <input
    class="form-input"
    type="text"
    name="body"
    value="${item.dataset.body}"
    required
    >
    <button
    class="bg-teal-700 text-white rounded px-3 py-2 hover:bg-teal-800"
    type="submit"
    >
    Save
    </button>
    <button
    class="cancel-btn bg-gray-500 text-white rounded px-3 py-2 hover:bg-gray-600"
    type="button"
    >
    Cancel
    </button>
  `;

  display.replaceWith(editForm);
  buttons.forEach((button) => {
    button.hidden = true;
  });

  editForm.querySelector('input[name="title"]').focus();

  editForm.querySelector(".cancel-btn").addEventListener("click", () => {
    editForm.replaceWith(display);
    buttons.forEach((button) => {
      button.hidden = false;
    });
  });

  editForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(editForm);
    const entry = Object.fromEntries(data);

    const response = await fetch(`/entries/${item.dataset.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });

    if (!response.ok) {
      if (response.status === 404) {
        item.remove();
        return;
      }
      const { error } = await response.json();
      alert(error);
      return;
    }

    const saved = await response.json();
    item.dataset.title = saved.title;
    item.dataset.body = saved.body;
    display.innerHTML = `<strong>${saved.title}:</strong> ${saved.body}`;
    editForm.replaceWith(display);
    buttons.forEach((button) => {
      button.hidden = false;
    });
  });
};

list.addEventListener("click", async (event) => {
  if (event.target.matches(".favorite-btn")) {
    const button = event.target;
    const item = button.closest("li");
    const id = item.dataset.id;
    button.disabled = true;
    try {
      const response = await fetch(`/entries/${id}/favorite`, {
        method: "PATCH",
      });
      if (!response.ok) {
        if (response.status === 404) {
          item.remove();
          return;
        }
        const { error } = await response.json();
        alert(error);
        button.disabled = false;
        return;
      }
      const saved = await response.json();
      item.dataset.favorite = saved.favorite;
      button.textContent = saved.favorite ? "★" : "☆";
      button.disabled = false;
    } catch {
      button.disabled = false;
    }
    return;
  }

  if (event.target.matches(".edit-btn")) {
    startEdit(event.target.closest("li"));
  }
});
