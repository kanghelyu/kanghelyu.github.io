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
  const BARREL_K = 0.42;
  const SNAP_PAD = 0.45;

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
        center: [0.28, 0.40],
        scale: 0.8,
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
        center: [0.58, 0.80],
        scale: 0.62,
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
        center: [0.5, 0.42],
        scale: 1.28,
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
        center: [0.5, 0.46],
        scale: 1.22,
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
        center: [0.5, 0.46],
        scale: 1.35,
        color: palette.gold,
        accent: palette.cyan,
        speed: [0, 0, 0],
        alpha: 0.9,
        coreWidth: 1.8,
        glowWidth: 3.4,
        glowFade: 0.2,
        view: [0.9, 0.62, 0.22]
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
  let snapCanvas = null;
  let snapCtx = null;
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

  function ensureSnap(w, h) {
    if (!snapCanvas) {
      snapCanvas = document.createElement("canvas");
      snapCtx = snapCanvas.getContext("2d", { alpha: false });
    }
    if (snapCanvas.width !== w || snapCanvas.height !== h) {
      snapCanvas.width = w;
      snapCanvas.height = h;
    }
    return snapCtx;
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
    rec = { canvas: node, ctx: node.getContext("2d") };
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
        x: rect.left,
        y: rect.top,
        w: rect.width,
        h: rect.height,
        r: radius
      });
    });
    return list;
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

    const segs = [];
    function pushSeg(a, b) {
      const z = (a[2] + b[2]) * 0.5;
      segs.push(a[0], a[1], b[0], b[1], z);
    }
    for (let i = 0; i < rows; i += 1) {
      for (let j = 0; j < cols - 1; j += 1) pushSeg(projected[i][j], projected[i][j + 1]);
    }
    for (let j = 0; j < cols; j += 1) {
      for (let i = 0; i < rows - 1; i += 1) pushSeg(projected[i][j], projected[i + 1][j]);
    }

    const n = segs.length / 5;
    const order = new Array(n);
    for (let i = 0; i < n; i += 1) order[i] = i;
    order.sort((a, b) => segs[b * 5 + 4] - segs[a * 5 + 4]);

    const core = surface.coreWidth || 1.8;
    const glow = surface.glowWidth || 3.4;
    const glowFade = surface.glowFade || 0.2;
    const alpha = surface.alpha || 0.9;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (let s = 0; s < n; s += 1) {
      const i = order[s];
      const x1 = segs[i * 5];
      const y1 = segs[i * 5 + 1];
      const x2 = segs[i * 5 + 2];
      const y2 = segs[i * 5 + 3];
      const z = segs[i * 5 + 4];
      const depth = Math.max(0.25, Math.min(1, 1.35 - (z - 3.2) * 0.18));
      const a = alpha * depth;

      ctx.strokeStyle = "rgba(" + surface.color + "," + (a * glowFade).toFixed(3) + ")";
      ctx.lineWidth = glow;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(" + surface.color + "," + a.toFixed(3) + ")";
      ctx.lineWidth = core;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      frameLines.push({
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        color: surface.color,
        accent: surface.accent,
        alpha: a,
        lw: core
      });
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

  function barrelDestToSrc(u, v, k) {
    const nx = u * 2 - 1;
    const ny = v * 2 - 1;
    const r2 = nx * nx + ny * ny;
    const f = 1 + k * r2;
    return [0.5 + 0.5 * nx * f, 0.5 + 0.5 * ny * f];
  }

  function warpWorldToLens(wx, wy, lens) {
    const cx = lens.x + lens.w / 2;
    const cy = lens.y + lens.h / 2;
    const dx = wx - cx;
    const dy = wy - cy;
    const nx = lens.w > 0 ? dx / (lens.w / 2) : 0;
    const ny = lens.h > 0 ? dy / (lens.h / 2) : 0;
    const r2 = nx * nx + ny * ny;
    const f = 1 + BARREL_K * Math.min(2.2, r2);
    return [lens.w / 2 + dx / f, lens.h / 2 + dy / f];
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

  function paintOneLens(lens, canvasRect) {
    const lctx = lens.ctx;
    const lc = lens.canvas;
    const bw = Math.max(1, Math.round(lens.w * dpr));
    const bh = Math.max(1, Math.round(lens.h * dpr));
    if (lc.width !== bw || lc.height !== bh) {
      lc.width = bw;
      lc.height = bh;
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
    const padX = lens.w * SNAP_PAD;
    const padY = lens.h * SNAP_PAD;

    let srcCssX = lens.x - canvasRect.left - padX;
    let srcCssY = lens.y - canvasRect.top - padY;
    let srcCssW = lens.w + padX * 2;
    let srcCssH = lens.h + padY * 2;

    let sx = srcCssX * scaleX;
    let sy = srcCssY * scaleY;
    let sw = srcCssW * scaleX;
    let sh = srcCssH * scaleY;

    const maxW = canvas.width;
    const maxH = canvas.height;
    if (sx < 0) {
      const cut = -sx;
      sw -= cut;
      srcCssW *= (srcCssW * scaleX - cut) / Math.max(1, srcCssW * scaleX);
      srcCssX += cut / scaleX;
      sx = 0;
    }
    if (sy < 0) {
      const cut = -sy;
      sh -= cut;
      srcCssH *= (srcCssH * scaleY - cut) / Math.max(1, srcCssH * scaleY);
      srcCssY += cut / scaleY;
      sy = 0;
    }
    if (sx + sw > maxW) sw = maxW - sx;
    if (sy + sh > maxH) sh = maxH - sy;

    if (sw > 2 && sh > 2) {
      const snapW = Math.max(2, Math.round(sw));
      const snapH = Math.max(2, Math.round(sh));
      const sctx = ensureSnap(snapW, snapH);
      sctx.setTransform(1, 0, 0, 1, 0, 0);
      sctx.fillStyle = BG;
      sctx.fillRect(0, 0, snapW, snapH);
      sctx.drawImage(canvas, sx, sy, sw, sh, 0, 0, snapW, snapH);

      const cols = lowPower ? 7 : 12;
      const rows = lowPower ? 5 : 8;
      lctx.imageSmoothingEnabled = true;
      if (lctx.imageSmoothingQuality) lctx.imageSmoothingQuality = lowPower ? "low" : "high";

      const snapOriginX = srcCssX;
      const snapOriginY = srcCssY;
      const snapCssW = sw / scaleX;
      const snapCssH = sh / scaleY;

      for (let j = 0; j < rows; j += 1) {
        for (let i = 0; i < cols; i += 1) {
          const u0 = i / cols;
          const v0 = j / rows;
          const u1 = (i + 1) / cols;
          const v1 = (j + 1) / rows;
          const um = (u0 + u1) * 0.5;
          const vm = (v0 + v1) * 0.5;
          const srcUV = barrelDestToSrc(um, vm, BARREL_K);
          const worldX = lens.x + srcUV[0] * lens.w;
          const worldY = lens.y + srcUV[1] * lens.h;
          const tileSrcW = ((u1 - u0) * lens.w * (1 + BARREL_K * 0.35)) / snapCssW;
          const tileSrcH = ((v1 - v0) * lens.h * (1 + BARREL_K * 0.35)) / snapCssH;
          const srcPx = ((worldX - snapOriginX) / snapCssW - tileSrcW * 0.5) * snapW;
          const srcPy = ((worldY - snapOriginY) / snapCssH - tileSrcH * 0.5) * snapH;
          const srcPw = Math.max(1, tileSrcW * snapW);
          const srcPh = Math.max(1, tileSrcH * snapH);

          if (srcPx > snapW || srcPy > snapH || srcPx + srcPw < 0 || srcPy + srcPh < 0) {
            continue;
          }

          lctx.drawImage(
            snapCanvas,
            srcPx,
            srcPy,
            srcPw,
            srcPh,
            u0 * bw,
            v0 * bh,
            (u1 - u0) * bw + 0.6,
            (v1 - v0) * bh + 0.6
          );
        }
      }
    }

    const cr = canvasRect;
    const pad = Math.max(lens.w, lens.h) * (SNAP_PAD + 0.15);
    lctx.lineCap = "round";
    lctx.lineJoin = "round";
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
      const split = 1.4 * dpr;

      lctx.strokeStyle = "rgba(" + ln.accent + "," + Math.min(0.7, ln.alpha * 0.7).toFixed(3) + ")";
      lctx.lineWidth = ln.lw * dpr;
      lctx.beginPath();
      lctx.moveTo(a[0] * dpr - split, a[1] * dpr);
      lctx.lineTo(b[0] * dpr - split, b[1] * dpr);
      lctx.stroke();

      lctx.strokeStyle = "rgba(" + ln.color + "," + ln.alpha.toFixed(3) + ")";
      lctx.beginPath();
      lctx.moveTo(a[0] * dpr + split * 0.7, a[1] * dpr);
      lctx.lineTo(b[0] * dpr + split * 0.7, b[1] * dpr);
      lctx.stroke();
    }

    lctx.strokeStyle = "rgba(224,255,255,0.22)";
    lctx.lineWidth = Math.max(1, dpr);
    pathRoundedRect(
      lctx,
      1.25 * dpr,
      1.25 * dpr,
      bw - 2.5 * dpr,
      bh - 2.5 * dpr,
      Math.max(0, lens.r * dpr - 1.25 * dpr)
    );
    lctx.stroke();
    lctx.restore();
  }

  function paintLenses() {
    const lenses = collectLenses();
    if (!lenses.length) return;
    const canvasRect = canvas.getBoundingClientRect();
    for (let i = 0; i < lenses.length; i += 1) paintOneLens(lenses[i], canvasRect);
  }

  function drawScene(time) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, cssW, cssH);
    frameLines = [];
    for (let i = 0; i < surfaces.length; i += 1) drawSurface(surfaces[i], time);
    paintLenses();
  }

  function resize() {
    const nextDpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2);
    const w = Math.max(1, canvas.clientWidth || window.innerWidth || 1);
    const h = Math.max(1, canvas.clientHeight || window.innerHeight || 1);
    dpr = nextDpr;
    cssW = w;
    cssH = h;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    drawScene(elapsed);
  }

  function loop(now) {
    if (!running) return;
    if (document.hidden) {
      lastT = now;
      requestAnimationFrame(loop);
      return;
    }
    if (!lastT) lastT = now;
    const dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;
    if (animated) elapsed += dt;
    drawScene(elapsed);
    requestAnimationFrame(loop);
  }

  function start() {
    if (running) return;
    running = true;
    lastT = 0;
    requestAnimationFrame(loop);
  }

  window.addEventListener("resize", resize, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", resize, { passive: true });
  }
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && running) lastT = 0;
  });

  const playlistToggle = document.getElementById("playlist-toggle");
  if (playlistToggle) {
    playlistToggle.addEventListener("click", function () {
      requestAnimationFrame(function () {
        paintLenses();
      });
    });
  }

  resize();
  start();
})();
