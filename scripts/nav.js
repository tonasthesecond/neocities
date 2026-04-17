const PINNED = [
  {
    cmd: "about me",
    desc: "labels i place upon myself",
    url: "../pages/about.html",
  },
  { cmd: "projects", desc: "things i've worked on", url: "../pages/work.html" },
  {
    cmd: "thoughts",
    desc: "the musings of my mind",
    url: "../pages/writing.html",
  },
  { cmd: "contact", desc: "ways to reach me", url: "../pages/contact.html" },
  { cmd: "now", desc: "the nearest present", url: "../pages/now.html" },
];

let EXTRAS = [];
let filtered = [...PINNED];
let cursor = 0;

const query = document.getElementById("query");
const list = document.getElementById("results");
const noResults = document.getElementById("no-results");

fetch("/indices.json")
  .then((res) => res.json())
  .then((data) => {
    EXTRAS = data.filter((e) => !PINNED.some((p) => p.url === e.url));
  })
  .catch(() => {});

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
  noResults.style.display = filtered.length ? "none" : "block";
  const q = query.value.trim();

  filtered.forEach((p, i) => {
    const li = document.createElement("li");
    if (i === cursor) li.classList.add("active");

    const descSpan = p.desc ? `<span class="desc">${p.desc}</span>` : "";
    li.innerHTML = `<span class="cmd">${highlight(p.cmd, q)}</span>${descSpan}`;

    li.onclick = () => go(p.url);
    li.onmouseenter = () => {
      cursor = i;
      render();
    };
    list.appendChild(li);
  });
}

function filter(q) {
  const t = q.trim().toLowerCase();
  if (!t) {
    filtered = [...PINNED];
  } else {
    const pm = PINNED.filter((p) => p.cmd.includes(t) || p.desc.includes(t));
    const em = EXTRAS.filter((p) => p.cmd.includes(t) || p.desc.includes(t));
    filtered = [...pm, ...em];
  }
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

render();
query.focus();
