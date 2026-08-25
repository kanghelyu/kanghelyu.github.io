/*
 * Local adaptation inspired by shuding/liquid-glass.
 * Source: https://github.com/shuding/liquid-glass (MIT License)
 *
 * This site keeps the effect as a decorative DOM layer: SVG displacement,
 * backdrop blur and edge highlights never replace native text or controls.
 */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canFilter = typeof SVGElement !== "undefined" && typeof CSS !== "undefined" && CSS.supports && CSS.supports("backdrop-filter", "blur(1px)");
  const root = document.documentElement;
  root.classList.add(canFilter ? "liquid-glass-supported" : "liquid-glass-fallback");
  if (reduceMotion) root.classList.add("liquid-glass-reduced");

  const targets = document.querySelectorAll(".media-dock, .button, .glass-panel, .instructions, .preview-box, .file-links, .bookmarklet, .file-links a, .lang-toggle button, input, textarea, select");
  if (!targets.length) return;

  let svg = document.getElementById("liquid-glass-defs");
  let filterId = "liquid-glass-filter";
  if (!svg) {
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = "liquid-glass-defs";
    svg.setAttribute("aria-hidden", "true");
    svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    filter.id = filterId;
    filter.setAttribute("x", "-8%");
    filter.setAttribute("y", "-8%");
    filter.setAttribute("width", "116%");
    filter.setAttribute("height", "116%");
    filter.setAttribute("color-interpolation-filters", "sRGB");
    const turbulence = document.createElementNS("http://www.w3.org/2000/svg", "feTurbulence");
    turbulence.setAttribute("type", "fractalNoise");
    turbulence.setAttribute("baseFrequency", "0.012 0.018");
    turbulence.setAttribute("numOctaves", "2");
    turbulence.setAttribute("seed", "17");
    turbulence.setAttribute("result", "noise");
    const displacement = document.createElementNS("http://www.w3.org/2000/svg", "feDisplacementMap");
    displacement.setAttribute("in", "SourceGraphic");
    displacement.setAttribute("in2", "noise");
    displacement.setAttribute("scale", reduceMotion ? "0" : "3.5");
    displacement.setAttribute("xChannelSelector", "R");
    displacement.setAttribute("yChannelSelector", "G");
    filter.append(turbulence, displacement);
    defs.appendChild(filter);
    svg.appendChild(defs);
    document.body.appendChild(svg);
  }

  targets.forEach((element) => {
    element.classList.add("liquid-glass");
    if (canFilter && !reduceMotion) element.style.setProperty("--liquid-filter", `url(#${filterId})`);
  });

  if (reduceMotion || !canFilter) return;

  let pointerX = 0;
  let pointerY = 0;
  let frame = 0;
  let visible = !document.hidden;
  const update = () => {
    frame = 0;
    if (!visible) return;
    root.style.setProperty("--glass-pointer-x", `${pointerX}px`);
    root.style.setProperty("--glass-pointer-y", `${pointerY}px`);
  };
  window.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!frame) frame = requestAnimationFrame(update);
  }, { passive: true });
  document.addEventListener("visibilitychange", () => {
    visible = !document.hidden;
    if (visible && !frame) frame = requestAnimationFrame(update);
  });
})();
