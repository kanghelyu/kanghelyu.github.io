/* ============================================================
   Stacks Project — Dark Mode (standalone injection)
   ============================================================
   This script is designed to be injected into any Stacks Project
   page via bookmarklet, browser console, or userscript.

   Usage:
     var s = document.createElement('script');
     s.src = 'https://kanghelyu.github.io/stacks-dark/dark-mode.js';
     document.body.appendChild(s);

   Or simply drag the bookmarklet to your browser bar.
   ============================================================ */

(function () {
  'use strict';

  // Guard: only run on Stacks Project pages
  if (!window.location.hostname.includes('stacks.math.columbia.edu') &&
      !window.location.hostname.includes('stacks-project')) {
    console.warn('[Stacks Dark] Not a Stacks Project page — aborting.');
    return;
  }

  // Guard: run only once
  if (window.__stacksDarkLoaded) return;
  window.__stacksDarkLoaded = true;

  var STORAGE_KEY = 'stacks-dark-mode';
  var DARK_CLASS  = 'dark';

  /* ----- helpers ------------------------------------------------------ */

  function getStored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (_) { return null; }
  }

  function setStored(val) {
    try { localStorage.setItem(STORAGE_KEY, val); } catch (_) {}
  }

  function systemPrefersDark() {
    return window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function isDark() {
    return document.documentElement.classList.contains(DARK_CLASS);
  }

  function applyDark(dark) {
    document.documentElement.classList.toggle(DARK_CLASS, dark);
    var cb = document.getElementById('stacks-dark-cb');
    if (cb) cb.checked = dark;
  }

  /* ----- inject the toggle button into the nav ------------------------- */

  function injectToggle() {
    var nav = document.querySelector('ul#quicklinks');
    if (!nav) return;
    if (document.getElementById('stacks-dark-toggle')) return;

    var li = document.createElement('li');
    li.id = 'stacks-dark-toggle';
    li.style.cssText = 'display:inline-flex;align-items:center;margin-left:8px;cursor:pointer;';

    var label = document.createElement('label');
    label.title = 'Toggle dark mode';
    label.style.cssText = 'display:inline-flex;align-items:center;gap:4px;cursor:pointer;user-select:none;';

    var cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.id = 'stacks-dark-cb';
    cb.checked = isDark();
    cb.style.cssText =
      'appearance:none;-webkit-appearance:none;width:32px;height:18px;' +
      'background-color:#ccc;border-radius:9px;position:relative;cursor:pointer;' +
      'transition:background-color 0.3s ease;flex-shrink:0;margin:0;';
    cb.addEventListener('change', function () {
      applyDark(cb.checked);
      setStored(cb.checked ? '1' : '0');
    });

    // slider knob
    var knob = document.createElement('span');
    knob.style.cssText =
      'position:absolute;top:2px;left:2px;width:14px;height:14px;' +
      'background-color:white;border-radius:50%;transition:transform 0.3s ease;' +
      'box-shadow:0 1px 3px rgba(0,0,0,0.3);pointer-events:none;';
    cb.appendChild(knob);

    var span = document.createElement('span');
    span.style.cssText = 'font-size:0.9rem;line-height:1;';
    function updateLabel() { span.textContent = isDark() ? '\u2600\uFE0F' : '\uD83C\uDF19'; }
    updateLabel();
    cb.addEventListener('change', updateLabel);

    // Extra style for dark state on the checkbox
    var styleEl = document.createElement('style');
    styleEl.textContent =
      'html.dark #stacks-dark-cb { background-color: #63b3ed !important; } ' +
      'html.dark #stacks-dark-cb span { transform: translateX(14px); }';
    document.head.appendChild(styleEl);

    label.appendChild(cb);
    label.appendChild(span);
    li.appendChild(label);
    nav.appendChild(li);
  }

  /* ----- keyboard shortcut: Ctrl/Cmd + Shift + D ----------------------- */

  function addKeyboardShortcut() {
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        var newState = !isDark();
        applyDark(newState);
        setStored(newState ? '1' : '0');
      }
    });
  }

  /* ----- post-render fix for MathJax 2 + XyJax ------------------------- */

  function fixMathJaxColors() {
    if (!isDark()) return;
    // MathJax 2 typesets into div.equation containers.  XyJax generates deeply
    // nested spans with inline color/border.  Force-cascade from outside.
    document.querySelectorAll('div.equation, span.MathJax, span.MathJax_Display')
      .forEach(function (container) {
        container.querySelectorAll('*').forEach(function (el) {
          el.style.setProperty('color', '#e0e0e0', 'important');
          var bc = el.style.getPropertyValue('border-color');
          if (bc && bc !== 'transparent' && bc !== 'initial') {
            el.style.setProperty('border-color', '#2d3748', 'important');
          }
        });
      });
  }

  /* ----- re-run fix whenever MathJax finishes a typeset pass ------------- */

  function hookMathJax() {
    if (!window.MathJax || !MathJax.Hub) {
      // MathJax may not be loaded yet — retry
      setTimeout(hookMathJax, 500);
      return;
    }
    MathJax.Hub.Register.StartupHook('End', fixMathJaxColors);
    MathJax.Hub.Register.MessageHook('Rerender', fixMathJaxColors);
    // Also catch individual element re-renders
    MathJax.Hub.Register.MessageHook('New Math', function () {
      setTimeout(fixMathJaxColors, 200);
    });
  }

  /* ----- also fix after a short delay (safety net) ----------------------- */

  function init() {
    var stored = getStored();
    if (stored !== null) {
      applyDark(stored === '1');
    } else {
      applyDark(systemPrefersDark());
    }

    injectToggle();
    addKeyboardShortcut();

    // Fix MathJax colors after initial render
    setTimeout(fixMathJaxColors, 1000);
    hookMathJax();

    // React to system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', function (e) {
          if (getStored() === null) applyDark(e.matches);
        });
    }
  }

  // Run immediately (script is loaded after DOM exists when injected)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();