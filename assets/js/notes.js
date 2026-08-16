/* ============================================================
   Kanghe Lyu site — notes.js
   Notes page translations only.
   Shared language/music runtime lives in assets/js/site.js.
   ============================================================ */

(function () {
  "use strict";

  const translations = {
      en: {
        pageTitle: "Notes | Kanghe Lyu",
        back: "← Back to Home",
        eyebrow: "MATHEMATICAL NOTES",
        title: "Notes",
        intro: "This page collects mathematical notes/surveys. Each item can be viewed directly in the browser or downloaded as a PDF.",
        sectionTitle: "Geometry and Algebra",
        viewPDF: "View PDF",
        download: "Download",
        footer: "GEOMETRY · REPRESENTATION THEORY · MATHEMATICAL PHYSICS",
        desc1: "Notes on Slodowy slices, Hamiltonian reduction and BRST cohomology.",
        desc2: "This is an on-going note.",
        desc3: "This is a hand-written Chinese note taken while learning Zhexian Wan's and Humphreys's books.",
        desc4: "This is a hand-written lecture note taken while giving seminars at New Uzbekistan University. The original knowledge comes from a course taught by Li Ren at Sichuan University.",
        desc5: "This is an on-going note.",
        desc6: "This note was taken while learning from https://zhuanlan.zhihu.com/p/550302234.",
        desc7: "Learning notes on Ion's paper, with extensive computed examples and connections to Macdonald duality."
      },
      zh: {
        pageTitle: "笔记 | 吕康禾",
        back: "← 返回主页",
        eyebrow: "数学笔记",
        title: "笔记",
        intro: "此页面收集我的数学笔记或综述。每个条目都可以直接在浏览器中查看，也可以下载 PDF。",
        sectionTitle: "几何与代数",
        viewPDF: "查看 PDF",
        download: "下载",
        footer: "几何 · 表示论 · 数学物理",
        desc1: "关于 Slodowy slices、Hamiltonian reduction 与 BRST cohomology 的笔记。",
        desc2: "这是一份仍在更新中的笔记。",
        desc3: "这是一份学习万哲先与 Humphreys 相关教材时写下的中文手写笔记。",
        desc4: "这是我在新乌兹别克斯坦大学做讨论班时写下的手写讲义，主要内容来自四川大学任丽老师的课程。",
        desc5: "这是一份仍在更新中的笔记。",
        desc6: "这份笔记是在学习 https://zhuanlan.zhihu.com/p/550302234 时写下的。",
        desc7: "学习 Ion 相关论文的笔记，包含大量计算例子并关联了 Macdonald duality。"
      }
    };

  function applyPageLanguage(lang) {
    const t = translations[lang];

    document.title = t.pageTitle;

    document.getElementById("back-link").textContent = t.back;
    document.getElementById("eyebrow").textContent = t.eyebrow;
    document.getElementById("title").textContent = t.title;
    document.getElementById("intro").textContent = t.intro;
    document.getElementById("section-title").textContent = t.sectionTitle;
    document.getElementById("footer").textContent = t.footer;

    document.getElementById("desc-1").textContent = t.desc1;
    document.getElementById("desc-2").textContent = t.desc2;
    document.getElementById("desc-3").textContent = t.desc3;
    document.getElementById("desc-4").textContent = t.desc4;
    document.getElementById("desc-5").textContent = t.desc5;
    document.getElementById("desc-6").textContent = t.desc6;
    document.getElementById("desc-7").textContent = t.desc7;

    document.querySelectorAll(".view-btn").forEach(btn => {
      btn.textContent = t.viewPDF;
    });

    document.querySelectorAll(".download-btn").forEach(btn => {
      btn.textContent = t.download;
    });
  }

  KangheSite.init(applyPageLanguage);
})();
