/*
 * Liquid Glass material — web port of the technique behind
 * Kyant0/AndroidLiquidGlass: each element's rounded-rectangle SDF is sampled
 * at runtime into a normal/displacement map (offsets packed around neutral
 * 128 in R/G), and an inline SVG filter refracts the element's real backdrop
 * through that map, with per-channel scales for chromatic aberration.
 *
 * Only Chromium resolves SVG filter references inside backdrop-filter, so the
 * displacement path is gated on Chromium; every other engine keeps the plain
 * frosted-glass fallback from base.css.
 */
(function () {
  "use strict";

  const canFilter = typeof CSS !== "undefined" && CSS.supports &&
    (CSS.supports("backdrop-filter", "blur(1px)") || CSS.supports("-webkit-backdrop-filter", "blur(1px)"));
  const root = document.documentElement;
  root.classList.add(canFilter ? "liquid-glass-supported" : "liquid-glass-fallback");

  const TARGET_SELECTOR = ".media-dock, .button, .glass-panel, .note, .project, .instructions, .preview-box, .file-links, .bookmarklet, .file-links a, .lang-toggle button, input, textarea, select";
  // Elements already sitting inside a glass surface stay plain: the
  // container provides the material (no double refraction inside frames).
  const GLASS_CONTAINER_SELECTOR = ".media-dock, .glass-panel, .note, .project, .instructions, .preview-box, .file-links, .bookmarklet";
  document.querySelectorAll(TARGET_SELECTOR).forEach((element) => {
    if (element.parentElement && element.parentElement.closest(GLASS_CONTAINER_SELECTOR)) return;
    element.classList.add("liquid-glass");
  });

  const ua = navigator.userAgent;
  const chromium = /Chrome\/|Chromium\/|Edg\//.test(ua) && !/Firefox|FxiOS/i.test(ua);
  const lowPower = (navigator.hardwareConcurrency || 8) <= 4;
  if (!canFilter || !chromium || lowPower) return;

  try {
    const SVG_NS = "http://www.w3.org/2000/svg";
    // Strongest rim shift for the blue channel; R/G get larger scales so the
    // fringe spreads red→blue like real dispersive glass. One grade for every
    // surface — the same material the large cards use.
    const CHANNEL_SCALES = [66, 55, 46];
    const filters = new Map();
    let defs = null;

    function ensureDefs() {
      if (defs) return defs;
      const host = document.createElementNS(SVG_NS, "svg");
      host.setAttribute("width", "0");
      host.setAttribute("height", "0");
      host.setAttribute("aria-hidden", "true");
      host.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
      defs = document.createElementNS(SVG_NS, "defs");
      host.appendChild(defs);
      document.body.appendChild(host);
      return defs;
    }

    function roundedRectSDF(px, py, hw, hh, r) {
      const qx = Math.abs(px) - hw + r;
      const qy = Math.abs(py) - hh + r;
      const ax = Math.max(qx, 0);
      const ay = Math.max(qy, 0);
      return Math.hypot(ax, ay) + Math.min(Math.max(qx, qy), 0) - r;
    }

    function displacementMapDataURL(w, h, radius) {
      const down = Math.min(1, 320 / Math.max(w, h)); // keep maps small on large panels
      const mw = Math.max(12, Math.round(w * down));
      const mh = Math.max(12, Math.round(h * down));
      const hw = mw / 2 - 0.5;
      const hh = mh / 2 - 0.5;
      const rr = Math.max(2, Math.min(radius * down, hw, hh));
      // Refraction band in ELEMENT pixels (the map is downscaled on large
      // surfaces, so computing it in map px would smear the rim on cards).
      const bandEl = Math.min(26, Math.max(12, Math.min(w, h) * 0.16));
      const band = Math.max(4, bandEl * down);

      const field = new Float32Array(mw * mh);
      for (let y = 0; y < mh; y += 1) {
        for (let x = 0; x < mw; x += 1) {
          field[y * mw + x] = roundedRectSDF(x - hw, y - hh, hw, hh, rr);
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = mw;
      canvas.height = mh;
      const ctx2d = canvas.getContext("2d");
      const img = ctx2d.createImageData(mw, mh);
      const px = img.data;
      for (let y = 0; y < mh; y += 1) {
        for (let x = 0; x < mw; x += 1) {
          const idx = (y * mw + x) * 4;
          const d = field[y * mw + x];
          // Peaks exactly on the rim, fading smoothly inward and outward.
          const t = Math.exp(-Math.abs(d) / band);
          let nx = 0;
          let ny = 0;
          if (t > 0.004) {
            const gx = field[y * mw + Math.min(x + 1, mw - 1)] - field[y * mw + Math.max(x - 1, 0)];
            const gy = field[Math.min(y + 1, mh - 1) * mw + x] - field[Math.max(y - 1, 0) * mw + x];
            const len = Math.hypot(gx, gy);
            if (len > 1e-6) {
              nx = gx / len;
              ny = gy / len;
            }
          }
          px[idx] = 128 + Math.round(nx * t * 127);
          px[idx + 1] = 128 + Math.round(ny * t * 127);
          px[idx + 2] = 255;
          px[idx + 3] = 255;
        }
      }
      ctx2d.putImageData(img, 0, 0);
      return canvas.toDataURL();
    }

    function buildFilter(w, h, radius) {
      const key = w + "x" + h + "x" + radius;
      if (filters.has(key)) return filters.get(key);

      const mapURL = displacementMapDataURL(w, h, radius);
      const id = "liquid-glass-" + (filters.size + 1);
      const filter = document.createElementNS(SVG_NS, "filter");
      filter.setAttribute("id", id);
      // Region in element px, padded past the strongest displacement so rim
      // sampling reads real backdrop instead of clamping to transparency.
      const pad = Math.ceil(CHANNEL_SCALES[2] / 2) + 8;
      filter.setAttribute("x", String(-pad));
      filter.setAttribute("y", String(-pad));
      filter.setAttribute("width", String(w + pad * 2));
      filter.setAttribute("height", String(h + pad * 2));
      filter.setAttribute("color-interpolation-filters", "sRGB");

      const image = document.createElementNS(SVG_NS, "feImage");
      image.setAttribute("href", mapURL);
      image.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", mapURL);
      image.setAttribute("x", "0");
      image.setAttribute("y", "0");
      image.setAttribute("width", String(w));
      image.setAttribute("height", String(h));
      image.setAttribute("preserveAspectRatio", "none");
      image.setAttribute("result", "map");
      filter.appendChild(image);

      const CHANNEL_MATRIXES = [
        "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0",
        "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0",
        "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
      ];
      ["r", "g", "b"].forEach((name, i) => {
        const split = document.createElementNS(SVG_NS, "feColorMatrix");
        split.setAttribute("in", "SourceGraphic");
        split.setAttribute("type", "matrix");
        split.setAttribute("values", CHANNEL_MATRIXES[i]);
        split.setAttribute("result", "ch-" + name);
        filter.appendChild(split);
      });

      ["r", "g", "b"].forEach((name, i) => {
        const warp = document.createElementNS(SVG_NS, "feDisplacementMap");
        warp.setAttribute("in", "ch-" + name);
        warp.setAttribute("in2", "map");
        warp.setAttribute("scale", String(CHANNEL_SCALES[i]));
        warp.setAttribute("xChannelSelector", "R");
        warp.setAttribute("yChannelSelector", "G");
        warp.setAttribute("result", "warp-" + name);
        filter.appendChild(warp);
      });

      const mergeRG = document.createElementNS(SVG_NS, "feBlend");
      mergeRG.setAttribute("in", "warp-r");
      mergeRG.setAttribute("in2", "warp-g");
      mergeRG.setAttribute("mode", "screen");
      mergeRG.setAttribute("result", "warp-rg");
      filter.appendChild(mergeRG);

      const mergeRB = document.createElementNS(SVG_NS, "feBlend");
      mergeRB.setAttribute("in", "warp-rg");
      mergeRB.setAttribute("in2", "warp-b");
      mergeRB.setAttribute("mode", "screen");
      mergeRB.setAttribute("result", "refracted");
      filter.appendChild(mergeRB);

      const soften = document.createElementNS(SVG_NS, "feGaussianBlur");
      soften.setAttribute("in", "refracted");
      soften.setAttribute("stdDeviation", "0.4");
      filter.appendChild(soften);

      ensureDefs().appendChild(filter);
      filters.set(key, id);
      return id;
    }

    function enhance(element) {
      const rect = element.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      if (w < 12 || h < 10 || w > 1600 || h > 900) return;
      const styles = window.getComputedStyle(element);
      if (styles.display === "none" || styles.visibility === "hidden") return;
      let radius = parseFloat(styles.borderTopLeftRadius) || 0;
      radius = Math.max(2, Math.min(radius, w / 2, h / 2));
      const id = buildFilter(w, h, radius);
      element.style.backdropFilter = "url(#" + id + ") saturate(1.3) contrast(1.04) brightness(1.05)";
    }

    function enhanceAll() {
      document.querySelectorAll(".liquid-glass").forEach(enhance);
    }

    function enhancePending() {
      document.querySelectorAll(".liquid-glass").forEach((element) => {
        if (!element.style.backdropFilter) enhance(element);
      });
    }

    let resizeTimer = 0;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(enhanceAll, 250);
    }, { passive: true });
    // Panels revealed later (e.g. the collapsed playlist) join on first use.
    document.addEventListener("pointerdown", () => window.setTimeout(enhancePending, 80), true);

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => window.setTimeout(enhanceAll, 60));
    } else {
      window.setTimeout(enhanceAll, 60);
    }
  } catch (error) {
    /* Leave the stylesheet frosted-glass fallback in place. */
  }
})();
