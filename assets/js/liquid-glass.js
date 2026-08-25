/*
 * Local adaptation inspired by lucasromerodb/liquid-glass-effect-macos.
 * The material lives in a static SVG filter and fixed normal/highlight maps.
 * JavaScript only adds hooks and keeps the pointer shine inside each surface.
 */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canFilter = typeof SVGElement !== "undefined" && typeof CSS !== "undefined" && CSS.supports && CSS.supports("backdrop-filter", "blur(1px)");
  const root = document.documentElement;
  root.classList.add(canFilter ? "liquid-glass-supported" : "liquid-glass-fallback");
  if (reduceMotion) root.classList.add("liquid-glass-reduced");

  const targets = Array.from(document.querySelectorAll(
    ".media-dock, .button, .glass-panel, .instructions, .preview-box, .file-links, .bookmarklet, .file-links a, .lang-toggle button, input, textarea, select"
  ));
  if (!targets.length || reduceMotion || !canFilter) return;

  let pointerX = -9999;
  let pointerY = -9999;
  let frame = 0;
  let visible = !document.hidden;

  const updatePointer = () => {
    frame = 0;
    if (!visible) return;
    targets.forEach((element) => {
      if (element.classList.contains("media-dock")) return;
      const rect = element.getBoundingClientRect();
      element.style.setProperty("--glass-pointer-x", `${pointerX - rect.left}px`);
      element.style.setProperty("--glass-pointer-y", `${pointerY - rect.top}px`);
    });
  };

  targets.forEach((element) => element.classList.add("liquid-glass"));
  window.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!frame) frame = requestAnimationFrame(updatePointer);
  }, { passive: true });
  document.addEventListener("visibilitychange", () => {
    visible = !document.hidden;
    if (visible && !frame) frame = requestAnimationFrame(updatePointer);
  });
})();
