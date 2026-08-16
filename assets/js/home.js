/* ============================================================
   Kanghe Lyu site — home.js
   Homepage translations + pixel-math background canvas.
   Shared language/music runtime lives in assets/js/site.js.
   ============================================================ */

(function () {
  "use strict";

  const translations = {
      en: {
        name: "Kanghe Lyu",
        eyebrow: "MATHEMATICS · GEOMETRY · REPRESENTATION THEORY",
        subtitle: "B.Sc. in Mathematics, Sichuan University (2022–2026)<br>Ph.D. candidate at SUSTech SICM (2026–)",
        introP1: "My interests lie in representation theory, noncommutative geometry, mathematical physics, and algebraic geometry.",
        introP2: "I will begin my Ph.D. study at the Southern University of Science and Technology in 2026, advised by Prof. Vyacheslav Futorny.",
        introP3: "This page contains my personal information, curriculum vitae, and mathematical notes or surveys.",
        musicNote: "Click the music button in the upper-right corner to listen to AI music that I created to match the visual style of this website, adding a more immersive atmosphere while browsing (Some are sung by \"AI languages\").",

        expTitle: "Experience",
        expP1: "Summer School at New Uzbekistan University (Speakers: Pavel Etingof, Yuri Berest), from 01/07/2024 to 15/07/2024.",
        expP2: "International Mathematics Summer School at Westlake University, from 06/07/2025 to 16/07/2025.",
        expP3: "Visiting Program at New Uzbekistan University, from 12/11/2025 to 23/01/2026.",
        expP4: "Visiting Program at SUSTech, from 12/03/2026 to 12/05/2026.",
        expP5: "Summer School for Outstanding Mathematics Students, Sichuan University, from 05/07/2026 to 19/07/2026.",
        expP6: "Visiting Program at Institute for Problems of Information Transmission, Moscow, from 05/07/2026 to 19/07/2026.",

        awardsTitle: "Awards",
        awardsP1: "Contemporary Undergraduate Mathematical Contest in Modeling, National Second Prize.",
        awardsP2: "College Students' Innovative Entrepreneurial Training Plan Program, National Level.",
        awardsP3: "Sichuan University Comprehensive First-Class Scholarship (Top 5%), 2023–2024.",
        awardsP4: "Outstanding Undergraduate Student, Sichuan University, 2023–2024.",
        awardsP5: "Outstanding Student Cadre, Sichuan University, 2022–2023.",
        awardsP6: "Sichuan Provincial Comprehensive Quality Class A Certificate, 12/2024.",
        awardsP7: "Sichuan University Outstanding Graduate, 10/2025.",

        contactTitle: "Contact",
        footer: "GEOMETRY · REPRESENTATION THEORY · MATHEMATICAL PHYSICS",
        btnEmail: "Email",
        btnNotes: "Notes",
        btnCV: "CV"
      },
      zh: {
        name: "吕康禾",
        eyebrow: "数学 · 几何 · 表示论",
        subtitle: "四川大学数学学士 (2022–2026)<br>南方科技大学深圳国际数学中心博士生 (2026–)",
        introP1: "我的兴趣方向是表示论、非交换几何、数学物理以及代数几何。",
        introP2: "我将于2026年开始在南方科技大学攻读博士学位，导师为 Vyacheslav Futorny 教授。",
        introP3: "此页面用于发布我的个人信息、简历以及数学笔记或综述。",
        musicNote: "点击右上角的音乐按钮，可以欣赏我制作的、契合本网页风格的 AI 音乐，从而在浏览时获得更具沉浸感的氛围 (有些是\"AI语\"唱的)。",

        expTitle: "经历",
        expP1: "2024年7月1日至2024年7月15日，新乌兹别克斯坦大学暑期学校（讲者：Pavel Etingof、Yuri Berest）。",
        expP2: "2025年7月6日至2025年7月16日，西湖大学国际数学暑期学校。",
        expP3: "2025年11月12日至2026年1月23日，新乌兹别克斯坦大学访问项目。",
        expP4: "2026年3月12日至2026年5月12日，南方科技大学访问项目。",
        expP5: "2026年7月5日至2026年7月19日，四川大学数学拔尖学生暑期学校。",
        expP6: "2026年7月5日至2026年7月19日，莫斯科信息传输问题研究所访问项目。",

        awardsTitle: "获奖与项目",
        awardsP1: "全国大学生数学建模竞赛国家二等奖。",
        awardsP2: "大学生创新创业训练计划项目国家级结项。",
        awardsP3: "四川大学综合一等奖学金（前5%），2023–2024。",
        awardsP4: "四川大学优秀学生，2023–2024。",
        awardsP5: "四川大学优秀学生干部，2022–2023。",
        awardsP6: "四川省综合素质A级证书，2024年12月。",
        awardsP7: "四川大学优秀毕业生，2025年10月。",

        contactTitle: "联系方式",
        footer: "几何 · 表示论 · 数学物理",
        btnEmail: "邮件",
        btnNotes: "笔记",
        btnCV: "简历"
      }
    };

  function applyPageLanguage(lang) {
    const t = translations[lang];

    document.title = t.name;

    document.getElementById("name").textContent = t.name;
    document.getElementById("eyebrow").textContent = t.eyebrow;
    document.getElementById("subtitle").innerHTML = t.subtitle;
    document.getElementById("intro-p1").textContent = t.introP1;
    document.getElementById("intro-p2").textContent = t.introP2;
    document.getElementById("intro-p3").textContent = t.introP3;
    document.getElementById("music-note").textContent = t.musicNote;

    document.getElementById("exp-title").textContent = t.expTitle;
    document.getElementById("exp-p1").textContent = t.expP1;
    document.getElementById("exp-p2").textContent = t.expP2;
    document.getElementById("exp-p3").textContent = t.expP3;
    document.getElementById("exp-p4").textContent = t.expP4;
    document.getElementById("exp-p5").textContent = t.expP5;
    document.getElementById("exp-p6").textContent = t.expP6;

    document.getElementById("awards-title").textContent = t.awardsTitle;
    document.getElementById("awards-p1").textContent = t.awardsP1;
    document.getElementById("awards-p2").textContent = t.awardsP2;
    document.getElementById("awards-p3").textContent = t.awardsP3;
    document.getElementById("awards-p4").textContent = t.awardsP4;
    document.getElementById("awards-p5").textContent = t.awardsP5;
    document.getElementById("awards-p6").textContent = t.awardsP6;
    document.getElementById("awards-p7").textContent = t.awardsP7;

    document.getElementById("contact-title").textContent = t.contactTitle;
    document.getElementById("footer").textContent = t.footer;
    document.getElementById("btn-email").textContent = t.btnEmail;
    document.getElementById("btn-notes").textContent = t.btnNotes;
    document.getElementById("btn-cv").textContent = t.btnCV;
  }

  KangheSite.init(applyPageLanguage);

  // ============== Pixel mathematical background ==============
  // ============== Pixel mathematical background ==============
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

const buffer = document.createElement("canvas");
const bctx = buffer.getContext("2d");

let w = 0;
let h = 0;
let bw = 0;
let bh = 0;
let pixelSize = 6;
let time = 0;
let mouse = { x: 0, y: 0 };
let mathRain = [];

const mathSymbols = ["∫", "∂", "∇", "∑", "∞", "Δ", "Ω", "Φ", "Ψ", "π", "λ", "μ"];

function resize() {
  w = window.innerWidth;
  h = window.innerHeight;

  canvas.width = w;
  canvas.height = h;

  pixelSize = Math.max(3, Math.min(5, Math.floor(Math.min(w, h) / 210)));
  bw = Math.ceil(w / pixelSize);
  bh = Math.ceil(h / pixelSize);

  buffer.width = bw;
  buffer.height = bh;

  ctx.imageSmoothingEnabled = false;
  bctx.imageSmoothingEnabled = false;

  initMathRain();
}

window.addEventListener("resize", resize);
window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("touchmove", () => {}, { passive: true });

function initMathRain() {
  mathRain = Array.from({ length: 34 }, () => ({
    x: Math.random() * bw,
    y: Math.random() * bh,
    speed: 0.07 + Math.random() * 0.15,
    size: 12 + Math.floor(Math.random() * 8),
    symbol: mathSymbols[Math.floor(Math.random() * mathSymbols.length)],
    drift: (Math.random() - 0.5) * 0.05,
    phase: Math.random() * Math.PI * 2,
    alpha: 0.28 + Math.random() * 0.25
  }));
}

function px(x, y, ww, hh, color) {
  bctx.fillStyle = color;
  bctx.fillRect(
    Math.round(x),
    Math.round(y),
    Math.max(1, Math.round(ww)),
    Math.max(1, Math.round(hh))
  );
}

function drawBackground() {
  const grad = bctx.createLinearGradient(0, 0, 0, bh);
  grad.addColorStop(0, "#0d1b22");
  grad.addColorStop(0.55, "#132832");
  grad.addColorStop(1, "#1b3038");
  bctx.fillStyle = grad;
  bctx.fillRect(0, 0, bw, bh);

  bctx.strokeStyle = "rgba(168,230,230,0.055)";
  bctx.lineWidth = 1;

  for (let x = 0; x < bw; x += 12) {
    bctx.beginPath();
    bctx.moveTo(x + 0.5, 0);
    bctx.lineTo(x + 0.5, bh);
    bctx.stroke();
  }

  for (let y = 0; y < bh; y += 12) {
    bctx.beginPath();
    bctx.moveTo(0, y + 0.5);
    bctx.lineTo(bw, y + 0.5);
    bctx.stroke();
  }
}

function rotate3D(x, y, z, ax, ay, az = 0) {
  let c = Math.cos(ax), s = Math.sin(ax);
  let y1 = y * c - z * s;
  let z1 = y * s + z * c;

  c = Math.cos(ay); s = Math.sin(ay);
  let x2 = x * c + z1 * s;
  let z2 = -x * s + z1 * c;

  c = Math.cos(az); s = Math.sin(az);
  let x3 = x2 * c - y1 * s;
  let y3 = x2 * s + y1 * c;

  return { x: x3, y: y3, z: z2 };
}

function project(pt, scale, ox, oy) {
  const d = 7.5;
  const k = scale / (d - pt.z);
  return {
    x: ox + pt.x * k,
    y: oy + pt.y * k,
    depth: pt.z
  };
}

function drawThickPixel(x, y, size, color) {
  const s = Math.max(1, Math.round(size));
  px(x - Math.floor(s / 2), y - Math.floor(s / 2), s, s, color);
}

function drawPixelLine(x1, y1, x2, y2, color, thickness = 2) {
  x1 = Math.round(x1);
  y1 = Math.round(y1);
  x2 = Math.round(x2);
  y2 = Math.round(y2);

  let dx = Math.abs(x2 - x1), sx = x1 < x2 ? 1 : -1;
  let dy = -Math.abs(y2 - y1), sy = y1 < y2 ? 1 : -1;
  let err = dx + dy;

  while (true) {
    drawThickPixel(x1, y1, thickness, color);
    if (x1 === x2 && y1 === y2) break;

    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x1 += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y1 += sy;
    }
  }
}

function drawTorus(cx, cy, scale, t) {
  const U = 28;
  const V = 18;
  const R = 1.85;
  const r = 0.72;
  const grid = [];

  for (let i = 0; i <= U; i++) {
    grid[i] = [];
    const u = i / U * Math.PI * 2;

    for (let j = 0; j <= V; j++) {
      const v = j / V * Math.PI * 2;

      const x = (R + r * Math.cos(v)) * Math.cos(u);
      const y = (R + r * Math.cos(v)) * Math.sin(u);
      const z = r * Math.sin(v);

      const rot = rotate3D(x, y, z, 0.72 + t * 0.006, 0.55 + t * 0.008, 0.08);
      grid[i][j] = project(rot, scale, cx, cy);
    }
  }

  for (let i = 0; i < U; i++) {
    for (let j = 0; j < V; j++) {
      const p = grid[i][j];
      const pu = grid[i + 1][j];
      const pv = grid[i][j + 1];

      const alpha = Math.max(0.30, Math.min(0.86, 0.48 + p.depth * 0.16));
      const lineColor = `rgba(168,230,230,${alpha})`;
      const pointColor = `rgba(244,217,160,${Math.min(0.95, alpha + 0.10)})`;

      drawPixelLine(p.x, p.y, pu.x, pu.y, lineColor, 1);
      drawPixelLine(p.x, p.y, pv.x, pv.y, lineColor, 1);

      if ((i + j) % 4 === 0) {
        drawThickPixel(p.x, p.y, 2, pointColor);
      }
    }
  }
}

function drawKlein(cx, cy, scale, t) {
  const U = 28;
  const V = 18;
  const grid = [];

  for (let i = 0; i <= U; i++) {
    grid[i] = [];
    const u = i / U * Math.PI * 2;

    for (let j = 0; j <= V; j++) {
      const v = j / V * Math.PI * 2;

      let x, y, z;

      if (u < Math.PI) {
        x = 3 * Math.cos(u) * (1 + Math.sin(u)) + 2 * (1 - Math.cos(u) / 2) * Math.cos(u) * Math.cos(v);
        z = -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
      } else {
        x = 3 * Math.cos(u) * (1 + Math.sin(u)) + 2 * (1 - Math.cos(u) / 2) * Math.cos(v + Math.PI);
        z = -8 * Math.sin(u);
      }

      y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v);

      x *= 0.19;
      y *= 0.19;
      z *= 0.19;

      const rot = rotate3D(x, y, z, 0.34 + t * 0.007, -0.78 + t * 0.006, -0.18);
      grid[i][j] = project(rot, scale, cx, cy);
    }
  }

  for (let i = 0; i < U; i++) {
    for (let j = 0; j < V; j++) {
      const p = grid[i][j];
      const pu = grid[i + 1][j];
      const pv = grid[i][j + 1];

      const alpha = Math.max(0.30, Math.min(0.86, 0.48 + p.depth * 0.15));
      const lineColor = `rgba(244,217,160,${alpha})`;
      const pointColor = `rgba(168,230,230,${Math.min(0.92, alpha + 0.08)})`;

      drawPixelLine(p.x, p.y, pu.x, pu.y, lineColor, 1);
      drawPixelLine(p.x, p.y, pv.x, pv.y, lineColor, 1);

      if ((i + j) % 4 === 0) {
        drawThickPixel(p.x, p.y, 2, pointColor);
      }
    }
  }
}

