/* Kanghe Lyu site — homepage content and scroll behavior */
(function () {
  "use strict";

  const translations = {
    en: {
      name: "Kanghe Lyu",
      eyebrow: "MATHEMATICS · GEOMETRY · REPRESENTATION THEORY",
      subtitle: "B.Sc. in Mathematics, Sichuan University (2022–2026)\nPh.D. candidate at SUSTech SICM (2026–)",
      heroStatus: "Researcher · SUSTech SICM · Shenzhen",
      navResearch: "Research",
      navExperience: "Experience",
      navContact: "Contact",
      introP1: "My interests lie in representation theory, noncommutative geometry, mathematical physics, and algebraic geometry.",
      introP2: "I will begin my Ph.D. study at the Southern University of Science and Technology in 2026, advised by Prof. Vyacheslav Futorny.",
      introP3: "This page contains my personal information, curriculum vitae, and mathematical notes or surveys.",
      focus1Title: "Representation theory",
      focus1Text: "Structure, symmetries, and the languages used to describe them.",
      focus2Title: "Noncommutative geometry",
      focus2Text: "Geometry where algebra becomes the primary coordinate system.",
      focus3Title: "Mathematical physics",
      focus3Text: "Connections between rigorous structures and physical intuition.",
      focus4Title: "Algebraic geometry",
      focus4Text: "Spaces, invariants, and the geometry hidden in equations.",
      musicNote: "Use the music control to listen to AI music created to accompany this visual language.",
      expTitle: "Experience",
      expP1: "Summer School at New Uzbekistan University (Speakers: Pavel Etingof, Yuri Berest), 01/07/2024 – 15/07/2024.",
      expP2: "International Mathematics Summer School at Westlake University, 06/07/2025 – 16/07/2025.",
      expP3: "Visiting Program at New Uzbekistan University, 12/11/2025 – 23/01/2026.",
      expP4: "Visiting Program at SUSTech, 12/03/2026 – 12/05/2026.",
      expP5: "Summer School for Outstanding Mathematics Students, Sichuan University, 05/07/2026 – 19/07/2026.",
      expP6: "Visiting Program at Institute for Problems of Information Transmission, Moscow, 05/07/2026 – 19/07/2026.",
      awardsTitle: "Awards & projects",
      awardsP1: "Contemporary Undergraduate Mathematical Contest in Modeling, National Second Prize.",
      awardsP2: "College Students' Innovative Entrepreneurial Training Plan Program, National Level.",
      awardsP3: "Sichuan University Comprehensive First-Class Scholarship (Top 5%), 2023–2024.",
      awardsP4: "Outstanding Undergraduate Student, Sichuan University, 2023–2024.",
      awardsP5: "Outstanding Student Cadre, Sichuan University, 2022–2023.",
      awardsP6: "Sichuan Provincial Comprehensive Quality Class A Certificate, 12/2024.",
      awardsP7: "Sichuan University Outstanding Graduate, 10/2025.",
      contactTitle: "Contact",
      contactLead: "For mathematical conversation, collaboration, or a thoughtful exchange, write to:",
      footer: "GEOMETRY · REPRESENTATION THEORY · MATHEMATICAL PHYSICS",
      btnEmail: "Email",
      btnNotes: "Notes",
      btnApps: "Apps",
      btnCV: "CV"
    },
    zh: {
      name: "吕康禾",
      eyebrow: "数学 · 几何 · 表示论",
      subtitle: "四川大学数学学士（2022–2026）\n南方科技大学深圳国际数学中心博士生（2026–）",
      heroStatus: "研究者 · 南方科技大学深圳国际数学中心 · 深圳",
      navResearch: "研究方向",
      navExperience: "经历",
      navContact: "联系方式",
      introP1: "我的兴趣方向是表示论、非交换几何、数学物理以及代数几何。",
      introP2: "我将于 2026 年开始在南方科技大学攻读博士学位，导师为 Vyacheslav Futorny 教授。",
      introP3: "此页面用于发布我的个人信息、简历以及数学笔记或综述。",
      focus1Title: "表示论",
      focus1Text: "研究结构、对称性，以及描述它们的语言。",
      focus2Title: "非交换几何",
      focus2Text: "当代数成为主要坐标系统时，几何如何展开。",
      focus3Title: "数学物理",
      focus3Text: "连接严谨的数学结构与物理直觉。",
      focus4Title: "代数几何",
      focus4Text: "研究空间、不变量，以及方程中隐藏的几何。",
      musicNote: "使用音乐控制，聆听我为这套视觉语言创作的 AI 音乐。",
      expTitle: "经历",
      expP1: "2024 年 7 月 1 日至 7 月 15 日，新乌兹别克斯坦大学暑期学校（讲者：Pavel Etingof、Yuri Berest）。",
      expP2: "2025 年 7 月 6 日至 7 月 16 日，西湖大学国际数学暑期学校。",
      expP3: "2025 年 11 月 12 日至 2026 年 1 月 23 日，新乌兹别克斯坦大学访问项目。",
      expP4: "2026 年 3 月 12 日至 5 月 12 日，南方科技大学访问项目。",
      expP5: "2026 年 7 月 5 日至 7 月 19 日，四川大学数学拔尖学生暑期学校。",
      expP6: "2026 年 7 月 5 日至 7 月 19 日，莫斯科信息传输问题研究所访问项目。",
      awardsTitle: "获奖与项目",
      awardsP1: "全国大学生数学建模竞赛国家二等奖。",
      awardsP2: "大学生创新创业训练计划项目国家级结项。",
      awardsP3: "四川大学综合一等奖学金（前 5%），2023–2024。",
      awardsP4: "四川大学优秀学生，2023–2024。",
      awardsP5: "四川大学优秀学生干部，2022–2023。",
      awardsP6: "四川省综合素质 A 级证书，2024 年 12 月。",
      awardsP7: "四川大学优秀毕业生，2025 年 10 月。",
      contactTitle: "联系方式",
      contactLead: "如需数学交流、合作或分享想法，欢迎写信：",
      footer: "几何 · 表示论 · 数学物理",
      btnEmail: "邮件",
      btnNotes: "笔记",
      btnApps: "应用",
      btnCV: "简历"
    }
  };

  const ids = [
    "name", "eyebrow", "subtitle", "hero-status", "nav-research", "nav-experience", "nav-contact",
    "intro-p1", "intro-p2", "intro-p3", "focus-1-title", "focus-1-text", "focus-2-title", "focus-2-text",
    "focus-3-title", "focus-3-text", "focus-4-title", "focus-4-text", "music-note", "exp-title", "exp-p1",
    "exp-p2", "exp-p3", "exp-p4", "exp-p5", "exp-p6", "awards-title", "awards-p1", "awards-p2",
    "awards-p3", "awards-p4", "awards-p5", "awards-p6", "awards-p7", "contact-title", "contact-lead",
    "footer", "btn-email", "btn-notes", "btn-projects", "btn-cv"
  ];

  function applyPageLanguage(lang) {
    const t = translations[lang] || translations.en;
    ids.forEach((id) => {
      const element = document.getElementById(id);
      const key = id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      if (element && Object.prototype.hasOwnProperty.call(t, key)) element.textContent = t[key];
    });
    document.title = `${t.name} — Mathematics`;
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }

  KangheSite.init(applyPageLanguage);

  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealElements = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("visible"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -44px 0px" });
    revealElements.forEach((element) => observer.observe(element));
  }
})();
