function replaceMissingImage(image) {
  const placeholder = document.createElement("div");
  placeholder.className = "asset-missing";
  placeholder.textContent = `Placeholder asset: ${image.getAttribute("src")}`;
  image.replaceWith(placeholder);
}

document.querySelectorAll("img").forEach((image) => {
  image.addEventListener("error", () => replaceMissingImage(image), { once: true });
});

document.querySelectorAll("video").forEach((video) => {
  video.addEventListener(
    "error",
    () => {
      const placeholder = document.createElement("div");
      placeholder.className = "asset-missing";
      const source = video.querySelector("source");
      placeholder.textContent = `Placeholder video: ${source ? source.getAttribute("src") : "missing source"}`;
      video.replaceWith(placeholder);
    },
    { once: true }
  );
});
