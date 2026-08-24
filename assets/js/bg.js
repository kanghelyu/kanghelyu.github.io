/* Kanghe Lyu site — restrained mathematical canvas background */
(function () {
  "use strict";

  const canvas = document.getElementById("bg");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return;

  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const lowPower = touchDevice || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
  const colors = { cyan: "168,230,230", gold: "244,217,160", pale: "200,220,240" };
  const glyphs = ["χ", "λ", "ρ", "π", "Γ", "V", "G", "⊗", "⊕", "≅", "∂", "∇", "∞"];
  const mathFont = "STIX Two Math, Cambria Math, Times New Roman, serif";
  const lens = { x: -9999, y: -9999 };
  let width = 0;
  let height = 0;
  let dpr = 1;
  let scrollY = 0;
  let time = 0;
  let frameId = 0;
  let lastFrame = 0;
  let visible = !document.hidden;

  function makeGrid(kind) {
    const grid = [];
    const uCount = kind === "mobius" ? (lowPower ? 24 : 40) : (lowPower ? 22 : 32);
    const vCount = kind === "mobius" ? (lowPower ? 8 : 12) : (lowPower ? 14 : 20);
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
          const v2 = -0.55 + (1.1 * j) / vCount;
          const R = 1.8;
          row.push([(R + v2 * Math.cos(u / 2)) * Math.cos(u), (R + v2 * Math.cos(u / 2)) * Math.sin(u), v2 * Math.sin(u / 2)]);
        }
      }
      grid.push(row);
    }
    return grid;
  }

  const surfaces = [
    { grid: makeGrid("torus"), x: 0.24, y: 0.3, scale: 0.55, line: colors.cyan, dot: colors.gold, glow: colors.cyan, edge: false, speed: [0.005, 0.007, 0.08] },
    { grid: makeGrid("klein"), x: 0.78, y: 0.36, scale: 0.8, line: "255,231,170", dot: "190,244,236", glow: "255,231,170", edge: false, speed: [0.006, 0.005, -0.18], brightness: 1.08 },
    { grid: makeGrid("mobius"), x: 0.5, y: 0.76, scale: 0.5, line: colors.cyan, dot: colors.gold, glow: colors.cyan, edge: true, speed: [0, -0.003, 0.12] }
  ];

  let dust = [];
  let orbs = [];

  function warp(x, y) {
    if (lens.x < 0) return { x, y };
    const dx = x - lens.x;
    const dy = y - lens.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 260) return { x, y };
    const t = 1 - distance / 260;
    const strength = t * t;
    const pull = Math.min(strength * strength * 150, Math.max(0, distance - 26));
    const ux = dx / (distance || 1);
    const uy = dy / (distance || 1);
    const swirl = strength * 22;
    return { x: x - ux * pull - uy * swirl, y: y - uy * pull + ux * swirl };
  }

  function rotator(ax, ay, az) {
    const ca = Math.cos(ax), sa = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay), cz = Math.cos(az), sz = Math.sin(az);
    return (x, y, z) => {
      const y1 = y * ca - z * sa;
      const z1 = y * sa + z * ca;
      const x2 = x * cy + z1 * sy;
      const z2 = -x * sy + z1 * cy;
      return [x2 * cz - y1 * sz, x2 * sz + y1 * cz, z2];
    };
  }

  function initParticles() {
    dust = [];
    orbs = [];
    const dustCount = Math.min(lowPower ? 84 : 180, Math.round((width * height) / (lowPower ? 17000 : 10000)));
    for (let i = 0; i < dustCount; i += 1) {
      dust.push({ x: Math.random() * width, y: Math.random() * height, size: 16 + Math.random() * 12, alpha: 0.28 + Math.random() * 0.3, phase: Math.random() * Math.PI * 2, color: Math.random() > 0.78 ? colors.gold : colors.pale, glyph: glyphs[Math.floor(Math.random() * glyphs.length)] });
    }
    const orbCount = lowPower ? 18 : 32;
    for (let i = 0; i < orbCount; i += 1) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      orbs.push({ x, y, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, phase: Math.random() * Math.PI * 2, color: Math.random() > 0.5 ? colors.cyan : colors.gold, glyph: glyphs[Math.floor(Math.random() * glyphs.length)] });
    }
  }

  function drawSurface(surface, rotation, cx, cy, scale) {
    const grid = surface.grid;
    const projected = grid.map((row) => row.map((point) => {
      const rotated = rotation(point[0], point[1], point[2]);
      const factor = scale / (8 - rotated[2]);
      const warped = warp(cx + rotated[0] * factor, cy + rotated[1] * factor);
      return { x: warped.x, y: warped.y, depth: rotated[2] };
    }));
    const uMax = projected.length - 1;
    const vMax = projected[0].length - 1;
    ctx.lineWidth = 1.6;
    for (let i = 0; i < uMax; i += 1) {
      for (let j = 0; j < vMax; j += 1) {
        const point = projected[i][j];
        const nextU = projected[i + 1][j];
        const nextV = projected[i][j + 1];
        const alpha = Math.max(0.08, Math.min(0.44, 0.22 + point.depth * 0.06)) * (surface.brightness || 1);
        ctx.strokeStyle = `rgba(${surface.line},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(point.x, point.y); ctx.lineTo(nextU.x, nextU.y);
        ctx.moveTo(point.x, point.y); ctx.lineTo(nextV.x, nextV.y);
        ctx.stroke();
      }
    }
    if (surface.edge) {
      ctx.lineWidth = 1.4;
      for (const edge of [0, vMax]) {
        for (let i = 0; i < uMax; i += 1) {
          const first = projected[i][edge];
          const second = projected[i + 1][edge];
          ctx.strokeStyle = `rgba(${colors.gold},${Math.max(0.38, Math.min(0.72, 0.54 + first.depth * 0.08)).toFixed(3)})`;
          ctx.beginPath(); ctx.moveTo(first.x, first.y); ctx.lineTo(second.x, second.y); ctx.stroke();
        }
      }
    }
  }

  function drawParticles() {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    dust.forEach((particle) => {
      const warped = warp(particle.x, particle.y);
      ctx.globalAlpha = particle.alpha + Math.sin(time * 0.012 + particle.phase) * 0.08;
      ctx.fillStyle = `rgb(${particle.color})`;
      ctx.font = `${particle.size}px ${mathFont}`;
      ctx.fillText(particle.glyph, warped.x, warped.y);
    });
    orbs.forEach((orb) => {
      if (!reduceMotion) {
        if (lens.x >= 0) {
          const dx = lens.x - orb.x;
          const dy = lens.y - orb.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = 1100 / (dx * dx + dy * dy + 3600);
          orb.vx = (orb.vx + (dx / distance - dy / distance * 0.35) * force) * 0.985;
          orb.vy = (orb.vy + (dy / distance + dx / distance * 0.35) * force) * 0.985;
        }
        orb.x = (orb.x + orb.vx + width) % width;
        orb.y = (orb.y + orb.vy + height) % height;
      }
      ctx.globalAlpha = 0.34 + Math.sin(time * 0.015 + orb.phase) * 0.08;
      ctx.fillStyle = `rgb(${orb.color})`;
      ctx.font = `${lowPower ? 20 : 25}px ${mathFont}`;
      ctx.fillText(orb.glyph, orb.x, orb.y);
    });
    ctx.globalAlpha = 1;
  }

  function drawBackdrop() {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#060d14");
    gradient.addColorStop(0.45, "#0a1620");
    gradient.addColorStop(1, "#0b1520");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  function render(now) {
    frameId = 0;
    if (!visible) return;
    if (!reduceMotion && now - lastFrame < (lowPower ? 48 : 30)) {
      frameId = requestAnimationFrame(render);
      return;
    }
    lastFrame = now;
    time += 1;
    ctx.clearRect(0, 0, width, height);
    drawBackdrop();
    drawParticles();
    const scale = Math.min(width, height);
    const offset = scrollY * 0.12;
    surfaces.forEach((surface, index) => {
      const speed = surface.speed;
      const rotation = rotator(speed[0] + time * speed[0] * 0.8, speed[1] + time * speed[1] * 0.8, speed[2]);
      drawSurface(surface, rotation, width * surface.x, height * surface.y - offset, scale * surface.scale);
    });
    if (!reduceMotion) frameId = requestAnimationFrame(render);
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.25 : 1.6);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initParticles();
    if (reduceMotion && !frameId) render(0);
  }

  document.addEventListener("visibilitychange", () => {
    visible = !document.hidden;
    if (visible && !reduceMotion && !frameId) frameId = requestAnimationFrame(render);
  });
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("scroll", () => { scrollY = window.scrollY; }, { passive: true });
  if (!touchDevice) {
    window.addEventListener("mousemove", (event) => { lens.x = event.clientX; lens.y = event.clientY; }, { passive: true });
    window.addEventListener("mouseout", () => { lens.x = -9999; lens.y = -9999; }, { passive: true });
  }

  resize();
  render(0);
})();