function drawMobius(cx, cy, scale, t) {
  const U = 34;
  const V = 10;
  const grid = [];
  const R = 1.8;
  const W = 0.55;

  for (let i = 0; i <= U; i++) {
    grid[i] = [];
    const u = i / U * Math.PI * 2;

    for (let j = 0; j <= V; j++) {
      const v = -W + (2 * W * j / V);

      const x = (R + v * Math.cos(u / 2)) * Math.cos(u);
      const y = (R + v * Math.cos(u / 2)) * Math.sin(u);
      const z = v * Math.sin(u / 2);

      const rot = rotate3D(x, y, z, 1.05, -0.25 + t * 0.004, 0.12);
      grid[i][j] = project(rot, scale, cx, cy);
    }
  }

  for (let i = 0; i < U; i++) {
    for (let j = 0; j < V; j++) {
      const p = grid[i][j];
      const pu = grid[i + 1][j];
      const pv = grid[i][j + 1];

      const alpha = Math.max(0.28, Math.min(0.82, 0.46 + p.depth * 0.15));
      const lineColor = `rgba(168,230,230,${alpha})`;
      const pointColor = `rgba(244,217,160,${Math.min(0.9, alpha + 0.08)})`;

      drawPixelLine(p.x, p.y, pu.x, pu.y, lineColor, 1);
      drawPixelLine(p.x, p.y, pv.x, pv.y, lineColor, 1);

      if ((i + j) % 3 === 0) {
        drawThickPixel(p.x, p.y, 2, pointColor);
      }
    }
  }

  for (let i = 0; i < U; i++) {
    const pTop = grid[i][0];
    const pTopNext = grid[i + 1][0];

    const pBottom = grid[i][V];
    const pBottomNext = grid[i + 1][V];

    const alphaTop = Math.max(0.28, Math.min(0.82, 0.46 + pTop.depth * 0.15));
    const alphaBottom = Math.max(0.28, Math.min(0.82, 0.46 + pBottom.depth * 0.15));

    const topColor = `rgba(168,230,230,${alphaTop})`;
    const bottomColor = `rgba(168,230,230,${alphaBottom})`;

    drawPixelLine(pTop.x, pTop.y, pTopNext.x, pTopNext.y, topColor, 1.6);
    drawPixelLine(pBottom.x, pBottom.y, pBottomNext.x, pBottomNext.y, bottomColor, 1.6);
  }
}

