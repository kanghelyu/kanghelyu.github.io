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
        descDflow: "A Markdown-first visual workflow editor for DeepSeek Harness — canvas, logic gates, topology review, and one-sentence workflow building.",
        descAflow: "Markdown-first step workflows with deterministic logic gates, a zero-dependency CLI, a visual Studio canvas and a desktop pet — for any coding agent (ZCode / Claude Code / Codex CLI).",
        btnAflowSite: "Website",
        btnAflowGH: "GitHub",
        btnDflowSite: "Website",
        btnDflowGH: "GitHub",
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
        descDflow: "DeepSeek Flow — 面向 DeepSeek Harness 的 Markdown 优先可视化工作流编辑器：画布连线、逻辑门、拓扑审查、一句话构建工作流。",
        descAflow: "AgentFlow（af）— Markdown 优先的分步工作流：确定性逻辑门 + 零依赖 CLI + 可视化 Studio 画布 + 桌面宠物窗，适用于任何编码代理（ZCode / Claude Code / Codex CLI）。",
        btnAflowSite: "官网",
        btnAflowGH: "GitHub",
        btnDflowSite: "官网",
        btnDflowGH: "GitHub",
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
    document.getElementById("desc-dflow").textContent = t.descDflow;
    document.getElementById("desc-aflow").textContent = t.descAflow;
    document.getElementById("btn-aflow-site").textContent = t.btnAflowSite;
    document.getElementById("btn-aflow-gh").textContent = t.btnAflowGH;
    document.getElementById("btn-dflow-site").textContent = t.btnDflowSite;
    document.getElementById("btn-dflow-gh").textContent = t.btnDflowGH;
    document.getElementById("btn-dark-landing").textContent = t.btnDarkLanding;
    document.getElementById("btn-dark-gh").textContent = t.btnDarkGH;
    document.getElementById("btn-qinghe-apk").textContent = t.btnQingheAPK;
    document.getElementById("btn-qinghe-gh").textContent = t.btnQingheGH;
  }

  KangheSite.init(applyPageLanguage);
})();
