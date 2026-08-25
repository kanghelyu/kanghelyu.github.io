/*
 * Shared mathematical background: Torus, Klein bottle and Möbius strip.
 * The geometry is rendered as a restrained 2D wireframe so every page,
 * including low-power devices, has a deterministic fallback.
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
  const widthLimit = lowPower ? 26 : 36;
  const heightLimit = lowPower ? 12 : 18;
  const palette = {
    cyan: "168,230,230",
    gold: "244,217,160",
    blue: "113,181,206"
  };
  const pointer = { x: -9999, y: -9999 };
  const mathGlyphs = ["χ", "λ", "ρ", "π", "∂", "∞", "⊗", "Γ"];
  const mathFont = "STIX Two Math, Cambria Math, Times New Roman, serif";
  let width = 0;
  let height = 0;
  let dpr = 1;
  let time = 0;
  let visible = !document.hidden;
  let frame = 0;
  let lastFrame = 0;
  let texture = [];

  function buildSurface(kind) {
    const grid = [];
    const uCount = kind === "mobius" ? widthLimit + 6 : widthLimit;
    const vCount = kind === "mobius" ? Math.max(8, heightLimit - 4) : heightLimit;
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

  const surfaces = [
    { name: "torus", grid: buildSurface("torus"), center: [0.18, 0.29], scale: 0.76, color: palette.cyan, accent: palette.gold, speed: [0.0007, 0.0009, 0.00025], alpha: 0.56 },
    { name: "klein", grid: buildSurface("klein"), center: [0.81, 0.4], scale: 0.92, color: palette.gold, accent: palette.cyan, speed: [0.0005, 0.0008, -0.0002], alpha: 0.48 },
    { name: "mobius", grid: buildSurface("mobius"), center: [0.5, 0.79], scale: 0.66, color: palette.blue, accent: palette.gold, speed: [0.0004, -0.00045, 0.00015], alpha: 0.52 }
  ];

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

  function warp(x, y) {
    if (touchDevice || pointer.x < 0) return { x, y };
    const dx = x - pointer.x;
    const dy = y - pointer.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 230) return { x, y };
    const strength = Math.pow(1 - distance / 230, 2);
    const pull = Math.min(strength * 16, Math.max(0, distance - 18));
    const ux = dx / (distance || 1);
    const uy = dy / (distance || 1);
    return { x: x - ux * pull - uy * strength * 5, y: y - uy * pull + ux * strength * 5 };
  }

  function initTexture() {
    texture = [];
    const count = lowPower ? 10 : 18;
    for (let i = 0; i < count; i += 1) {
      texture.push({
        x: Math.random(),
        y: Math.random(),
        size: 17 + Math.random() * 15,
        alpha: 0.08 + Math.random() * 0.08,
        phase: Math.random() * Math.PI * 2,
        symbol: mathGlyphs[i % mathGlyphs.length],
        color: i % 4 === 0 ? palette.gold : palette.cyan
      });
    }
  }

  function project(point, angles, cx, cy, scale) {
    const rotated = rotate(point, angles);
    const perspective = scale / (7.5 - rotated[2]);
    return warp(cx + rotated[0] * perspective, cy + rotated[1] * perspective);
  }

  function drawGlow(cx, cy, radius, color, alpha) {
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    gradient.addColorStop(0, `rgba(${color},${alpha})`);
    gradient.addColorStop(0.32, `rgba(${color},${alpha * 0.34})`);
    gradient.addColorStop(1, `rgba(${color},0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  }

  function drawSurface(surface, index) {
    const seconds = time * 0.001;
    const angles = [
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

    drawGlow(cx, cy, scale * 0.9, surface.color, 0.10);
    const drawWireframe = (lineWidth, opacityScale, composite) => {
      ctx.save();
      ctx.globalCompositeOperation = composite;
      ctx.lineWidth = lineWidth;
      for (let i = 0; i < uMax; i += 1) {
        for (let j = 0; j < vMax; j += 1) {
          const point = projected[i][j];
          const nextU = projected[i + 1][j];
          const nextV = projected[i][j + 1];
          ctx.strokeStyle = `rgba(${surface.color},${(surface.alpha * opacityScale * (0.66 + (i % 5) * 0.045)).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(nextU.x, nextU.y);
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(nextV.x, nextV.y);
          ctx.stroke();
        }
      }
      ctx.restore();
    };

    drawWireframe(lowPower ? 2.2 : 4.8, 0.22, "lighter");
    drawWireframe(lowPower ? 0.85 : 1.25, 1, "source-over");

    if (surface.name === "mobius") {
      ctx.save();
      ctx.lineWidth = lowPower ? 1.1 : 1.7;
      [0, vMax].forEach((edge) => {
        for (let i = 0; i < uMax; i += 1) {
          const first = projected[i][edge];
          const second = projected[i + 1][edge];
          ctx.strokeStyle = `rgba(${surface.accent},0.76)`;
          ctx.beginPath();
          ctx.moveTo(first.x, first.y);
          ctx.lineTo(second.x, second.y);
          ctx.stroke();
        }
      });
      ctx.restore();
    }
  }

  function drawTexture() {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    texture.forEach((item) => {
      const drift = reducedMotion ? 0 : Math.sin(time * 0.0008 + item.phase) * 0.018;
      ctx.globalAlpha = item.alpha;
      ctx.fillStyle = `rgb(${item.color})`;
      ctx.font = `${item.size}px ${mathFont}`;
      ctx.fillText(item.symbol, width * (item.x + drift), height * item.y);
    });
    ctx.globalAlpha = 1;
  }

  function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#071520");
    gradient.addColorStop(0.48, "#0b2030");
    gradient.addColorStop(1, "#0b1723");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    drawGlow(width * 0.22, height * 0.22, Math.max(width, height) * 0.56, palette.cyan, 0.12);
    drawGlow(width * 0.82, height * 0.56, Math.max(width, height) * 0.48, palette.gold, 0.09);
    drawGlow(width * 0.48, height * 0.92, Math.max(width, height) * 0.42, palette.blue, 0.08);
  }

  function drawVignette() {
    const gradient = ctx.createRadialGradient(width * 0.5, height * 0.45, Math.min(width, height) * 0.18, width * 0.5, height * 0.45, Math.max(width, height) * 0.8);
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(1, "rgba(0,0,0,0.24)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  function render(now) {
    frame = 0;
    if (!visible) return;
    if (!reducedMotion && now - lastFrame < (lowPower ? 52 : 32)) {
      frame = requestAnimationFrame(render);
      return;
    }
    lastFrame = now;
    time += 1;
    ctx.clearRect(0, 0, width, height);
    drawBackground();
    surfaces.forEach(drawSurface);
    drawTexture();
    drawVignette();
    if (!reducedMotion) frame = requestAnimationFrame(render);
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.2 : 1.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initTexture();
    render(0);
  }

  document.addEventListener("visibilitychange", () => {
    visible = !document.hidden;
    if (visible && !reducedMotion && !frame) frame = requestAnimationFrame(render);
  });
  window.addEventListener("resize", resize, { passive: true });
  if (!touchDevice) {
    window.addEventListener("pointermove", (event) => { pointer.x = event.clientX; pointer.y = event.clientY; }, { passive: true });
    window.addEventListener("pointerleave", () => { pointer.x = -9999; pointer.y = -9999; }, { passive: true });
  }
  resize();
})();