function drawLargePixelSymbols() {
  const mx = mouse.x / pixelSize;
  const my = mouse.y / pixelSize;

  bctx.textAlign = "center";
  bctx.textBaseline = "middle";

  for (const r of mathRain) {
    const dx = mx - r.x;
    const dy = my - r.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 18) {
      r.x -= dx * 0.008;
    }

    r.y += r.speed;
    r.x += Math.sin(time * 0.018 + r.phase) * r.drift;

    if (r.y > bh + 8) {
      r.y = -8;
      r.x = Math.random() * bw;
    }

    const alpha = r.alpha + Math.sin(time * 0.025 + r.phase) * 0.10;
    const x = Math.round(r.x);
    const y = Math.round(r.y);

    bctx.font = `bold ${r.size}px Georgia`;

    bctx.fillStyle = "rgba(0,0,0,0.40)";
    bctx.fillText(r.symbol, x + 1, y + 1);

    bctx.fillStyle = `rgba(244,217,160,${alpha})`;
    bctx.fillText(r.symbol, x, y);
  }
}

function drawBigFormulaBlocks() {
  const items = [
    { text: "∂² = 0", x: 0.16, y: 0.18, c: "rgba(244,217,160,0.30)" },
    { text: "Spec(R)", x: 0.83, y: 0.18, c: "rgba(168,230,230,0.30)" },
    { text: "H⁰(X,L)", x: 0.17, y: 0.78, c: "rgba(168,230,230,0.24)" },
    { text: "GLₙ", x: 0.83, y: 0.78, c: "rgba(244,217,160,0.25)" }
  ];

  bctx.textAlign = "center";
  bctx.textBaseline = "middle";

  for (const item of items) {
    const x = bw * item.x;
    const y = bh * item.y;

    bctx.font = "bold 16px Georgia";

    bctx.fillStyle = "rgba(0,0,0,0.34)";
    bctx.fillText(item.text, Math.round(x + 1), Math.round(y + 1));

    bctx.fillStyle = item.c;
    bctx.fillText(item.text, Math.round(x), Math.round(y));
  }
}

