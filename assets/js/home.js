/* ============================================================
   Kanghe Lyu site — home.js
   Homepage translations + scroll reveal.
   Shared math background lives in assets/js/bg.js (all pages).
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

  /* ---- Scroll reveal ---- */
  (function initScrollReveal() {
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
  })();
})();
