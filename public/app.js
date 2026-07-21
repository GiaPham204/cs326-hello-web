const form = document.querySelector("#entry-form");
const entriesList = document.querySelector("ul");

entriesList.addEventListener("click", async (event) => {
  if (event.target.matches("button")) {
    const li = event.target.closest("li");
    const index = li.dataset.index;

    const response = await fetch(`/entries/${index}`, {
      method: "Delete",
    });

    if (response.ok) {
      li.remove();
      const remainingEntries = entriesList.querySelectorAll("li");
      remainingEntries.forEach((entry, index) => {
        entry.dataset.index = index;
      });
    }
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  const response = await fetch("/entries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const newEntry = await response.json();
  const li = document.createElement("li");
  const strong = document.createElement("strong");
  const p = document.createElement("p");
  const button = document.createElement("button");

  strong.textContent = newEntry.title;
  p.textContent = newEntry.body;
  button.textContent = "DELETE";

  li.appendChild(strong);
  li.appendChild(p);
  li.appendChild(button);
  li.dataset.index = entriesList.children.length;

  entriesList.appendChild(li);

  form.reset();
});
