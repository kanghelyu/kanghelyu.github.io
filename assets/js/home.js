/* ============================================================
   Kanghe Lyu site — home.js v2
   Homepage translations + high-fidelity math canvas background.
   Preserved: Torus, Klein Bottle, Möbius Strip, math rain.
   Upgraded: glow lines, star field, cursor light, scroll reveal.
   ============================================================ */

(function () {
  "use strict";

  /* ---- Translations ---- */
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
      expP1: "Summer School at New Uzbekistan University (Speakers: Pavel Etingof, Yuri Berest), 01/07/2024 – 15/07/2024.",
      expP2: "International Mathematics Summer School at Westlake University, 06/07/2025 – 16/07/2025.",
      expP3: "Visiting Program at New Uzbekistan University, 12/11/2025 – 23/01/2026.",
      expP4: "Visiting Program at SUSTech, 12/03/2026 – 12/05/2026.",
      expP5: "Summer School for Outstanding Mathematics Students, Sichuan University, 05/07/2026 – 19/07/2026.",
      expP6: "Visiting Program at Institute for Problems of Information Transmission, Moscow, 05/07/2026 – 19/07/2026.",
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
      btnApps: "Apps",
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
      btnApps: "应用",
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
    document.getElementById("btn-projects").textContent = t.btnApps;
    document.getElementById("btn-cv").textContent = t.btnCV;
  }

  KangheSite.init(applyPageLanguage);

  /* ================================================================
     Canvas Background — high-fidelity math visualization
     ================================================================ */

  const canvas = document.getElementById("bg");
  const ctx = canvas.getContext("2d");
  let w = 0, h = 0, time = 0, scrollY = 0;
  const mouse = { x: -1000, y: -1000 };

  /* ---- Rotation: precompute trig once per surface per frame ---- */
  function makeRotator(ax, ay, az) {
    const ca = Math.cos(ax), sa = Math.sin(ax);
    const cy = Math.cos(ay), sy = Math.sin(ay);
    const cz = Math.cos(az), sz = Math.sin(az);
    return function (x, y, z) {
      const y1 = y * ca - z * sa, z1 = y * sa + z * ca;
      const x2 = x * cy + z1 * sy, z2 = -x * sy + z1 * cy;
      return [x2 * cz - y1 * sz, x2 * sz + y1 * cz, z2];
    };
  }

  /* ---- Parametric grids (position only, rotation applied later) ---- */
  function buildTorus() {
    const U = 32, V = 20, R = 1.85, r = 0.72, pts = [];
    for (let i = 0; i <= U; i++) {
      pts[i] = [];
      const u = (i / U) * Math.PI * 2;
      for (let j = 0; j <= V; j++) {
        const v = (j / V) * Math.PI * 2;
        pts[i][j] = [
          (R + r * Math.cos(v)) * Math.cos(u),
          (R + r * Math.cos(v)) * Math.sin(u),
          r * Math.sin(v)
        ];
      }
    }
    return pts;
  }

  function buildKlein() {
    const U = 32, V = 20, pts = [];
    for (let i = 0; i <= U; i++) {
      pts[i] = [];
      const u = (i / U) * Math.PI * 2;
      for (let j = 0; j <= V; j++) {
        const v = (j / V) * Math.PI * 2;
        let x, z;
        if (u < Math.PI) {
          x = 3 * Math.cos(u) * (1 + Math.sin(u)) + 2 * (1 - Math.cos(u) / 2) * Math.cos(u) * Math.cos(v);
          z = -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
        } else {
          x = 3 * Math.cos(u) * (1 + Math.sin(u)) + 2 * (1 - Math.cos(u) / 2) * Math.cos(v + Math.PI);
          z = -8 * Math.sin(u);
        }
        const y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v);
        pts[i][j] = [x * 0.19, y * 0.19, z * 0.19];
      }
    }
    return pts;
  }

  function buildMobius() {
    const U = 40, V = 12, R = 1.8, W = 0.55, pts = [];
    for (let i = 0; i <= U; i++) {
      pts[i] = [];
      const u = (i / U) * Math.PI * 2;
      for (let j = 0; j <= V; j++) {
        const v = -W + (2 * W * j) / V;
        pts[i][j] = [
          (R + v * Math.cos(u / 2)) * Math.cos(u),
          (R + v * Math.cos(u / 2)) * Math.sin(u),
          v * Math.sin(u / 2)
        ];
      }
    }
    return pts;
  }

  const TORUS = buildTorus();
  const KLEIN = buildKlein();
  const MOBIUS = buildMobius();

  /* ---- Glowing wireframe: project once, stroke twice ---- */
  function drawSurface(grid, rot, cx, cy, scale, lineRGB, dotRGB, glowRGB) {
    const U = grid.length - 1, V = grid[0].length - 1;
    const proj = [];
    for (let i = 0; i <= U; i++) {
      proj[i] = [];
      for (let j = 0; j <= V; j++) {
        const [rx, ry, rz] = rot(grid[i][j][0], grid[i][j][1], grid[i][j][2]);
        const k = scale / (8 - rz);
        proj[i][j] = { x: cx + rx * k, y: cy + ry * k, d: rz };
      }
    }

    // Soft halo behind the surface
    const halo = ctx.createRadialGradient(cx, cy, scale * 0.05, cx, cy, scale * 0.75);
    halo.addColorStop(0, "rgba(" + glowRGB + ",0.05)");
    halo.addColorStop(1, "rgba(" + glowRGB + ",0)");
    ctx.fillStyle = halo;
    ctx.fillRect(cx - scale, cy - scale, scale * 2, scale * 2);

    // Pass 1: wide glow lines
    ctx.lineWidth = 2.5;
    for (let i = 0; i < U; i++) {
      for (let j = 0; j < V; j++) {
        const p = proj[i][j], pu = proj[i + 1][j], pv = proj[i][j + 1];
        const a = Math.max(0.10, Math.min(0.55, 0.28 + p.d * 0.09)) * 0.30;
        ctx.strokeStyle = "rgba(" + lineRGB + "," + a.toFixed(3) + ")";
        ctx.beginPath();
        ctx.moveTo(p.x, p.y); ctx.lineTo(pu.x, pu.y);
        ctx.moveTo(p.x, p.y); ctx.lineTo(pv.x, pv.y);
        ctx.stroke();
      }
    }

    // Pass 2: crisp core lines
    ctx.lineWidth = 0.8;
    for (let i = 0; i < U; i++) {
      for (let j = 0; j < V; j++) {
        const p = proj[i][j], pu = proj[i + 1][j], pv = proj[i][j + 1];
        const a = Math.max(0.14, Math.min(0.65, 0.30 + p.d * 0.10));
        ctx.strokeStyle = "rgba(" + lineRGB + "," + a.toFixed(3) + ")";
        ctx.beginPath();
        ctx.moveTo(p.x, p.y); ctx.lineTo(pu.x, pu.y);
        ctx.moveTo(p.x, p.y); ctx.lineTo(pv.x, pv.y);
        ctx.stroke();
      }
    }

    // Vertex lights
    for (let i = 0; i <= U; i++) {
      for (let j = 0; j <= V; j++) {
        if ((i + j) % 4 !== 0) continue;
        const p = proj[i][j];
        const a = Math.min(0.85, Math.max(0.15, 0.35 + p.d * 0.12));
        const r = Math.max(0.6, 1 + (p.d + 1.5) * 0.35);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + dotRGB + "," + (a * 0.12).toFixed(3) + ")";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + dotRGB + "," + a.toFixed(3) + ")";
        ctx.fill();
      }
    }
  }

  /* ---- Star field ---- */
  let stars = [];
  function initStars() {
    stars = [];
    const n = Math.round((w * h) / 16000);
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.3 + Math.random() * 1.2,
        alpha: 0.15 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
        speed: 0.005 + Math.random() * 0.015
      });
    }
  }

  function drawStars() {
    for (const s of stars) {
      const flicker = s.alpha + Math.sin(time * s.speed + s.phase) * 0.12;
      const dist = Math.hypot(mouse.x - s.x, mouse.y - s.y);
      const boost = dist < 200 ? (1 - dist / 200) * 0.4 : 0;
      const a = Math.min(1, Math.max(0.05, flicker + boost));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(200,220,240," + a.toFixed(3) + ")";
      ctx.fill();
      if (s.r > 0.9) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(168,230,230," + (a * 0.10).toFixed(3) + ")";
        ctx.fill();
      }
    }
  }

  /* ---- Floating particles with links ---- */
  let particles = [];
  function initParticles() {
    particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: 1 + Math.random() * 1.8,
        alpha: 0.05 + Math.random() * 0.10,
        color: Math.random() > 0.5 ? "168,230,230" : "244,217,160"
      });
    }
  }

  function drawParticles() {
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + p.color + "," + p.alpha.toFixed(3) + ")";
      ctx.fill();
    }
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 14400) {
          const a = 0.035 * (1 - Math.sqrt(d2) / 120);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = "rgba(168,230,230," + a.toFixed(4) + ")";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  /* ---- Math symbol rain (kept from v1, with glow) ---- */
  let mathRain = [];
  const mathSymbols = ["∫", "∂", "∇", "∑", "∞", "Δ", "Ω", "Φ", "Ψ", "π", "λ", "μ", "⊗", "⊕", "∧", "∨"];

  function initMathRain() {
    mathRain = [];
    for (let i = 0; i < 26; i++) {
      mathRain.push({
        x: Math.random() * w,
        y: Math.random() * h,
        speed: 0.3 + Math.random() * 0.6,
        size: 14 + Math.floor(Math.random() * 10),
        symbol: mathSymbols[Math.floor(Math.random() * mathSymbols.length)],
        drift: (Math.random() - 0.5) * 0.25,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.10 + Math.random() * 0.16
      });
    }
  }

  function drawMathRain() {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const r of mathRain) {
      const dx = mouse.x - r.x, dy = mouse.y - r.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 150 && dist > 0.001) {
        r.x -= (dx / dist) * (1 - dist / 150) * 1.1;
        r.y -= (dy / dist) * (1 - dist / 150) * 1.1;
      }
      r.y += r.speed;
      r.x += Math.sin(time * 0.012 + r.phase) * r.drift;
      if (r.y > h + 24) { r.y = -24; r.x = Math.random() * w; }
      if (r.x < -24) r.x = w + 24;
      if (r.x > w + 24) r.x = -24;

      const a = r.alpha + Math.sin(time * 0.018 + r.phase) * 0.05;
      ctx.font = "400 " + r.size + "px Georgia";
      ctx.shadowColor = "rgba(244,217,160,0.8)";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "rgba(244,217,160," + Math.max(0.03, a).toFixed(3) + ")";
      ctx.fillText(r.symbol, r.x, r.y);
    }
    ctx.shadowBlur = 0;
  }

  /* ---- Backdrop layers ---- */
  function drawBackground() {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#060d14");
    grad.addColorStop(0.4, "#0a1620");
    grad.addColorStop(0.7, "#0f1e2e");
    grad.addColorStop(1, "#0b1520");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(168,230,230,0.025)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < w; x += 60) {
      ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 60) {
      ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(w, y + 0.5); ctx.stroke();
    }
  }

  function drawAmbientGlow() {
    const off = scrollY * 0.1;
    const g1 = ctx.createRadialGradient(w * 0.35, h * 0.35 - off, 0, w * 0.35, h * 0.35 - off, Math.min(w, h) * 0.5);
    g1.addColorStop(0, "rgba(168,230,230,0.06)");
    g1.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, w, h);

    const g2 = ctx.createRadialGradient(w * 0.75, h * 0.65 - off, 0, w * 0.75, h * 0.65 - off, Math.min(w, h) * 0.4);
    g2.addColorStop(0, "rgba(244,217,160,0.04)");
    g2.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, w, h);
  }

  function drawCursorLight() {
    if (mouse.x < 0) return;
    const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 260);
    g.addColorStop(0, "rgba(168,230,230,0.045)");
    g.addColorStop(0.5, "rgba(168,230,230,0.015)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  function drawVignette() {
    const g = ctx.createRadialGradient(w * 0.5, h * 0.5, Math.min(w, h) * 0.2, w * 0.5, h * 0.5, Math.max(w, h) * 0.75);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.45)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  /* ---- Main loop ---- */
  function render() {
    time++;
    ctx.clearRect(0, 0, w, h);
    drawBackground();
    drawAmbientGlow();
    drawStars();
    drawParticles();
    drawCursorLight();

    const s = Math.min(w, h);
    const off = scrollY * 0.12;

    drawSurface(TORUS, makeRotator(0.72 + time * 0.005, 0.55 + time * 0.007, 0.08),
      w * 0.24, h * 0.30 - off, s * 0.55, "168,230,230", "244,217,160", "168,230,230");
    drawSurface(KLEIN, makeRotator(0.34 + time * 0.006, -0.78 + time * 0.005, -0.18),
      w * 0.78, h * 0.36 - off, s * 0.80, "244,217,160", "168,230,230", "244,217,160");
    drawSurface(MOBIUS, makeRotator(1.05, -0.25 - time * 0.003, 0.12),
      w * 0.50, h * 0.76 - off, s * 0.50, "168,230,230", "244,217,160", "168,230,230");

    drawMathRain();
    drawVignette();
    requestAnimationFrame(render);
  }

  /* ---- Scroll reveal ---- */
  function initScrollReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(el => el.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    els.forEach(el => io.observe(el));
  }

  /* ---- Events ---- */
  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    initStars();
    initMathRain();
  }

  window.addEventListener("resize", resize);
  window.addEventListener("scroll", () => { scrollY = window.scrollY; }, { passive: true });
  window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    const glow = document.getElementById("cursor-glow");
    if (glow) { glow.style.left = e.clientX + "px"; glow.style.top = e.clientY + "px"; }
  });

  resize();
  initParticles();
  initScrollReveal();
  render();
})();
