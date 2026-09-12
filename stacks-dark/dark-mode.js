/* ============================================================
   Stacks Project — Dark Mode (standalone injection)
   ============================================================
   Injected into any Stacks Project page via bookmarklet, browser
   console, or userscript.

   Usage:
     var s = document.createElement('script');
     s.src = 'https://kanghelyu.github.io/stacks-dark/dark-mode.js';
     document.body.appendChild(s);

   Behaviour
     • The first run switches the page to dark and installs a switch
       in the header. The switch sits outside ul#quicklinks, which the
       Stacks stylesheet hides below 992px, so it stays reachable at
       every viewport width.
     • Clicking the bookmarklet again toggles instead of re-injecting:
       the script publishes window.__stacksDarkToggle(), and the
       re-entry guard below turns a second load into a toggle.
     • Ctrl/Cmd+Shift+D toggles at any time.
     • The choice is stored in localStorage and re-applied on the next
       Stacks page.
   ============================================================ */

(function () {
  'use strict';

  /* ----- host guard --------------------------------------------------- */

  var host = window.location.hostname;
  var ON_STACKS =
    host.indexOf('stacks.math.columbia.edu') !== -1 ||
    host.indexOf('stacks-project') !== -1 ||
    host === 'localhost' || host === '127.0.0.1';

  if (!ON_STACKS) {
    console.warn('[Stacks Dark] Not a Stacks Project page — aborting.');
    return;
  }

  /* ----- re-entry: a second bookmarklet click is a toggle ------------- */

  if (window.__stacksDarkLoaded) {
    if (typeof window.__stacksDarkToggle === 'function') {
      window.__stacksDarkToggle();
    }
    return;
  }
  window.__stacksDarkLoaded = true;

  var STORAGE_KEY = 'stacks-dark-mode';
  var DARK_CLASS  = 'dark';
  var MATH_COLOR  = '#e0e0e0';
  var HUD_MS      = 1400;

  /* ----- preference --------------------------------------------------- */

  function getStored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (_) { return null; }
  }

  function setStored(val) {
    try { localStorage.setItem(STORAGE_KEY, val); } catch (_) {}
  }

  function isDark() {
    return document.documentElement.classList.contains(DARK_CLASS);
  }

  /* ----- equation colours --------------------------------------------- */
  /* The blanket !important cascade in dark-mode.css cannot reach inline
     colours emitted by MathJax, so they are patched element by element.
     Every patch is recorded together with the element's previous style
     attribute: leaving dark mode must put the original markup back, or
     maths stays light grey on a white page. */

  var patched = [];

  function isInsideSvg(el) {
    var tag = el.tagName ? el.tagName.toLowerCase() : '';
    return tag === 'svg' || el.ownerSVGElement != null;
  }

  function patchMathColors() {
    if (!isDark()) return;

    var roots = document.querySelectorAll(
      'div.equation, .MathJax, .MathJax_Display, .MathJax_SVG'
    );
    if (!roots.length) return;

    Array.prototype.forEach.call(roots, function (root) {
      var isEquation =
        root.matches('div.equation') ||
        (root.closest && root.closest('div.equation') != null);

      var nodes = [root].concat(Array.prototype.slice.call(root.querySelectorAll('*')));
      nodes.forEach(function (el) {
        if (el.__stacksDarkPatched) return;
        el.__stacksDarkPatched = true;

        patched.push({ el: el, cssText: el.getAttribute('style') });

        el.style.setProperty('color', MATH_COLOR, 'important');
        el.style.setProperty('border-color', MATH_COLOR, 'important');
        if (isEquation && !isInsideSvg(el)) {
          el.style.setProperty('background-color', 'transparent', 'important');
        }
      });
    });
  }

  function unpatchMathColors() {
    for (var i = 0; i < patched.length; i += 1) {
      var entry = patched[i];
      try {
        if (entry.cssText === null || entry.cssText === undefined) {
          entry.el.removeAttribute('style');
        } else {
          entry.el.setAttribute('style', entry.cssText);
        }
      } catch (_) { /* element may have been replaced by a re-typeset */ }
      entry.el.__stacksDarkPatched = false;
    }
    patched = [];
  }

  /* ----- transient feedback ------------------------------------------- */
  /* A silent switch reads as a broken one, so every toggle announces
     itself. Styled inline: the hint must appear even if the stylesheet
     is blocked or still in flight. */

  var hudTimer = 0;

  function showHud(dark) {
    var hud = document.getElementById('stacks-dark-hud');
    if (!hud) {
      hud = document.createElement('div');
      hud.id = 'stacks-dark-hud';
      hud.setAttribute('aria-live', 'polite');
      hud.style.cssText =
        'position:fixed;left:50%;bottom:24px;transform:translateX(-50%) translateY(8px);' +
        'z-index:2147483647;padding:8px 16px;border-radius:999px;' +
        'font:600 13px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
        'background:rgba(22,33,62,.96);color:#e2e8f0;border:1px solid #2d3748;' +
        'box-shadow:0 6px 24px rgba(0,0,0,.45);pointer-events:none;' +
        'opacity:0;transition:opacity .22s ease,transform .22s ease;';
      document.body.appendChild(hud);
    }
    hud.textContent = dark ? '\uD83C\uDF19  Dark mode on' : '\u2600\uFE0F  Dark mode off';
    // Force a style flush so the transition replays on a rapid toggle.
    void hud.offsetWidth;
    hud.style.opacity = '1';
    hud.style.transform = 'translateX(-50%) translateY(0)';

    window.clearTimeout(hudTimer);
    hudTimer = window.setTimeout(function () {
      hud.style.opacity = '0';
      hud.style.transform = 'translateX(-50%) translateY(8px)';
    }, HUD_MS);
  }

  /* ----- header switch ------------------------------------------------- */

  var switchEl = null;

  function buildSwitch() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'stacks-dark-toggle';
    btn.setAttribute('role', 'switch');
    btn.title = 'Toggle dark mode (Ctrl/Cmd+Shift+D)';
    btn.style.cssText =
      'display:inline-flex;align-items:center;gap:6px;margin-left:12px;' +
      'padding:0;border:0;background:none;cursor:pointer;vertical-align:middle;' +
      'user-select:none;font:inherit;line-height:1;';

    var track = document.createElement('span');
    track.style.cssText =
      'position:relative;display:inline-block;width:34px;height:19px;' +
      'border-radius:10px;background:#b4b1a8;flex:none;' +
      'box-shadow:inset 0 0 0 1px rgba(0,0,0,.16);transition:background-color .25s ease;';

    var knob = document.createElement('span');
    knob.style.cssText =
      'position:absolute;top:2px;left:2px;width:15px;height:15px;border-radius:50%;' +
      'background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.35);' +
      'transition:transform .25s ease;';

    var emoji = document.createElement('span');
    emoji.style.cssText = 'font-size:15px;line-height:1;';

    track.appendChild(knob);
    btn.appendChild(track);
    btn.appendChild(emoji);

    btn._track = track;
    btn._knob = knob;
    btn._emoji = emoji;

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggle();
    });

    return btn;
  }

  function updateSwitch() {
    if (!switchEl) return;
    var dark = isDark();
    switchEl.setAttribute('aria-checked', dark ? 'true' : 'false');
    switchEl._track.style.backgroundColor = dark ? '#63b3ed' : '#b4b1a8';
    switchEl._knob.style.transform = dark ? 'translateX(15px)' : 'translateX(0)';
    switchEl._emoji.textContent = dark ? '\u2600\uFE0F' : '\uD83C\uDF19';
  }

  function injectSwitch() {
    if (switchEl && document.body.contains(switchEl)) {
      updateSwitch();
      return;
    }
    if (!document.body) return;

    // nav#header stays visible at every width; ul#quicklinks does not.
    var hostEl =
      document.querySelector('nav#header') ||
      document.querySelector('div#first-bar') ||
      document.querySelector('header');

    switchEl = buildSwitch();

    if (hostEl) {
      hostEl.appendChild(switchEl);
    } else {
      switchEl.style.cssText +=
        'position:fixed;top:14px;right:14px;z-index:2147483646;padding:6px 10px;' +
        'border-radius:999px;background:rgba(22,33,62,.92);';
      document.body.appendChild(switchEl);
    }
    updateSwitch();
  }

  /* ----- state transitions --------------------------------------------- */

  function applyDark(dark) {
    document.documentElement.classList.toggle(DARK_CLASS, dark);

    if (dark) {
      patchMathColors();
    } else {
      unpatchMathColors();
    }
    updateSwitch();
  }

  function toggle() {
    var next = !isDark();
    applyDark(next);
    setStored(next ? '1' : '0');
    showHud(next);
    return next;
  }

  // Consumed by the bookmarklet on every click after the first.
  window.__stacksDarkToggle = toggle;

  /* ----- keyboard shortcut: Ctrl/Cmd + Shift + D ------------------------ */

  function addKeyboardShortcut() {
    document.addEventListener('keydown', function (e) {
      var key = e.key || '';
      var isD = key === 'D' || key === 'd' || e.code === 'KeyD';
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && isD) {
        e.preventDefault();
        toggle();
      }
    });
  }

  /* ----- re-patch after MathJax typesets -------------------------------- */

  var mathJaxTries = 0;

  function hookMathJax() {
    if (!window.MathJax || !MathJax.Hub) {
      // Bounded retry: an unbounded poll would keep running on pages that
      // legitimately ship no MathJax at all.
      if (mathJaxTries >= 20) return;
      mathJaxTries += 1;
      window.setTimeout(hookMathJax, 500);
      return;
    }
    MathJax.Hub.Register.StartupHook('End', patchMathColors);
    MathJax.Hub.Register.MessageHook('Rerender', patchMathColors);
    MathJax.Hub.Register.MessageHook('New Math', function () {
      window.setTimeout(patchMathColors, 200);
    });
  }

  /* ----- boot ----------------------------------------------------------- */

  function init() {
    var stored = getStored();
    // First use is an explicit request for dark mode — the bookmarklet is
    // called "Stacks Dark" and the page promises a switch to dark. Falling
    // back to the OS theme made the very first click a no-op on a light
    // desktop, which reads as a broken feature. The stored value wins from
    // then on.
    applyDark(stored === null ? true : stored === '1');

    // Announce only a state the user just asked for. Re-applying a
    // remembered preference on a freshly opened page stays silent, so the
    // hint does not follow the reader around.
    if (stored === null) showHud(true);

    injectSwitch();
    addKeyboardShortcut();

    window.setTimeout(patchMathColors, 1000);
    hookMathJax();

    // Keep following the OS theme only while the user has not chosen.
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', function (e) {
          if (getStored() === null) applyDark(e.matches);
        });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
