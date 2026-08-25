/* Kanghe Lyu site — restrained mathematical light field */
(function () {
  "use strict";

  const canvas = document.getElementById("bg");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return;

  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const lowPower = touchDevice || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
  const symbols = ["χ", "λ", "ρ", "π", "∂", "∞", "⊗", "Γ"];
  const mathFont = "STIX Two Math, Cambria Math, Times New Roman, serif";
  const pointer = { x: -9999, y: -9999 };
  const lights = [
    { x: 0.16, y: 0.2, radius: 0.55, color: "168,230,230", speed: 0.00014, phase: 0.2 },
    { x: 0.82, y: 0.42, radius: 0.48, color: "244,217,160", speed: 0.00011, phase: 2.1 },
    { x: 0.52, y: 0.88, radius: 0.42, color: "105,157,180", speed: 0.00009, phase: 4.2 }
  ];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let time = 0;
  let scrollY = 0;
  let visible = !document.hidden;
  let frameId = 0;
  let lastFrame = 0;
  let texture = [];

  function initTexture() {
    texture = [];
    const count = lowPower ? 7 : 12;
    for (let index = 0; index < count; index += 1) {
      texture.push({
        x: Math.random(),
        y: Math.random(),
        size: 18 + Math.random() * 14,
        alpha: 0.105 + Math.random() * 0.075,
        phase: Math.random() * Math.PI * 2,
        speed: 0.00018 + Math.random() * 0.00024,
        symbol: symbols[index % symbols.length],
        color: index % 3 === 0 ? "244,217,160" : "168,230,230"
      });
    }
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

  function drawBase() {
    const base = ctx.createLinearGradient(0, 0, width, height);
    base.addColorStop(0, "#060d14");
    base.addColorStop(0.48, "#091520");
    base.addColorStop(1, "#071018");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, width, height);
  }

  function drawLight(light, index) {
    const drift = reducedMotion ? 0 : Math.sin(time * light.speed + light.phase) * 0.08;
    const x = width * (light.x + drift * (index % 2 === 0 ? 1 : -1));
    const y = height * (light.y + Math.cos(time * light.speed * 0.8 + light.phase) * 0.06);
    const radius = Math.max(width, height) * light.radius;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(${light.color},0.14)`);
    gradient.addColorStop(0.35, `rgba(${light.color},0.055)`);
    gradient.addColorStop(1, `rgba(${light.color},0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  function drawRibbon(offset, color, alpha) {
    const amplitude = Math.min(width, height) * 0.11;
    const baseline = height * (0.18 + offset);
    ctx.beginPath();
    for (let x = -40; x <= width + 40; x += 24) {
      const wave = Math.sin(x * 0.006 + time * 0.00032 + offset * 10) * amplitude;
      const y = baseline + wave + scrollY * (offset - 0.25) * 0.035;
      if (x === -40) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(${color},${alpha})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function drawTexture() {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    texture.forEach((item) => {
      const drift = reducedMotion ? 0 : Math.sin(time * item.speed + item.phase) * 0.035;
      const x = width * (item.x + drift);
      const y = height * (item.y + Math.cos(time * item.speed * 0.7 + item.phase) * 0.025) - scrollY * 0.035;
      ctx.globalAlpha = item.alpha;
      ctx.fillStyle = `rgb(${item.color})`;
      ctx.font = `${item.size}px ${mathFont}`;
      ctx.fillText(item.symbol, x, y);
    });
    ctx.globalAlpha = 1;
  }

  function drawPointerGlow() {
    if (touchDevice || pointer.x < 0) return;
    const radius = Math.min(220, Math.max(110, Math.min(width, height) * 0.22));
    const gradient = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, radius);
    gradient.addColorStop(0, "rgba(168,230,230,0.045)");
    gradient.addColorStop(0.42, "rgba(168,230,230,0.012)");
    gradient.addColorStop(1, "rgba(168,230,230,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(pointer.x - radius, pointer.y - radius, radius * 2, radius * 2);
  }

  function drawVignette() {
    const gradient = ctx.createRadialGradient(width * 0.5, height * 0.48, Math.min(width, height) * 0.2, width * 0.5, height * 0.48, Math.max(width, height) * 0.76);
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(1, "rgba(0,0,0,0.38)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  function render(now) {
    frameId = 0;
    if (!visible) return;
    if (!reducedMotion && now - lastFrame < (lowPower ? 55 : 34)) {
      frameId = requestAnimationFrame(render);
      return;
    }
    lastFrame = now;
    time += 1;
    drawBase();
    lights.forEach(drawLight);
    drawRibbon(0.04, "168,230,230", 0.12);
    drawRibbon(0.38, "244,217,160", 0.08);
    drawRibbon(0.72, "168,230,230", 0.07);
    drawTexture();
    drawPointerGlow();
    drawVignette();
    if (!reducedMotion) frameId = requestAnimationFrame(render);
  }

  document.addEventListener("visibilitychange", () => {
    visible = !document.hidden;
    if (visible && !reducedMotion && !frameId) frameId = requestAnimationFrame(render);
  });
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("scroll", () => { scrollY = window.scrollY; }, { passive: true });
  if (!touchDevice) {
    window.addEventListener("mousemove", (event) => { pointer.x = event.clientX; pointer.y = event.clientY; }, { passive: true });
    window.addEventListener("mouseout", () => { pointer.x = -9999; pointer.y = -9999; }, { passive: true });
  }

  resize();
})();
