# Kanghe Lyu

I am a PhD student in mathematics at SUSTech.

My interests are in pure mathematics, especially geometry, representation theory, and mathematical physics. 

## Contact

Email: kanghelyu@foxmail.com

## Repository structure

```
.
├─ index.html             Homepage (content only)
├─ notes.html             Notes page (content only)
├─ projects.html          Projects page (content only)
├─ assets/
│  ├─ css/
│  │  ├─ base.css         Design tokens + fixed language/music widgets
│  │  ├─ home.css         Homepage-only layout + canvas backdrop styles
│  │  ├─ page.css         Shared subpage shell, cards and buttons
│  │  ├─ notes.css        Notes grid/card styles
│  │  └─ projects.css     Projects grid/card styles
│  └─ js/
│     ├─ site.js          Shared runtime: language switch + music player
│     ├─ home.js          Homepage translations + background canvas
│     ├─ notes.js         Notes page translations
│     └─ projects.js      Projects page translations
├─ music/                 Background music tracks
├─ notes/                 Note PDFs
├─ stacks-dark/           Stacks Project dark-mode tool
└─ cv.pdf
```

### How the modules fit together

- Every page loads `assets/js/site.js` first. It owns the cross-page
  `kanghe-site-lang` / `kanghe-site-music-state` localStorage state and the
  fixed language/music widgets.
- Each page script defines its own translations object and calls
  `KangheSite.init(applyPageLanguage)` once.
- Shared visual rules live in `assets/css/base.css`; page-specific layout
  stays in the matching page CSS file.
