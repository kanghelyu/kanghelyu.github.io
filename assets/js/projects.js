/* ============================================================
   Kanghe Lyu site — projects.js
   Projects page translations only.
   Shared language/music runtime lives in assets/js/site.js.
   ============================================================ */

(function () {
  "use strict";

  const translations = {
      en: {
        pageTitle: "Projects | Kanghe Lyu",
        back: "\u2190 Back to Home",
        eyebrow: "TOOLS & PROJECTS",
        title: "Projects",
        intro: "A collection of tools and web apps I have built.",
        descDark: "A dark mode reader for The Stacks Project \u2014 the open-source textbook on algebraic geometry. Injects a toggle button, supports system preference, keyboard shortcut, and persists across pages.",
        descQinghe: "QingHe Ledger \u2014 A local-first, privacy-focused bilingual (Chinese/English) ledger app. No ads, no network required. Built with SwiftUI.",
        btnDarkLanding: "Landing Page",
        btnDarkGH: "GitHub",
        btnQingheAPK: "Download APK",
        btnQingheGH: "GitHub",
        footer: "TOOLS \u00b7 PROJECTS \u00b7 SOFTWARE"
      },
      zh: {
        pageTitle: "项目 | 吕康禾",
        back: "\u2190 返回主页",
        eyebrow: "工具与项目",
        title: "项目",
        intro: "我开发的一些工具和网页应用。",
        descDark: "Stacks Project 深色模式阅读器。一键切换、支持系统偏好、快捷键，跨页面保持状态。",
        descQinghe: "青禾记账 — 本地优先、隐私友好的双语记账 App。无广告、无需网络，纯 SwiftUI 构建。",
        btnDarkLanding: "入口页面",
        btnDarkGH: "GitHub",
        btnQingheAPK: "下载 APK",
        btnQingheGH: "GitHub",
        footer: "工具 · 项目 · 软件"
      }
    };

  function applyPageLanguage(lang) {
    const t = translations[lang];

    document.title = t.pageTitle;

    document.getElementById("back-link").textContent = t.back;
    document.getElementById("eyebrow").textContent = t.eyebrow;
    document.getElementById("title").textContent = t.title;
    document.getElementById("intro").textContent = t.intro;
    document.getElementById("footer").textContent = t.footer;

    document.getElementById("desc-dark").textContent = t.descDark;
    document.getElementById("desc-qinghe").textContent = t.descQinghe;
    document.getElementById("btn-dark-landing").textContent = t.btnDarkLanding;
    document.getElementById("btn-dark-gh").textContent = t.btnDarkGH;
    document.getElementById("btn-qinghe-apk").textContent = t.btnQingheAPK;
    document.getElementById("btn-qinghe-gh").textContent = t.btnQingheGH;
  }

  KangheSite.init(applyPageLanguage);
})();
