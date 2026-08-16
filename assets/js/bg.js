/* ============================================================
   Kanghe Lyu site — bg.js
   Shared math background for ALL pages:
     Torus / Klein bottle / Moebius strip (glow wireframe,
     Moebius boundary edges highlighted), starfield, and a
     rich drifting particle field with soft links.
   ============================================================ */

(function () {
  "use strict";

  var canvas = document.getElementById("bg");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var w = 0, h = 0, time = 0, scrollY = 0;
  var mouse = { x: -9999, y: -9999 };

  /* ============ Invisible gravitational lens ============
     Bends stars, particles and wireframes around the cursor.
     No cursor visual is drawn — plain system cursor only. */

  var LENS_R = 260;   // influence radius
  var LENS_VOID = 26; // closest approach to the unseen mass

  function warp(x, y) {
    if (mouse.x < 0) return { x: x, y: y };
    var dx = x - mouse.x, dy = y - mouse.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > LENS_R) return { x: x, y: y };
    var t = 1 - dist / LENS_R;
    var s = t * t;
    var pull = s * s * 150;
    var maxPull = Math.max(0, dist - LENS_VOID);
    if (pull > maxPull) pull = maxPull;
    var ux = dx / (dist || 1), uy = dy / (dist || 1);
    var sw = s * 22; // tangential swirl
    return { x: x - ux * pull - uy * sw, y: y - uy * pull + ux * sw };
  }

  /* ============ Rotation ============ */

  function makeRotator(ax, ay, az) {
    var ca = Math.cos(ax), sa = Math.sin(ax);
    var cy = Math.cos(ay), sy = Math.sin(ay);
    var cz = Math.cos(az), sz = Math.sin(az);
    return function (x, y, z) {
      var y1 = y * ca - z * sa, z1 = y * sa + z * ca;
      var x2 = x * cy + z1 * sy, z2 = -x * sy + z1 * cy;
      return [x2 * cz - y1 * sz, x2 * sz + y1 * cz, z2];
    };
  }

  /* ============ Parametric grids ============ */

  function buildTorus() {
    var U = 32, V = 20, R = 1.85, r = 0.72, pts = [];
    for (var i = 0; i <= U; i++) {
      pts[i] = [];
      var u = (i / U) * Math.PI * 2;
      for (var j = 0; j <= V; j++) {
        var v = (j / V) * Math.PI * 2;
        pts[i][j] = [
          (R + r * Math.cos(v)) * Math.cos(u),
          (R + r * Math.cos(v)) * Math.sin(u),
          r * Math.sin(v)
        ];
      }
    }
    return pts;
  }

  function buildKlein() {
    var U = 32, V = 20, pts = [];
    for (var i = 0; i <= U; i++) {
      pts[i] = [];
      var u = (i / U) * Math.PI * 2;
      for (var j = 0; j <= V; j++) {
        var v = (j / V) * Math.PI * 2;
        var x, z;
        if (u < Math.PI) {
          x = 3 * Math.cos(u) * (1 + Math.sin(u)) + 2 * (1 - Math.cos(u) / 2) * Math.cos(u) * Math.cos(v);
          z = -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
        } else {
          x = 3 * Math.cos(u) * (1 + Math.sin(u)) + 2 * (1 - Math.cos(u) / 2) * Math.cos(v + Math.PI);
          z = -8 * Math.sin(u);
        }
        var y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v);
        pts[i][j] = [x * 0.19, y * 0.19, z * 0.19];
      }
    }
    return pts;
  }

  function buildMobius() {
    var U = 40, V = 12, R = 1.8, W = 0.55, pts = [];
    for (var i = 0; i <= U; i++) {
      pts[i] = [];
      var u = (i / U) * Math.PI * 2;
      for (var j = 0; j <= V; j++) {
        var v = -W + (2 * W * j) / V;
        pts[i][j] = [
          (R + v * Math.cos(u / 2)) * Math.cos(u),
          (R + v * Math.cos(u / 2)) * Math.sin(u),
          v * Math.sin(u / 2)
        ];
      }
    }
    return pts;
  }

  var TORUS = buildTorus();
  var KLEIN = buildKlein();
  var MOBIUS = buildMobius();

  /* ============ Glowing wireframe ============ */

  function drawSurface(grid, rot, cx, cy, scale, lineRGB, dotRGB, glowRGB, withEdges) {
    var U = grid.length - 1, V = grid[0].length - 1;
    var i, j, p;

    var proj = [];
    for (i = 0; i <= U; i++) {
      proj[i] = [];
      for (j = 0; j <= V; j++) {
        var g = grid[i][j];
        var r = rot(g[0], g[1], g[2]);
        var k = scale / (8 - r[2]);
        var wp = warp(cx + r[0] * k, cy + r[1] * k);
        proj[i][j] = { x: wp.x, y: wp.y, d: r[2] };
      }
    }

    // soft halo behind the surface
    var halo = ctx.createRadialGradient(cx, cy, scale * 0.05, cx, cy, scale * 0.75);
    halo.addColorStop(0, "rgba(" + glowRGB + ",0.05)");
    halo.addColorStop(1, "rgba(" + glowRGB + ",0)");
    ctx.fillStyle = halo;
    ctx.fillRect(cx - scale, cy - scale, scale * 2, scale * 2);

    // pass 1: wide glow lines
    ctx.lineWidth = 2.5;
    for (i = 0; i < U; i++) {
      for (j = 0; j < V; j++) {
        p = proj[i][j];
        var pu = proj[i + 1][j], pv = proj[i][j + 1];
        var a1 = Math.max(0.10, Math.min(0.55, 0.28 + p.d * 0.09)) * 0.30;
        ctx.strokeStyle = "rgba(" + lineRGB + "," + a1.toFixed(3) + ")";
        ctx.beginPath();
        ctx.moveTo(p.x, p.y); ctx.lineTo(pu.x, pu.y);
        ctx.moveTo(p.x, p.y); ctx.lineTo(pv.x, pv.y);
        ctx.stroke();
      }
    }

    // pass 2: crisp core lines
    ctx.lineWidth = 0.8;
    for (i = 0; i < U; i++) {
      for (j = 0; j < V; j++) {
        p = proj[i][j];
        var pu2 = proj[i + 1][j], pv2 = proj[i][j + 1];
        var a2 = Math.max(0.14, Math.min(0.65, 0.30 + p.d * 0.10));
        ctx.strokeStyle = "rgba(" + lineRGB + "," + a2.toFixed(3) + ")";
        ctx.beginPath();
        ctx.moveTo(p.x, p.y); ctx.lineTo(pu2.x, pu2.y);
        ctx.moveTo(p.x, p.y); ctx.lineTo(pv2.x, pv2.y);
        ctx.stroke();
      }
    }

    // highlighted boundary edges (Moebius: its single closed edge)
    if (withEdges) {
      for (var pass = 0; pass < 2; pass++) {
        ctx.lineWidth = pass === 0 ? 4.5 : 1.8;
        for (var e = 0; e <= 1; e++) {
          var je = e === 0 ? 0 : V;
          for (i = 0; i < U; i++) {
            var p1 = proj[i][je], p2 = proj[i + 1][je];
            var ae = pass === 0
              ? Math.max(0.05, Math.min(0.28, 0.16 + p1.d * 0.05))
              : Math.max(0.40, Math.min(0.95, 0.58 + p1.d * 0.12));
            ctx.strokeStyle = "rgba(244,217,160," + ae.toFixed(3) + ")";
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    }

    // vertex lights
    for (i = 0; i <= U; i++) {
      for (j = 0; j <= V; j++) {
        if ((i + j) % 4 !== 0) continue;
        p = proj[i][j];
        var a = Math.min(0.85, Math.max(0.15, 0.35 + p.d * 0.12));
        var r2 = Math.max(0.6, 1 + (p.d + 1.5) * 0.35);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r2 * 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + dotRGB + "," + (a * 0.12).toFixed(3) + ")";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, r2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + dotRGB + "," + a.toFixed(3) + ")";
        ctx.fill();
      }
    }
  }

  /* ============ Starfield ============ */

  var stars = [];
  function initStars() {
    stars = [];
    var n = Math.round((w * h) / 16000);
    for (var i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.3 + Math.random() * 1.2,
        alpha: 0.15 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
        speed: 0.005 + Math.random() * 0.015
      });
    }
  }

  function drawStars() {
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var flicker = s.alpha + Math.sin(time * s.speed + s.phase) * 0.12;
      var a = Math.min(1, Math.max(0.05, flicker));
      var wp = warp(s.x, s.y);
      ctx.beginPath();
      ctx.arc(wp.x, wp.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(200,220,240," + a.toFixed(3) + ")";
      ctx.fill();
      if (s.r > 0.9) {
        ctx.beginPath();
        ctx.arc(wp.x, wp.y, s.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(168,230,230," + (a * 0.10).toFixed(3) + ")";
        ctx.fill();
      }
    }
  }

  /* ============ Drifting particle field ============
     Two kinds: fine dust (small, gentle) and soft glow orbs
     (larger, slow upward drift, breathing halo).            */

  var particles = [];
  var PARTICLE_COUNT = 72;

  function initParticles() {
    particles = [];
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      var orb = Math.random() < 0.28;
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * (orb ? 0.14 : 0.24),
        vy: (Math.random() - 0.5) * (orb ? 0.14 : 0.24) - (orb ? 0.07 : 0),
        r: orb ? 1.8 + Math.random() * 2.4 : 0.7 + Math.random() * 1.2,
        orb: orb,
        alpha: (orb ? 0.12 : 0.06) + Math.random() * 0.10,
        phase: Math.random() * Math.PI * 2,
        twinkle: 0.004 + Math.random() * 0.012,
        color: Math.random() > 0.5 ? "168,230,230" : "244,217,160"
      });
    }
  }

  function drawParticles() {
    var i, j, p;

    // update, then lens-warp every draw position once
    var pts = [];
    for (i = 0; i < particles.length; i++) {
      p = particles[i];
      p.x += p.vx + Math.sin(time * 0.008 + p.phase) * 0.06;
      p.y += p.vy;
      if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10; if (p.y > h + 10) p.y = -10;
      pts.push(warp(p.x, p.y));
    }

    for (i = 0; i < particles.length; i++) {
      p = particles[i];
      var breathe = 0.55 + 0.45 * Math.sin(time * p.twinkle + p.phase);
      var a = p.alpha * breathe;

      if (p.orb) {
        // breathing halo
        ctx.beginPath();
        ctx.arc(pts[i].x, pts[i].y, p.r * 3.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + p.color + "," + (a * 0.22).toFixed(3) + ")";
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(pts[i].x, pts[i].y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + p.color + "," + a.toFixed(3) + ")";
      ctx.fill();
    }

    // soft links between nearby particles
    for (i = 0; i < particles.length; i++) {
      for (j = i + 1; j < particles.length; j++) {
        var dx = pts[i].x - pts[j].x;
        var dy = pts[i].y - pts[j].y;
        var d2 = dx * dx + dy * dy;
        if (d2 < 16900) {
          var a = 0.04 * (1 - Math.sqrt(d2) / 130);
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = "rgba(168,230,230," + a.toFixed(4) + ")";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  /* ============ Backdrop layers ============ */

  function drawBackground() {
    var grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#060d14");
    grad.addColorStop(0.4, "#0a1620");
    grad.addColorStop(0.7, "#0f1e2e");
    grad.addColorStop(1, "#0b1520");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  function drawAmbientGlow() {
    var off = scrollY * 0.1;
    var g1 = ctx.createRadialGradient(w * 0.35, h * 0.35 - off, 0, w * 0.35, h * 0.35 - off, Math.min(w, h) * 0.5);
    g1.addColorStop(0, "rgba(168,230,230,0.06)");
    g1.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, w, h);

    var g2 = ctx.createRadialGradient(w * 0.75, h * 0.65 - off, 0, w * 0.75, h * 0.65 - off, Math.min(w, h) * 0.4);
    g2.addColorStop(0, "rgba(244,217,160,0.04)");
    g2.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, w, h);
  }

  function drawVignette() {
    var g = ctx.createRadialGradient(w * 0.5, h * 0.5, Math.min(w, h) * 0.2, w * 0.5, h * 0.5, Math.max(w, h) * 0.75);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.45)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  /* ============ Main loop ============ */

  function render() {
    time++;
    ctx.clearRect(0, 0, w, h);
    drawBackground();
    drawAmbientGlow();
    drawStars();
    drawParticles();

    var s = Math.min(w, h);
    var off = scrollY * 0.12;

    drawSurface(TORUS, makeRotator(0.72 + time * 0.005, 0.55 + time * 0.007, 0.08),
      w * 0.24, h * 0.30 - off, s * 0.55, "168,230,230", "244,217,160", "168,230,230", false);
    drawSurface(KLEIN, makeRotator(0.34 + time * 0.006, -0.78 + time * 0.005, -0.18),
      w * 0.78, h * 0.36 - off, s * 0.80, "244,217,160", "168,230,230", "244,217,160", false);
    drawSurface(MOBIUS, makeRotator(1.05, -0.25 - time * 0.003, 0.12),
      w * 0.50, h * 0.76 - off, s * 0.50, "168,230,230", "244,217,160", "168,230,230", true);

    drawVignette();
    requestAnimationFrame(render);
  }

  /* ============ Events ============ */

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    initStars();
  }

  window.addEventListener("resize", resize);
  window.addEventListener("scroll", function () { scrollY = window.scrollY; }, { passive: true });
  window.addEventListener("mousemove", function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener("mouseout", function () { mouse.x = -9999; mouse.y = -9999; });

  resize();
  initParticles();
  render();
})();
