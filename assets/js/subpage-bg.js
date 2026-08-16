/* ============================================================
   Kanghe Lyu site — subpage-bg.js
   Lightweight ambient canvas for notes/projects subpages.
   Stars, floating particles, connection lines, cursor glow.
   ============================================================ */

(function () {
  "use strict";

  var canvas = document.getElementById("bg-subtle");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var w, h, time = 0;
  var mouse = { x: -1000, y: -1000 };

  var stars = [];
  var particles = [];

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    initStars();
    initParticles();
  }

  function initStars() {
    stars = [];
    for (var i = 0; i < 80; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.3 + Math.random() * 1,
        alpha: 0.15 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
        speed: 0.005 + Math.random() * 0.01
      });
    }
  }

  function initParticles() {
    particles = [];
    for (var i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: 0.8 + Math.random() * 1.5,
        alpha: 0.04 + Math.random() * 0.08,
        color: Math.random() > 0.5 ? "168,230,230" : "244,217,160"
      });
    }
  }

  function drawStars() {
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var flicker = s.alpha + Math.sin(time * s.speed + s.phase) * 0.1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(200,220,240," + Math.min(1, flicker) + ")";
      ctx.fill();
    }
  }

  function drawParticles() {
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + p.color + "," + p.alpha + ")";
      ctx.fill();
    }

    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = "rgba(168,230,230," + (0.025 * (1 - dist / 100)) + ")";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function drawBackground() {
    var grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#060d14");
    grad.addColorStop(0.5, "#0a1620");
    grad.addColorStop(1, "#0b1520");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Ambient glows
    var g1 = ctx.createRadialGradient(w * 0.2, h * 0.3, 0, w * 0.2, h * 0.3, Math.min(w, h) * 0.4);
    g1.addColorStop(0, "rgba(168,230,230,0.035)");
    g1.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, w, h);

    var g2 = ctx.createRadialGradient(w * 0.8, h * 0.7, 0, w * 0.8, h * 0.7, Math.min(w, h) * 0.35);
    g2.addColorStop(0, "rgba(244,217,160,0.025)");
    g2.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, w, h);

    // Vignette
    var vg = ctx.createRadialGradient(w * 0.5, h * 0.5, Math.min(w, h) * 0.15, w * 0.5, h * 0.5, Math.max(w, h) * 0.7);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(0,0,0,0.35)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);
  }

  function drawCursorLight() {
    if (mouse.x < 0 || mouse.y < 0) return;
    var g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 200);
    g.addColorStop(0, "rgba(168,230,230,0.03)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  function render() {
    time++;
    drawBackground();
    drawStars();
    drawParticles();
    drawCursorLight();
    requestAnimationFrame(render);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    var glow = document.getElementById("cursor-glow");
    if (glow) { glow.style.left = e.clientX + "px"; glow.style.top = e.clientY + "px"; }
  });

  resize();
  render();
})();
