window.addEventListener("DOMContentLoaded", () => {
  const metaContainer = document.querySelector("#dynamic-meta");
  const rawData = document.querySelector("#raw-metadata");
  if (!metaContainer || !rawData) return;

  try {
    const meta = JSON.parse(rawData.textContent);
    const blacklist = ["title", "export", "tags"];

    Object.keys(meta).forEach((key) => {
      const val = meta[key];

      if (!val) return;
      if (Array.isArray(val) && val.length === 0) return;
      if (typeof val === "string" && val.trim() === "") return;
      if (blacklist.includes(key)) return;

      const row = document.createElement("div");
      row.className = "meta-item";

      const label = key
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      row.innerHTML = `<b>${label}:</b> ${Array.isArray(val) ? val.join(", ") : val}`;
      metaContainer.appendChild(row);
    });
  } catch (e) {
    console.error("Metadata injection failed", e);
  }
});
