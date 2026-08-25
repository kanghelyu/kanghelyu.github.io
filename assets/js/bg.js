/*
 * Shared mathematical background. The canvas's data-scene attribute picks
 * the scene:
 *   full   (homepage)     — rotating torus, Klein bottle and Möbius strip
 *   torus  (notes)        — one large static torus, elevated 3/4 view
 *   mobius (projects)     — one large static Möbius strip, same view
 *   klein  (stacks reader)— one large slanted static Klein bottle
 * The surfaces and their glow are the entire scene: no particles, no glyphs.
 * Static scenes render a single frame, so subpages run no animation loop.
 */
(function () {
  "use strict";

  const canvas = document.getElementById("bg");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return;

  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const lowPower = touchDevice || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
  const palette = {
    cyan: "168,230,230",
    gold: "244,217,160",
    blue: "113,181,206"
  };

  function buildSurface(kind) {
    const grid = [];
    const uCount = kind === "mobius" ? widthLimit + 6 : widthLimit + 8;
    const vCount = kind === "mobius" ? Math.max(8, heightLimit - 4) : heightLimit + 4;
    for (let i = 0; i <= uCount; i += 1) {
      const row = [];
      const u = (i / uCount) * Math.PI * 2;
      for (let j = 0; j <= vCount; j += 1) {
        const v = (j / vCount) * Math.PI * 2;
        if (kind === "torus") {
          const R = 1.85;
          const r = 0.72;
          row.push([(R + r * Math.cos(v)) * Math.cos(u), (R + r * Math.cos(v)) * Math.sin(u), r * Math.sin(v)]);
        } else if (kind === "klein") {
          let x;
          let z;
          if (u < Math.PI) {
            x = 3 * Math.cos(u) * (1 + Math.sin(u)) + 2 * (1 - Math.cos(u) / 2) * Math.cos(u) * Math.cos(v);
            z = -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
          } else {
            x = 3 * Math.cos(u) * (1 + Math.sin(u)) + 2 * (1 - Math.cos(u) / 2) * Math.cos(v + Math.PI);
            z = -8 * Math.sin(u);
          }
          row.push([x * 0.19, -2 * (1 - Math.cos(u) / 2) * Math.sin(v) * 0.19, z * 0.19]);
        } else {
          const strip = -0.55 + (1.1 * j) / vCount;
          const R = 1.8;
          row.push([(R + strip * Math.cos(u / 2)) * Math.cos(u), (R + strip * Math.cos(u / 2)) * Math.sin(u), strip * Math.sin(u / 2)]);
        }
      }
      grid.push(row);
    }
    return grid;
  }

  const widthLimit = lowPower ? 26 : 36;
  const heightLimit = lowPower ? 12 : 18;

  // Elevated ~45° with a slight yaw — the shared view for static scenes.
  const STATIC_VIEW = [1.02, 0.55, 0.14];

  const SCENES = {
    full: [
      // Torus & Klein bottle: fine, crisp wireframes; Möbius matches opacity.
      { name: "torus", grid: buildSurface("torus"), center: [0.22, 0.29], scale: 0.76, color: palette.cyan, accent: palette.gold, speed: [0.12, 0.18, 0.05], alpha: 0.95, coreWidth: 1.8, glowWidth: 3.4, glowFade: 0.2 },
      { name: "klein", grid: buildSurface("klein"), center: [0.81, 0.4], scale: 0.92, color: palette.gold, accent: palette.cyan, speed: [0.08, 0.16, -0.04], alpha: 0.85, coreWidth: 1.8, glowWidth: 3.4, glowFade: 0.2 },
      { name: "mobius", grid: buildSurface("mobius"), center: [0.5, 0.79], scale: 0.66, color: palette.blue, accent: palette.gold, speed: [0.07, -0.09, 0.03], alpha: 0.9 }
    ],
    torus: [
      { name: "torus", grid: buildSurface("torus"), center: [0.5, 0.46], scale: 1.12, color: palette.cyan, accent: palette.gold, angles: STATIC_VIEW, alpha: 0.95, coreWidth: 1.8, glowWidth: 3.4, glowFade: 0.2 }
    ],
    mobius: [
      { name: "mobius", grid: buildSurface("mobius"), center: [0.5, 0.48], scale: 1.08, color: palette.blue, accent: palette.gold, angles: STATIC_VIEW, alpha: 0.9 }
    ],
    klein: [
      { name: "klein", grid: buildSurface("klein"), center: [0.5, 0.44], scale: 1.18, color: palette.gold, accent: palette.cyan, angles: [0.9, -0.6, 0.42], alpha: 0.85, coreWidth: 1.8, glowWidth: 3.4, glowFade: 0.2 }
    ]
  };

  const sceneName = canvas.dataset.scene || "full";
  const surfaces = SCENES[sceneName] || SCENES.full;
  const animated = sceneName === "full" && !reducedMotion;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let time = 0;
  let frame = 0;
  let lastFrame = 0;
  let visible = !document.hidden;
  // Pre-rendered once per size: everything behind the wireframes (gradient
  // + surface halos) and everything in front of them (vignette). The frame
  // loop then only blits these two layers and strokes the wireframes.
  let staticLayer = null;
  let vignetteLayer = null;

  function rotate(point, angles) {
    const [ax, ay, az] = angles;
    const ca = Math.cos(ax), sa = Math.sin(ax);
    const cy = Math.cos(ay), sy = Math.sin(ay);
    const cz = Math.cos(az), sz = Math.sin(az);
    const y1 = point[1] * ca - point[2] * sa;
    const z1 = point[1] * sa + point[2] * ca;
    const x2 = point[0] * cy + z1 * sy;
    const z2 = -point[0] * sy + z1 * cy;
    return [x2 * cz - y1 * sz, x2 * sz + y1 * cz, z2];
  }

  function project(point, angles, cx, cy, scale) {
    const rotated = rotate(point, angles);
    const perspective = scale / (7.5 - rotated[2]);
    return { x: cx + rotated[0] * perspective, y: cy + rotated[1] * perspective };
  }

  function drawGlow(context, cx, cy, radius, color, alpha) {
    const gradient = context.createRadialGradient(cx, cy, 0, cx, cy, radius);
    gradient.addColorStop(0, `rgba(${color},${alpha})`);
    gradient.addColorStop(0.32, `rgba(${color},${alpha * 0.34})`);
    gradient.addColorStop(1, `rgba(${color},0)`);
    context.fillStyle = gradient;
    context.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  }

  function buildStaticLayers() {
    staticLayer = document.createElement("canvas");
    staticLayer.width = canvas.width;
    staticLayer.height = canvas.height;
    const sctx = staticLayer.getContext("2d");
    sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const gradient = sctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#04080e");
    gradient.addColorStop(0.5, "#081019");
    gradient.addColorStop(1, "#060c15");
    sctx.fillStyle = gradient;
    sctx.fillRect(0, 0, width, height);
    surfaces.forEach((surface) => {
      drawGlow(sctx, width * surface.center[0], height * surface.center[1], Math.min(width, height) * surface.scale * 1.35, surface.color, 0.34);
    });

    vignetteLayer = document.createElement("canvas");
    vignetteLayer.width = canvas.width;
    vignetteLayer.height = canvas.height;
    const vctx = vignetteLayer.getContext("2d");
    vctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const vignette = vctx.createRadialGradient(width * 0.5, height * 0.45, Math.min(width, height) * 0.18, width * 0.5, height * 0.45, Math.max(width, height) * 0.8);
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,0,0,0.22)");
    vctx.fillStyle = vignette;
    vctx.fillRect(0, 0, width, height);
  }

  function drawSurface(surface) {
    const seconds = time * 0.001;
    const angles = surface.angles || [
      0.7 + seconds * surface.speed[0],
      0.4 + seconds * surface.speed[1],
      0.08 + seconds * surface.speed[2]
    ];
    const cx = width * surface.center[0];
    const cy = height * surface.center[1];
    const scale = Math.min(width, height) * surface.scale;
    const projected = surface.grid.map((row) => row.map((point) => project(point, angles, cx, cy, scale)));
    const uMax = projected.length - 1;
    const vMax = projected[0].length - 1;

    // One stroke per grid row instead of one per cell — same output,
    // an order of magnitude fewer path submissions per frame.
    const drawWireframe = (lineWidth, opacityScale, composite) => {
      ctx.save();
      ctx.globalCompositeOperation = composite;
      ctx.lineWidth = lineWidth;
      for (let i = 0; i < uMax; i += 1) {
        ctx.strokeStyle = `rgba(${surface.color},${(surface.alpha * opacityScale * (0.66 + (i % 5) * 0.045)).toFixed(3)})`;
        ctx.beginPath();
        for (let j = 0; j < vMax; j += 1) {
          const point = projected[i][j];
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(projected[i + 1][j].x, projected[i + 1][j].y);
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(projected[i][j + 1].x, projected[i][j + 1].y);
        }
        ctx.stroke();
      }
      ctx.restore();
    };

    const coreWidth = surface.coreWidth || (lowPower ? 1.2 : 1.6);
    const glowWidth = surface.glowWidth || (lowPower ? 2.4 : 3.2);
    const glowFade = surface.glowFade || 0.16;
    drawWireframe(glowWidth, glowFade, "lighter");
    drawWireframe(coreWidth, 1, "source-over");

    if (surface.name === "mobius") {
      ctx.save();
      ctx.lineWidth = lowPower ? 1.3 : 1.8;
      ctx.strokeStyle = `rgba(${surface.accent},0.8)`;
      [0, vMax].forEach((edge) => {
        ctx.beginPath();
        for (let i = 0; i <= uMax; i += 1) {
          const point = projected[i][edge];
          if (i === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
      });
      ctx.restore();
    }
  }

  /* ============ Glass lens pass ============
     The hero buttons and the playlist panel are transparent windows onto
     this canvas. Their lens is rendered HERE — a slice-displaced copy of
     the finished frame plus a catch-light rim — so the effect is visible
     in every engine and does not depend on backdrop-filter: url() support.
     liquid-glass.js supplies the live element rects. */

  const lensFields = new Map();
  let scratch = null;

  function roundedRectSDF(px, py, hw, hh, r) {
    const qx = Math.abs(px) - hw + r;
    const qy = Math.abs(py) - hh + r;
    return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
  }

  function lensField(w, h, r) {
    const key = w + "x" + h + "x" + r;
    if (lensFields.has(key)) return lensFields.get(key);
    const cell = 8;
    const cols = Math.ceil(w / cell);
    const rows = Math.ceil(h / cell);
    const offsets = new Float32Array(cols * rows * 2);
    const hw = w / 2;
    const hh = h / 2;
    const rr = Math.max(2, Math.min(r, hw, hh));
    const band = Math.max(26, Math.min(w, h) * 0.6);
    const strength = 40;
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const px = (col + 0.5) * cell - hw;
        const py = (row + 0.5) * cell - hh;
        const d = roundedRectSDF(px, py, hw, hh, rr);
        const t = Math.exp(-Math.abs(d) / band);
        let nx = 0;
        let ny = 0;
        if (t > 0.01) {
          const gx = roundedRectSDF(px + 1, py, hw, hh, rr) - roundedRectSDF(px - 1, py, hw, hh, rr);
          const gy = roundedRectSDF(px, py + 1, hw, hh, rr) - roundedRectSDF(px, py - 1, hw, hh, rr);
          const len = Math.hypot(gx, gy);
          if (len > 1e-6) {
            nx = gx / len;
            ny = gy / len;
          }
        }
        const idx = (row * cols + col) * 2;
        offsets[idx] = nx * strength * t;
        offsets[idx + 1] = ny * strength * t;
      }
    }
    const field = { cell, cols, rows, offsets };
    lensFields.set(key, field);
    return field;
  }

  function drawLens() {
    if (typeof window.__glassLensRects !== "function") return;
    const rects = window.__glassLensRects();
    for (const rect of rects) {
      const x = rect.x;
      const y = rect.y;
      const w = rect.w;
      const h = rect.h;
      const pad = Math.min(48, x, y, width - (x + w), height - (y + h));
      if (pad < 12 || w < 12 || h < 10) continue;
      const field = lensField(w, h, rect.r);
      const rw = w + pad * 2;
      const rh = h + pad * 2;
      if (!scratch || scratch.width < Math.ceil(rw * dpr) || scratch.height < Math.ceil(rh * dpr)) {
        scratch = document.createElement("canvas");
        scratch.width = Math.ceil(rw * dpr);
        scratch.height = Math.ceil(rh * dpr);
      }
      const sctx = scratch.getContext("2d");
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sctx.clearRect(x - pad, y - pad, rw, rh);
      sctx.drawImage(canvas, (x - pad) * dpr, (y - pad) * dpr, rw * dpr, rh * dpr, x - pad, y - pad, rw, rh);

      ctx.save();
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, w, h, rect.r);
      else ctx.rect(x, y, w, h);
      ctx.clip();
      const cell = field.cell;
      for (let row = 0; row < field.rows; row += 1) {
        for (let col = 0; col < field.cols; col += 1) {
          const cw = Math.min(cell, w - col * cell);
          const ch = Math.min(cell, h - row * cell);
          if (cw <= 0 || ch <= 0) continue;
          const idx = (row * field.cols + col) * 2;
          const dx = x + col * cell;
          const dy = y + row * cell;
          ctx.drawImage(
            scratch,
            (dx + field.offsets[idx] - (x - pad)) * dpr,
            (dy + field.offsets[idx + 1] - (y - pad)) * dpr,
            cw * dpr,
            ch * dpr,
            dx,
            dy,
            cw,
            ch
          );
        }
      }
      // Catch-light rim so the lens reads even over an empty backdrop.
      ctx.globalCompositeOperation = "lighter";
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(168,230,230,0.10)";
      if (ctx.roundRect) ctx.roundRect(x + 1, y + 1, w - 2, h - 2, Math.max(1, rect.r - 1));
      else ctx.rect(x + 1, y + 1, w - 2, h - 2);
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.10)";
      if (ctx.roundRect) ctx.roundRect(x + 2.5, y + 2.5, w - 5, h - 5, Math.max(1, rect.r - 2.5));
      else ctx.rect(x + 2.5, y + 2.5, w - 5, h - 5);
      ctx.stroke();
      ctx.restore();
    }
  }

  function render(now) {
    frame = 0;
    if (!visible) return;
    if (animated) {
      if (now - lastFrame < (lowPower ? 52 : 32)) {
        frame = requestAnimationFrame(render);
        return;
      }
      lastFrame = now;
    }
    time = now;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(staticLayer, 0, 0, width, height);
    surfaces.forEach(drawSurface);
    ctx.drawImage(vignetteLayer, 0, 0, width, height);
    if (animated) drawLens();
    if (animated) frame = requestAnimationFrame(render);
  }

  let stableWidth = 0;
  let stableHeight = 0;
  let resizeTimer = 0;

  function applySize(w, h) {
    width = w;
    height = h;
    dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.2 : 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildStaticLayers();
    render(0);
  }

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    // Phone toolbars fire resize with small height deltas while scrolling;
    // redrawing on those is what makes the fixed backdrop visibly jump.
    // The element is stretched by CSS in the meantime, which is imperceptible.
    if (w === stableWidth && Math.abs(h - stableHeight) < 140) return;
    stableWidth = w;
    stableHeight = h;
    applySize(w, h);
  }

  if (animated) {
    document.addEventListener("visibilitychange", () => {
      visible = !document.hidden;
      if (visible && !frame) frame = requestAnimationFrame(render);
    });
  }
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 200);
  }, { passive: true });
  resize();
})();
