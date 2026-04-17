const config = JSON.parse(document.getElementById("nav-config").textContent);
const PINNED_URLS = config.pinnedUrls;
const manualItems = config.manualItems;

let items = [];
let filtered = [];
let cursor = 0;

const query = document.getElementById("query");
const list = document.getElementById("results");
const noResults = document.getElementById("no-results");

fetch("/indices.json")
  .then((res) => res.json())
  .then((data) => {
    const fileItems = data.map((entry) => ({
      title: entry.title.toLowerCase(),
      description: entry["export-description"] || entry["note-type"] || "",
      url: entry.url,
      pinned: PINNED_URLS.includes(entry.url),
    }));
    items = [...manualItems, ...fileItems];
    items.sort((a, b) => {
      if (a.pinned !== b.pinned) return b.pinned - a.pinned;
      return a.title.localeCompare(b.title);
    });

    filter("");
  })
  .catch((err) => console.error("Nav load failed:", err));

function highlight(str, q) {
  if (!q) return str;
  const i = str.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return str;
  return (
    str.slice(0, i) +
    `<span class="match">${str.slice(i, i + q.length)}</span>` +
    str.slice(i + q.length)
  );
}

function render() {
  list.innerHTML = "";
  if (!noResults) return;

  noResults.style.display = filtered.length ? "none" : "block";
  const q = query.value.trim();

  filtered.forEach((p, i) => {
    const li = document.createElement("li");
    if (i === cursor) li.classList.add("active");

    const subtext = p.description
      ? `<span class="desc">${p.description}</span>`
      : "";
    li.innerHTML = `<span class="cmd">${highlight(p.title, q)}</span>${subtext}`;

    li.onclick = () => go(p.url);
    li.onmouseenter = () => {
      cursor = i;
      render();
    };
    list.appendChild(li);
  });
}

function filter(q) {
  const t = (q || "").trim().toLowerCase();
  filtered = items.filter(
    (p) =>
      p.title.toLowerCase().includes(t) ||
      p.description.toLowerCase().includes(t),
  );
  cursor = 0;
  render();
}

function go(url) {
  window.location.href = url;
}

query.addEventListener("input", (e) => filter(e.target.value));

query.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    cursor = Math.min(cursor + 1, filtered.length - 1);
    render();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    cursor = Math.max(cursor - 1, 0);
    render();
  } else if (e.key === "Enter") {
    if (filtered[cursor]) go(filtered[cursor].url);
  } else if (e.key === "Escape") {
    query.value = "";
    filter("");
  }
});

// Initial Focus
query.focus();