function drawCenterGlow() {
  const g = bctx.createRadialGradient(
    bw * 0.5, bh * 0.46, 2,
    bw * 0.5, bh * 0.46, Math.min(bw, bh) * 0.34
  );

  g.addColorStop(0, "rgba(168,230,230,0.12)");
  g.addColorStop(1, "rgba(168,230,230,0)");

  bctx.fillStyle = g;
  bctx.fillRect(0, 0, bw, bh);
}

function drawVignette() {
  const g = bctx.createRadialGradient(
    bw * 0.5, bh * 0.5, Math.min(bw, bh) * 0.12,
    bw * 0.5, bh * 0.5, Math.max(bw, bh) * 0.7
  );

  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.56)");

  bctx.fillStyle = g;
  bctx.fillRect(0, 0, bw, bh);
}

function render() {
  time++;

  bctx.clearRect(0, 0, bw, bh);

  drawBackground();
  drawCenterGlow();
  drawBigFormulaBlocks();

  const s = Math.min(bw, bh);

  drawTorus(bw * 0.26, bh * 0.3, s * 0.8, time);
  drawKlein(bw * 0.78, bh * 0.39, s * 0.96, time);
  drawMobius(bw * 0.50, bh * 0.77, s * 0.768, -time * 1.1);

  drawLargePixelSymbols();
  drawVignette();

  ctx.clearRect(0, 0, w, h);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(buffer, 0, 0, w, h);

  requestAnimationFrame(render);
}

  resize();
  render();
})();
