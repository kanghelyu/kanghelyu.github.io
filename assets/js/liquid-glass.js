/*
 * Local adaptation inspired by shuding/liquid-glass.
 * The material is a static SVG displacement/light filter with fixed maps.
 * JavaScript only adds the shared material hook; text remains native DOM.
 */
(function () {
  "use strict";
  const canFilter = typeof SVGElement !== "undefined" && typeof CSS !== "undefined" && CSS.supports && CSS.supports("backdrop-filter", "blur(1px)");
  const root = document.documentElement;
  root.classList.add(canFilter ? "liquid-glass-supported" : "liquid-glass-fallback");
  document.querySelectorAll(".media-dock, .button, .glass-panel, .note, .project, .instructions, .preview-box, .file-links, .bookmarklet, .file-links a, .lang-toggle button, input, textarea, select").forEach((element) => {
    element.classList.add("liquid-glass");
  });
})();
