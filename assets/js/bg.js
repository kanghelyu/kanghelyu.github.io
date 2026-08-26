/*
 * Shared mathematical background.
 *
 * data-scene:
 *   full   (homepage)  — rotating torus, Klein bottle, Möbius strip
 *   torus  (notes)     — one large static torus
 *   mobius (projects)  — one large static Möbius strip
 *   klein              — one large static Klein bottle
 *
 * Hero buttons + playlist panel are embedded lens canvases INSIDE those
 * DOM nodes (see paintLenses). The warp therefore scrolls with the
 * element. Nothing lens-shaped is ever drawn on the fixed background
 * canvas — that was the mobile double-button ghost.
 */
(function () {
  "use strict";

  if (window.__kangheBgLoaded) return;
  window.__kangheBgLoaded = true;

  const canvas = document.getElementById("bg");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return;

  const reducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const lowPower =
    touchDevice || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
  const palette = {
    cyan: "168,230,230",
    gold: "244,217,160",
    blue: "113,181,206"
  };
  const BG = "#060d14";
  const LENS_SELECTOR = ".hero-actions .button, .playlist-panel";
  const BARREL_K = 0.34;
  const EDGE_RATIO = 0.2;
  const FRAME_INTERVAL = lowPower ? 50 : 32;

  const widthLimit = lowPower ? 26 : 36;
  const heightLimit = lowPower ? 12 : 18;
  const STATIC_VIEW = [1.02, 0.55, 0.14];

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
          row.push([
            (R + r * Math.cos(v)) * Math.cos(u),
            (R + r * Math.cos(v)) * Math.sin(u),
            r * Math.sin(v)
          ]);
        } else if (kind === "klein") {
          let x;
          let z;
          if (u < Math.PI) {
            x =
              3 * Math.cos(u) * (1 + Math.sin(u)) +
              2 * (1 - Math.cos(u) / 2) * Math.cos(u) * Math.cos(v);
            z =
              -8 * Math.sin(u) -
              2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
          } else {
            x =
              3 * Math.cos(u) * (1 + Math.sin(u)) +
              2 * (1 - Math.cos(u) / 2) * Math.cos(v + Math.PI);
            z = -8 * Math.sin(u);
          }
          row.push([
            x * 0.19,
            -2 * (1 - Math.cos(u) / 2) * Math.sin(v) * 0.19,
            z * 0.19
          ]);
        } else {
          const strip = -0.55 + (1.1 * j) / vCount;
          const R = 1.8;
          row.push([
            (R + strip * Math.cos(u / 2)) * Math.cos(u),
            (R + strip * Math.cos(u / 2)) * Math.sin(u),
            strip * Math.sin(u / 2)
          ]);
        }
      }
      grid.push(row);
    }
    return grid;
  }

  const SCENES = {
    full: [
      {
        name: "torus",
        grid: buildSurface("torus"),
        center: [0.22, 0.29],
        scale: 0.76,
        color: palette.cyan,
        accent: palette.gold,
        speed: [0.12, 0.18, 0.05],
        alpha: 0.95,
        coreWidth: 1.8,
        glowWidth: 3.4,
        glowFade: 0.2
      },
      {
        name: "klein",
        grid: buildSurface("klein"),
        center: [0.81, 0.4],
        scale: 0.92,
        color: palette.gold,
        accent: palette.cyan,
        speed: [0.08, 0.16, -0.04],
        alpha: 0.85,
        coreWidth: 1.8,
        glowWidth: 3.4,
        glowFade: 0.2
      },
      {
        name: "mobius",
        grid: buildSurface("mobius"),
        center: [0.5, 0.79],
        scale: 0.66,
        color: palette.blue,
        accent: palette.gold,
        speed: [0.07, -0.09, 0.03],
        alpha: 0.9,
        coreWidth: 1.7,
        glowWidth: 3.2,
        glowFade: 0.2
      }
    ],
    torus: [
      {
        name: "torus",
        grid: buildSurface("torus"),
        center: [0.5, 0.46],
        scale: 1.12,
        color: palette.cyan,
        accent: palette.gold,
        speed: [0, 0, 0],
        alpha: 0.95,
        coreWidth: 1.9,
        glowWidth: 3.6,
        glowFade: 0.2,
        view: STATIC_VIEW
      }
    ],
    mobius: [
      {
        name: "mobius",
        grid: buildSurface("mobius"),
        center: [0.5, 0.48],
        scale: 1.08,
        color: palette.blue,
        accent: palette.gold,
        speed: [0, 0, 0],
        alpha: 0.92,
        coreWidth: 1.8,
        glowWidth: 3.4,
        glowFade: 0.2,
        view: STATIC_VIEW
      }
    ],
    klein: [
      {
        name: "klein",
        grid: buildSurface("klein"),
        center: [0.5, 0.44],
        scale: 1.18,
        color: palette.gold,
        accent: palette.cyan,
        speed: [0, 0, 0],
        alpha: 0.9,
        coreWidth: 1.8,
        glowWidth: 3.4,
        glowFade: 0.2,
        view: [0.9, -0.6, 0.42]
      }
    ]
  };

  const sceneName = canvas.getAttribute("data-scene") || "full";
  const surfaces = SCENES[sceneName] || SCENES.full;
  const animated = sceneName === "full" && !reducedMotion;

  let dpr = 1;
  let cssW = 1;
  let cssH = 1;
  let frameLines = [];
  let lastT = 0;
  let elapsed = 0;
  let running = false;
  let frameRequest = 0;
  let staticLayer = null;
  let vignetteLayer = null;
  let lensCapture = null;
  const lensCache = new WeakMap();

  function rotatePoint(p, ax, ay, az) {
    let x = p[0];
    let y = p[1];
    let z = p[2];
    let c = Math.cos(ax);
    let s = Math.sin(ax);
    let y2 = y * c - z * s;
    let z2 = y * s + z * c;
    y = y2;
    z = z2;
    c = Math.cos(ay);
    s = Math.sin(ay);
    let x2 = x * c + z * s;
    z2 = -x * s + z * c;
    x = x2;
    z = z2;
    c = Math.cos(az);
    s = Math.sin(az);
    x2 = x * c - y * s;
    y2 = x * s + y * c;
    return [x2, y2, z];
  }

  function pathRoundedRect(target, x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    target.beginPath();
    if (typeof target.roundRect === "function") {
      target.roundRect(x, y, w, h, r);
      return;
    }
    target.moveTo(x + r, y);
    target.arcTo(x + w, y, x + w, y + h, r);
    target.arcTo(x + w, y + h, x, y + h, r);
    target.arcTo(x, y + h, x, y, r);
    target.arcTo(x, y, x + w, y, r);
    target.closePath();
  }

  function ensureLensCanvas(el) {
    let rec = lensCache.get(el);
    if (rec && rec.canvas.isConnected) return rec;
    let node = el.querySelector(":scope > canvas.glass-lens-canvas");
    if (!node) {
      node = document.createElement("canvas");
      node.className = "glass-lens-canvas";
      node.setAttribute("aria-hidden", "true");
      el.insertBefore(node, el.firstChild);
    }
    el.classList.add("has-glass-lens");
    const effectCanvas = document.createElement("canvas");
    const maskCanvas = document.createElement("canvas");
    rec = {
      canvas: node,
      ctx: node.getContext("2d", { alpha: true }),
      effectCanvas: effectCanvas,
      effectCtx: effectCanvas.getContext("2d", { alpha: true }),
      maskCanvas: maskCanvas,
      maskCtx: maskCanvas.getContext("2d", { alpha: true })
    };
    lensCache.set(el, rec);
    return rec;
  }

  function collectLenses() {
    const list = [];
    document.querySelectorAll(LENS_SELECTOR).forEach((el) => {
      if (el.classList.contains("collapsed")) return;
      const styles = window.getComputedStyle(el);
      if (
        styles.display === "none" ||
        styles.visibility === "hidden" ||
        styles.opacity === "0"
      ) {
        return;
      }
      const rect = el.getBoundingClientRect();
      if (rect.width < 12 || rect.height < 10) return;
      if (rect.bottom < -40 || rect.top > cssH + 40) return;
      if (rect.right < -40 || rect.left > cssW + 40) return;
      let radius = parseFloat(styles.borderTopLeftRadius) || 0;
      if (String(styles.borderTopLeftRadius).includes("%")) {
        radius = Math.min(rect.width, rect.height) * (radius / 100);
      }
      radius = Math.max(2, Math.min(radius, rect.width / 2, rect.height / 2));
      const rec = ensureLensCanvas(el);
      list.push({
        el,
        canvas: rec.canvas,
        ctx: rec.ctx,
        effectCanvas: rec.effectCanvas,
        effectCtx: rec.effectCtx,
        maskCanvas: rec.maskCanvas,
        maskCtx: rec.maskCtx,
        x: rect.left,
        y: rect.top,
        w: rect.width,
        h: rect.height,
        r: radius
      });
    });
    return list;
  }

  function drawGlow(target, cx, cy, radius, color, alpha) {
    const gradient = target.createRadialGradient(cx, cy, 0, cx, cy, radius);
    gradient.addColorStop(0, "rgba(" + color + "," + alpha + ")");
    gradient.addColorStop(0.32, "rgba(" + color + "," + alpha * 0.34 + ")");
    gradient.addColorStop(1, "rgba(" + color + ",0)");
    target.fillStyle = gradient;
    target.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  }

  function buildStaticLayers() {
    staticLayer = document.createElement("canvas");
    staticLayer.width = canvas.width;
    staticLayer.height = canvas.height;
    const background = staticLayer.getContext("2d", { alpha: false });
    background.setTransform(dpr, 0, 0, dpr, 0, 0);
    const gradient = background.createLinearGradient(0, 0, cssW, cssH);
    gradient.addColorStop(0, "#04080e");
    gradient.addColorStop(0.52, "#081019");
    gradient.addColorStop(1, "#060c15");
    background.fillStyle = gradient;
    background.fillRect(0, 0, cssW, cssH);
    for (let i = 0; i < surfaces.length; i += 1) {
      const surface = surfaces[i];
      drawGlow(
        background,
        cssW * surface.center[0],
        cssH * surface.center[1],
        Math.min(cssW, cssH) * surface.scale * 1.35,
        surface.color,
        0.34
      );
    }

    vignetteLayer = document.createElement("canvas");
    vignetteLayer.width = canvas.width;
    vignetteLayer.height = canvas.height;
    const vignetteContext = vignetteLayer.getContext("2d");
    vignetteContext.setTransform(dpr, 0, 0, dpr, 0, 0);
    const vignette = vignetteContext.createRadialGradient(
      cssW * 0.5,
      cssH * 0.45,
      Math.min(cssW, cssH) * 0.18,
      cssW * 0.5,
      cssH * 0.45,
      Math.max(cssW, cssH) * 0.8
    );
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,0,0,0.22)");
    vignetteContext.fillStyle = vignette;
    vignetteContext.fillRect(0, 0, cssW, cssH);
  }

  function drawSurface(surface, time) {
    const view = surface.view || STATIC_VIEW;
    const ax = view[0] + (surface.speed[0] || 0) * time;
    const ay = view[1] + (surface.speed[1] || 0) * time;
    const az = view[2] + (surface.speed[2] || 0) * time;
    const cx = cssW * surface.center[0];
    const cy = cssH * surface.center[1];
    const dim = Math.min(cssW, cssH);
    const grid = surface.grid;
    const rows = grid.length;
    const cols = grid[0].length;
    const projected = new Array(rows);

    for (let i = 0; i < rows; i += 1) {
      const row = grid[i];
      const out = new Array(cols);
      for (let j = 0; j < cols; j += 1) {
        const p = rotatePoint(row[j], ax, ay, az);
        const z = p[2] + 3.8;
        const f = (surface.scale * 0.5 * dim) / z;
        out[j] = [cx + p[0] * f, cy + p[1] * f, z];
      }
      projected[i] = out;
    }

    const core = surface.coreWidth || 1.8;
    const glow = surface.glowWidth || 3.4;
    const glowFade = surface.glowFade || 0.2;
    const alpha = surface.alpha || 0.9;

    function drawWireframe(lineWidth, opacityScale, composite) {
      ctx.save();
      ctx.globalCompositeOperation = composite;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = lineWidth;
      for (let i = 0; i < rows - 1; i += 1) {
        const rowAlpha = alpha * opacityScale * (0.66 + (i % 5) * 0.045);
        ctx.strokeStyle = "rgba(" + surface.color + "," + rowAlpha.toFixed(3) + ")";
        ctx.beginPath();
        for (let j = 0; j < cols - 1; j += 1) {
          const point = projected[i][j];
          ctx.moveTo(point[0], point[1]);
          ctx.lineTo(projected[i + 1][j][0], projected[i + 1][j][1]);
          ctx.moveTo(point[0], point[1]);
          ctx.lineTo(projected[i][j + 1][0], projected[i][j + 1][1]);
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    drawWireframe(glow, glowFade, "lighter");
    drawWireframe(core, 1, "source-over");

    // Only a sparse vector copy is retained for the tiny element lenses.
    // The full mesh stays on the background, while these lines supply the
    // crisp RGB fringe without thousands of per-element path submissions.
    const stride = lowPower ? 3 : 2;
    function keepLine(a, b) {
      if (!lensCapture || !lineHits({ x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, lensCapture, 0)) {
        return;
      }
      frameLines.push({
        x1: a[0],
        y1: a[1],
        x2: b[0],
        y2: b[1],
        color: surface.color,
        accent: surface.accent,
        alpha: alpha,
        lw: core
      });
    }
    for (let i = 0; i < rows; i += stride) {
      for (let j = 0; j < cols - 1; j += 1) keepLine(projected[i][j], projected[i][j + 1]);
    }
    for (let j = 0; j < cols; j += stride) {
      for (let i = 0; i < rows - 1; i += 1) keepLine(projected[i][j], projected[i + 1][j]);
    }

    if (surface.name === "mobius") {
      ctx.lineWidth = lowPower ? 1.3 : 1.8;
      ctx.strokeStyle = "rgba(" + surface.accent + ",0.8)";
      [0, cols - 1].forEach(function (edge) {
        ctx.beginPath();
        for (let i = 0; i < rows; i += 1) {
          const p = projected[i][edge];
          if (i === 0) ctx.moveTo(p[0], p[1]);
          else ctx.lineTo(p[0], p[1]);
        }
        ctx.stroke();
      });
    }
  }

  function warpWorldToLens(wx, wy, lens) {
    const cx = lens.x + lens.w / 2;
    const cy = lens.y + lens.h / 2;
    const dx = wx - cx;
    const dy = wy - cy;
    const nx = lens.w > 0 ? dx / (lens.w / 2) : 0;
    const ny = lens.h > 0 ? dy / (lens.h / 2) : 0;
    const r2 = nx * nx + ny * ny;
    const magnification = lowPower ? 1 / 0.86 : 1 / 0.82;
    const edgeCompression = 1 + BARREL_K * Math.min(1.8, r2) * 0.18;
    const factor = magnification / edgeCompression;
    return [lens.w / 2 + dx * factor, lens.h / 2 + dy * factor];
  }

  function lineHits(ln, lens, pad) {
    const minX = Math.min(ln.x1, ln.x2);
    const maxX = Math.max(ln.x1, ln.x2);
    const minY = Math.min(ln.y1, ln.y2);
    const maxY = Math.max(ln.y1, ln.y2);
    return (
      maxX >= lens.x - pad &&
      minX <= lens.x + lens.w + pad &&
      maxY >= lens.y - pad &&
      minY <= lens.y + lens.h + pad
    );
  }

  function buildEdgeMask(lens, width, height) {
    const context = lens.maskCtx;
    const image = context.createImageData(width, height);
    const pixels = image.data;
    const edgeWidth = Math.max(1, width * EDGE_RATIO);
    const edgeHeight = Math.max(1, height * EDGE_RATIO);
    for (let y = 0; y < height; y += 1) {
      const vertical = Math.min(y + 0.5, height - y - 0.5) / edgeHeight;
      for (let x = 0; x < width; x += 1) {
        const horizontal = Math.min(x + 0.5, width - x - 0.5) / edgeWidth;
        const distance = Math.max(0, Math.min(1, horizontal, vertical));
        // Cubic smoothstep has zero slope at both ends: full effect at the
        // rim, a continuous fade, then exactly normal pixels after 20%.
        const smooth = distance * distance * (3 - 2 * distance);
        const alpha = Math.round((1 - smooth) * 255);
        const index = (y * width + x) * 4;
        pixels[index] = 255;
        pixels[index + 1] = 255;
        pixels[index + 2] = 255;
        pixels[index + 3] = alpha;
      }
    }
    context.putImageData(image, 0, 0);
  }

  function paintOneLens(lens, canvasRect) {
    const lctx = lens.ctx;
    const lc = lens.canvas;
    const effectContext = lens.effectCtx;
    const bw = Math.max(1, Math.round(lens.w * dpr));
    const bh = Math.max(1, Math.round(lens.h * dpr));
    if (
      lc.width !== bw || lc.height !== bh ||
      lens.effectCanvas.width !== bw || lens.effectCanvas.height !== bh
    ) {
      lc.width = bw;
      lc.height = bh;
      lens.effectCanvas.width = bw;
      lens.effectCanvas.height = bh;
      lens.maskCanvas.width = bw;
      lens.maskCanvas.height = bh;
      buildEdgeMask(lens, bw, bh);
    }

    lctx.setTransform(1, 0, 0, 1, 0, 0);
    lctx.clearRect(0, 0, bw, bh);
    lctx.save();
    pathRoundedRect(lctx, 0, 0, bw, bh, lens.r * dpr);
    lctx.clip();
    lctx.fillStyle = BG;
    lctx.fill();

    const scaleX = canvas.width / Math.max(1, canvasRect.width);
    const scaleY = canvas.height / Math.max(1, canvasRect.height);
    // The center is an exact copy of the underlying scene. Refraction is
    // confined to four 20% edge bands, so text stays crisp and the material
    // reads like a lens rim instead of a fully warped sheet.
    const baseX = Math.max(0, (lens.x - canvasRect.left) * scaleX);
    const baseY = Math.max(0, (lens.y - canvasRect.top) * scaleY);
    const baseWidth = Math.min(canvas.width - baseX, lens.w * scaleX);
    const baseHeight = Math.min(canvas.height - baseY, lens.h * scaleY);
    if (baseWidth > 2 && baseHeight > 2) {
      lctx.imageSmoothingEnabled = true;
      if (lctx.imageSmoothingQuality) lctx.imageSmoothingQuality = "high";
      lctx.drawImage(canvas, baseX, baseY, baseWidth, baseHeight, 0, 0, bw, bh);
    }

    effectContext.setTransform(1, 0, 0, 1, 0, 0);
    effectContext.clearRect(0, 0, bw, bh);
    effectContext.globalCompositeOperation = "source-over";

    // One smooth affine sample replaces the old 7x5 / 12x8 tile warp. A
    // cached SDF-style alpha mask feathers it continuously through the 20%
    // rim instead of clipping at a visible rectangular boundary.
    const zoom = lowPower ? 0.86 : 0.82;
    const sourceWidth = lens.w * zoom;
    const sourceHeight = lens.h * zoom;
    const sourceX = lens.x - canvasRect.left + (lens.w - sourceWidth) * 0.5;
    const sourceY = lens.y - canvasRect.top + (lens.h - sourceHeight) * 0.5;
    const sx = Math.max(0, sourceX * scaleX);
    const sy = Math.max(0, sourceY * scaleY);
    const sw = Math.min(canvas.width - sx, sourceWidth * scaleX);
    const sh = Math.min(canvas.height - sy, sourceHeight * scaleY);
    if (sw > 2 && sh > 2) {
      effectContext.imageSmoothingEnabled = true;
      if (effectContext.imageSmoothingQuality) effectContext.imageSmoothingQuality = "high";
      effectContext.drawImage(canvas, sx, sy, sw, sh, 0, 0, bw, bh);
    }

    const cr = canvasRect;
    const pad = Math.max(lens.w, lens.h) * 0.6;
    const groups = new Map();
    effectContext.lineCap = "round";
    effectContext.lineJoin = "round";
    for (let i = 0; i < frameLines.length; i += 1) {
      const ln = frameLines[i];
      const vx1 = cr.left + ln.x1;
      const vy1 = cr.top + ln.y1;
      const vx2 = cr.left + ln.x2;
      const vy2 = cr.top + ln.y2;
      if (
        !lineHits(
          { x1: vx1, y1: vy1, x2: vx2, y2: vy2 },
          lens,
          pad
        )
      ) {
        continue;
      }
      const a = warpWorldToLens(vx1, vy1, lens);
      const b = warpWorldToLens(vx2, vy2, lens);
      let group = groups.get(ln.color);
      if (!group) {
        group = { color: ln.color, alpha: ln.alpha, width: ln.lw, lines: [] };
        groups.set(ln.color, group);
      }
      group.lines.push(a[0] * dpr, a[1] * dpr, b[0] * dpr, b[1] * dpr);
    }

    // Batch every surface into three paths (red fringe, blue fringe, core).
    // The previous implementation submitted three strokes per segment; this
    // keeps the same visible dispersion with at most nine strokes per lens.
    const split = (lowPower ? 0.9 : 1.25) * dpr;
    function strokeGroup(group, offsetX, color, alpha) {
      effectContext.strokeStyle = "rgba(" + color + "," + alpha.toFixed(3) + ")";
      effectContext.lineWidth = Math.max(0.8, group.width * dpr * 0.84);
      effectContext.beginPath();
      for (let i = 0; i < group.lines.length; i += 4) {
        effectContext.moveTo(group.lines[i] + offsetX, group.lines[i + 1]);
        effectContext.lineTo(group.lines[i + 2] + offsetX, group.lines[i + 3]);
      }
      effectContext.stroke();
    }
    groups.forEach(function (group) {
      strokeGroup(group, -split, "255,142,164", Math.min(0.42, group.alpha * 0.36));
      strokeGroup(group, split, "102,219,255", Math.min(0.48, group.alpha * 0.42));
      strokeGroup(group, 0, group.color, Math.min(0.88, group.alpha * 0.9));
    });
    effectContext.globalCompositeOperation = "destination-in";
    effectContext.drawImage(lens.maskCanvas, 0, 0);
    effectContext.globalCompositeOperation = "source-over";
    lctx.drawImage(lens.effectCanvas, 0, 0);

    const sheen = lctx.createLinearGradient(0, 0, bw, bh);
    sheen.addColorStop(0, "rgba(225,252,255,0.1)");
    sheen.addColorStop(0.42, "rgba(160,224,244,0.018)");
    sheen.addColorStop(1, "rgba(255,226,181,0.055)");
    lctx.fillStyle = sheen;
    lctx.fillRect(0, 0, bw, bh);
    lctx.restore();
  }

  function paintLenses(lenses, canvasRect) {
    lenses = lenses || collectLenses();
    if (!lenses.length) return;
    canvasRect = canvasRect || canvas.getBoundingClientRect();
    for (let i = 0; i < lenses.length; i += 1) paintOneLens(lenses[i], canvasRect);
  }

  function drawScene(time) {
    const lenses = collectLenses();
    const canvasRect = canvas.getBoundingClientRect();
    lensCapture = null;
    if (lenses.length) {
      let left = Infinity;
      let top = Infinity;
      let right = -Infinity;
      let bottom = -Infinity;
      let pad = 0;
      for (let i = 0; i < lenses.length; i += 1) {
        const lens = lenses[i];
        left = Math.min(left, lens.x - canvasRect.left);
        top = Math.min(top, lens.y - canvasRect.top);
        right = Math.max(right, lens.x + lens.w - canvasRect.left);
        bottom = Math.max(bottom, lens.y + lens.h - canvasRect.top);
        pad = Math.max(pad, Math.max(lens.w, lens.h) * 0.6);
      }
      lensCapture = {
        x: left - pad,
        y: top - pad,
        w: right - left + pad * 2,
        h: bottom - top + pad * 2
      };
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(staticLayer, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    frameLines = [];
    for (let i = 0; i < surfaces.length; i += 1) drawSurface(surfaces[i], time);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(vignetteLayer, 0, 0);
    paintLenses(lenses, canvasRect);
  }

  let stableWidth = 0;
  let stableHeight = 0;
  let resizeTimer = 0;

  function resize() {
    // CSS gives #bg a stable 100lvh box. Read that box before the dynamic
    // window viewport so mobile browser chrome cannot resize the scene.
    const w = Math.max(1, canvas.clientWidth || window.innerWidth || 1);
    const h = Math.max(1, canvas.clientHeight || window.innerHeight || 1);
    // Mobile browser chrome repeatedly changes only the viewport height while
    // scrolling. Keep the fixed scene stable until a real resize/orientation
    // change instead of reallocating several canvases mid-gesture.
    if (w === stableWidth && (lowPower || Math.abs(h - stableHeight) < 140)) return;
    stableWidth = w;
    stableHeight = h;
    dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.15 : 1.6);
    cssW = w;
    cssH = h;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    buildStaticLayers();
    drawScene(elapsed);
  }

  function loop(now) {
    if (!running) return;
    if (document.hidden) {
      running = false;
      frameRequest = 0;
      return;
    }
    if (!lastT) lastT = now - FRAME_INTERVAL;
    if (now - lastT < FRAME_INTERVAL) {
      frameRequest = requestAnimationFrame(loop);
      return;
    }
    const dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;
    elapsed += dt;
    drawScene(elapsed);
    frameRequest = requestAnimationFrame(loop);
  }

  function start() {
    if (running) return;
    running = true;
    lastT = 0;
    frameRequest = requestAnimationFrame(loop);
  }

  function scheduleResize() {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 180);
  }

  window.addEventListener("resize", scheduleResize, { passive: true });
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && animated) start();
  });

  const playlistToggle = document.getElementById("playlist-toggle");
  if (playlistToggle) {
    playlistToggle.addEventListener("click", function () {
      requestAnimationFrame(function () {
        drawScene(elapsed);
      });
    });
  }

  resize();
  if (animated) start();
})();
