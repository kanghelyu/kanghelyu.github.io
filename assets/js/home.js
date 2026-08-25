/* Kanghe Lyu site — homepage language and reveal behavior */
(function () {
  "use strict";

  const translations = {
    en: {
      name: "Kanghe Lyu",
      eyebrow: "MATHEMATICS · GEOMETRY · REPRESENTATION THEORY",
      subtitle: "B.Sc. in Mathematics, Sichuan University (2022–2026)\nPh.D. candidate at SUSTech SICM (2026–)",
      navResearch: "Research",
      navExperience: "Experience",
      navContact: "Contact",
      introP1: "My interests lie in representation theory, noncommutative geometry, mathematical physics, and algebraic geometry.",
      introP2: "I will begin my Ph.D. study at the Southern University of Science and Technology in 2026, advised by Prof. Vyacheslav Futorny.",
      introP3: "This page contains my personal information, curriculum vitae, and mathematical notes or surveys.",
      interestList: "Representation theory · Noncommutative geometry · Mathematical physics · Algebraic geometry",
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
      navResearch: "研究方向",
      navExperience: "经历",
      navContact: "联系方式",
      introP1: "我的兴趣方向是表示论、非交换几何、数学物理以及代数几何。",
      introP2: "我将于 2026 年开始在南方科技大学攻读博士学位，导师为 Vyacheslav Futorny 教授。",
      introP3: "此页面用于发布我的个人信息、简历以及数学笔记或综述。",
      interestList: "表示论 · 非交换几何 · 数学物理 · 代数几何",
      expTitle: "经历",
      expP1: "2024 年 7 月 1 日至 7 月 15 日，新乌兹别克斯坦大学暑期学校（讲者：Pavel Etingof、Yuri Berest）。",
      expP2: "2025 年 7 月 6 日至 7 月 16 日，西湖大学国际数学暑期学校。",
      expP3: "2025 年 11 月 12 日至 2026 年 1 月 23 日，新乌兹别克斯坦大学访问项目。",
      expP4: "2026 年 3 月 12 日至 5 月 12 日，南方科技大学访问项目。",
      expP5: "2026 年 7 月 5 日至 7 月 19 日，四川大学数学拔尖学生暑期学校。",
      expP6: "2026 年 7 月 5 日至 7 月 19 日，莫斯科信息传输问题研究所访问项目。",
      awardsTitle: "获奖",
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

  const fieldMap = {
    "name": "name", "eyebrow": "eyebrow", "subtitle": "subtitle",
    "nav-research": "navResearch", "nav-experience": "navExperience", "nav-contact": "navContact",
    "intro-p1": "introP1", "intro-p2": "introP2", "intro-p3": "introP3", "interest-list": "interestList",
    "exp-title": "expTitle", "exp-p1": "expP1", "exp-p2": "expP2", "exp-p3": "expP3", "exp-p4": "expP4", "exp-p5": "expP5", "exp-p6": "expP6",
    "awards-title": "awardsTitle", "awards-p1": "awardsP1", "awards-p2": "awardsP2", "awards-p3": "awardsP3", "awards-p4": "awardsP4", "awards-p5": "awardsP5", "awards-p6": "awardsP6", "awards-p7": "awardsP7",
    "contact-title": "contactTitle", "contact-lead": "contactLead", "footer": "footer",
    "btn-email": "btnEmail", "btn-notes": "btnNotes", "btn-projects": "btnApps", "btn-cv": "btnCV"
  };

  function applyPageLanguage(lang) {
    const current = translations[lang] || translations.en;
    Object.keys(fieldMap).forEach((id) => {
      const element = document.getElementById(id);
      if (element) element.textContent = current[fieldMap[id]];
    });
    document.title = `${current.name} — Mathematics`;
  }

  KangheSite.init(applyPageLanguage);

  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const elements = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

  elements.forEach((element) => observer.observe(element));
})();
