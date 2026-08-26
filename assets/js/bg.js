/*
 * Shared mathematical background.
 *
 * data-scene:
 *   full   (homepage)  — rotating torus, Klein bottle, Möbius strip
 *   torus  (notes)     — one large static torus
 *   mobius (projects)  — one large static Möbius strip
 *   klein              — one large static Klein bottle
 *
 * This file only draws the fixed mathematical scene. Glass refraction lives
 * in liquid-glass.js, so content blocks never allocate a second canvas layer.
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
  const FRAME_INTERVAL = lowPower ? 50 : 32;

  const widthLimit = lowPower ? 26 : 36;
  const heightLimit = lowPower ? 12 : 18;
  const STATIC_VIEW = [1.02, 0.55, 0.14];
  const SUBPAGE_VIEW = [Math.PI / 4, Math.PI / 4, 0];
  /* Camera distance. The old 3.8 gave a ~5.3x near/far size ratio (wide-angle
     look); 8 gives ~1.8x. PROJ_SCALE keeps the z=0 size identical to the old
     camera, so every scene's scale/center/glow layout stays as calibrated. */
  const CAMERA_DIST = 8;
  const PROJ_SCALE = (CAMERA_DIST / 3.8) * 0.5;

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
        center: [0.479, 0.5],
        scale: 0.95,
        color: palette.cyan,
        accent: palette.gold,
        speed: [0, 0, 0],
        alpha: 0.95,
        coreWidth: 1.9,
        glowWidth: 3.6,
        glowFade: 0.2,
        view: SUBPAGE_VIEW
      }
    ],
    mobius: [
      {
        name: "mobius",
        grid: buildSurface("mobius"),
        center: [0.476, 0.5],
        scale: 1.08,
        color: palette.blue,
        accent: palette.gold,
        speed: [0, 0, 0],
        alpha: 0.92,
        coreWidth: 1.8,
        glowWidth: 3.4,
        glowFade: 0.2,
        view: SUBPAGE_VIEW
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
  let lastT = 0;
  let elapsed = 0;
  let running = false;
  let frameRequest = 0;
  let staticLayer = null;
  let vignetteLayer = null;

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
        const z = p[2] + CAMERA_DIST;
        const f = (surface.scale * PROJ_SCALE * dim) / z;
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

  function drawScene(time) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(staticLayer, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (let i = 0; i < surfaces.length; i += 1) drawSurface(surfaces[i], time);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(vignetteLayer, 0, 0);
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

  resize();
  if (animated) start();
})();
