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
        descQinghe: "A real-time liquid-glass expense tracker for Android. Every entry stays manual on purpose — writing it down is what makes spending feel real. 306 currencies with daily ECB rates, a glass calculator, budgets, CSV export, 8 languages; no ads, lightweight, and nothing ever leaves your phone. 15-day free trial, lifetime activation code.",
        descDflow: "A Markdown-first visual workflow editor for DeepSeek Harness — canvas, logic gates, topology review, and one-sentence workflow building.",
        descAflow: "Markdown-first step workflows with deterministic logic gates, a zero-dependency CLI, a visual Studio canvas and a desktop pet — for any coding agent (ZCode / Claude Code / Codex CLI).",
        descClick: "A local Android tap recorder and coordinate-script debugger for your own game or application. Records short taps, editable timing, and guarded replay tied to the recorded foreground package.",
        descClasslens: "A liquid-glass course schedule app for Android with AI import. Describe your timetable or attach a file and the AI fills in your week — with a preview and conflict check before anything is written. Also imports from your school's edu system, or from ICS / CSV / JSON / HTML / XLSX files. Local-first, bilingual, and your API key never leaves the device.",
        btnAflowSite: "Website",
        btnAflowGH: "GitHub",
        btnDflowSite: "Website",
        btnDflowGH: "GitHub",
        btnDarkLanding: "Landing Page",
        btnDarkGH: "GitHub",
        btnQingheAPK: "Download APK",
        btnQingheSite: "Website",
        btnClasslensSite: "Website",
        btnClasslensAPK: "Download APK",
        btnClickGH: "GitHub",
        footer: "TOOLS \u00b7 PROJECTS \u00b7 SOFTWARE"
      },
      zh: {
        pageTitle: "项目 | 吕康禾",
        back: "\u2190 返回主页",
        eyebrow: "工具与项目",
        title: "项目",
        intro: "我开发的一些工具和网页应用。",
        descDark: "Stacks Project 深色模式阅读器。一键切换、支持系统偏好、快捷键，跨页面保持状态。",
        descQinghe: "实时液态玻璃质感的 Android 记账本。刻意不做自动记账——一笔一笔亲手写下，花钱才有感觉。306 种货币每日官方汇率、玻璃计算器、预算管理、CSV 导出、8 国语言；无广告、轻量化，数据只存本机。15 天免费试用，兑换码永久激活。",
        descDflow: "DeepSeek Flow — 面向 DeepSeek Harness 的 Markdown 优先可视化工作流编辑器：画布连线、逻辑门、拓扑审查、一句话构建工作流。",
        descAflow: "AgentFlow（af）— Markdown 优先的分步工作流：确定性逻辑门 + 零依赖 CLI + 可视化 Studio 画布 + 桌面宠物窗，适用于任何编码代理（ZCode / Claude Code / Codex CLI）。",
        descClick: "click — 面向自有游戏或应用调试的本地 Android 连点录制与坐标脚本工具：支持录制短按、编辑时间，并绑定录制时的前台应用后再回放。",
        descClasslens: "课镜 — 液态玻璃质感的 Android 课程表，支持 AI 导入：用一句话描述课表或附上课表文件，AI 帮你填满一周——写入前必须预览确认、自动检查冲突。也可以从学校教务系统直接抓取，或导入 ICS / CSV / JSON / HTML / XLSX 文件。本地优先、中英双语，API key 只存在你手机里。",
        btnAflowSite: "官网",
        btnAflowGH: "GitHub",
        btnDflowSite: "官网",
        btnDflowGH: "GitHub",
        btnDarkLanding: "入口页面",
        btnDarkGH: "GitHub",
        btnQingheAPK: "下载 APK",
        btnQingheSite: "官网",
        btnClasslensSite: "官网",
        btnClasslensAPK: "下载 APK",
        btnClickGH: "GitHub",
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
    document.getElementById("desc-click").textContent = t.descClick;
    document.getElementById("desc-classlens").textContent = t.descClasslens;
    document.getElementById("btn-aflow-site").textContent = t.btnAflowSite;
    document.getElementById("btn-aflow-gh").textContent = t.btnAflowGH;
    document.getElementById("btn-dflow-site").textContent = t.btnDflowSite;
    document.getElementById("btn-dflow-gh").textContent = t.btnDflowGH;
    document.getElementById("btn-dark-landing").textContent = t.btnDarkLanding;
    document.getElementById("btn-dark-gh").textContent = t.btnDarkGH;
    document.getElementById("btn-qinghe-apk").textContent = t.btnQingheAPK;
    document.getElementById("btn-qinghe-site").textContent = t.btnQingheSite;
    document.getElementById("btn-classlens-site").textContent = t.btnClasslensSite;
    document.getElementById("btn-classlens-apk").textContent = t.btnClasslensAPK;
    document.getElementById("btn-click-gh").textContent = t.btnClickGH;
  }

  KangheSite.init(applyPageLanguage);
})();
