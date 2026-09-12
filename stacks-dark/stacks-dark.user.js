// ==UserScript==
// @name         Stacks Project — Dark Mode
// @namespace    https://kanghelyu.org/stacks-dark/
// @version      1.0.0
// @description  Dark mode for the Stacks Project: a header switch, Ctrl/Cmd+Shift+D, and a remembered choice.
// @author       Kanghe Lyu
// @match        https://stacks.math.columbia.edu/*
// @run-at       document-idle
// @grant        none
// @homepageURL  https://kanghelyu.org/stacks-dark/
// ==/UserScript==

/*
 * Loads the same stylesheet and injector the bookmarklet uses.  A userscript
 * runs on every matching page by itself, so dark mode applies without a click
 * — handy when a javascript: bookmark is awkward, or when the browser refuses
 * to run one.
 *
 * The CDN URLs are pinned to a commit SHA on purpose: jsDelivr caches branch
 * refs per edge node for up to 12h and the browser then keeps the response for
 * max-age=604800, so a @main URL can serve a stale copy.  A SHA is immutable,
 * so every edge returns identical bytes.
 *
 * After changing dark-mode.js or dark-mode.css, bump SHA below.
 */
(function () {
  'use strict';

  var SHA = 'db1add94eb02e94f8764c63e42ce2763a2e8148a';
  var BASE = 'https://cdn.jsdelivr.net/gh/kanghelyu/kanghelyu.github.io@' + SHA + '/stacks-dark/';

  // The injector is idempotent, but skip the work entirely if it is already in.
  if (window.__stacksDarkLoaded) return;

  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = BASE + 'dark-mode.css';
  document.head.appendChild(link);

  var script = document.createElement('script');
  script.src = BASE + 'dark-mode.js';
  document.body.appendChild(script);
})();
