window.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".page-wrap");
  if (!container) return;

  const a = document.createElement("a");
  a.href = "../index.html";
  a.className = "back";
  a.textContent = "← back";
  container.prepend(a);
});
