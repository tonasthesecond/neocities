async function buildGallery() {
  const listContainer = document.getElementById("gallery-list");
  const titleNode = document.getElementById("gallery-title");
  const countNode = document.getElementById("gallery-count");

  const params = new URLSearchParams(window.location.search);
  const filterKey = params.keys().next().value;
  const filterVal = params.get(filterKey);

  try {
    const response = await fetch("/indices.json");
    let data = await response.json();

    // 1. Filter
    let matches = data.filter((item) => {
      if (!filterKey) return true;
      const itemVal = item[filterKey];
      return String(itemVal).toLowerCase() === String(filterVal).toLowerCase();
    });

    // 2. Sort by Updated (Newest first)
    matches.sort((a, b) => {
      const dateA = a.updated
        ? new Date(a.updated.replace(",", ""))
        : new Date(0);
      const dateB = b.updated
        ? new Date(b.updated.replace(",", ""))
        : new Date(0);
      return dateB - dateA;
    });

    titleNode.innerText = filterVal ? `${filterVal}` : "Hub";
    countNode.innerText = `${matches.length} pages`;
    listContainer.innerHTML = "";

    if (matches.length === 0) {
      listContainer.innerHTML = `<p style="color:var(--muted)">Nothing found for "${filterVal}".</p>`;
      return;
    }

    // 3. Render
    // In gallery.js, replace the entry creation block:
    matches.forEach((item) => {
      const entry = document.createElement("div"); // Changed from "a"
      entry.className = "hub-item";

      const dateDisplay = item.updated ? item.updated.split(",")[0] : "---";
      const descDisplay =
        item["export-description"] || item["note-type"] || "No description";

      entry.innerHTML = `
        <a class="hub-title" href="${item.url}">${item.title}</a>
        <div class="hub-meta">
          <span class="hub-desc">${descDisplay}</span>
          <span class="hub-date">${dateDisplay}</span>
        </div>
      `;
      listContainer.appendChild(entry);
    });
  } catch (e) {
    console.error("Hub failed:", e);
  }
}

buildGallery();
