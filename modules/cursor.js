/* ─── CUSTOM CURSOR — particle trail (fine pointer / desktop only) ─── */
import { prefersReducedMotion } from './utils.js';

if (window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion) {
  const dot = document.getElementById('cursor-dot');
  const canvas = document.getElementById('cursor-trail');
  const ctx = canvas.getContext('2d');

  let mx = 0, my = 0, ready = false;
  let lastSpawn = 0;

  // Particles: { x, y, born, life, r, vx, vy, size }
  const particles = [];
  // Click ripples: { x, y, born }
  const ripples = [];

  const PARTICLE_LIFETIME = 600;  // ms
  const SPAWN_INTERVAL = 28;      // ms between spawns (throttle)
  const RIPPLE_LIFETIME = 500;

  const noNative = document.createElement('style');
  noNative.textContent = '*, *::before, *::after, *:active, *:hover, *:focus, a:active, button:active, [role="button"]:active { cursor: none !important; }';
  document.head.appendChild(noNative);

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
    if (!ready) { ready = true; document.body.classList.add('cursor-ready'); }

    const now = performance.now();
    if (now - lastSpawn > SPAWN_INTERVAL) {
      lastSpawn = now;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.2 + Math.random() * 0.5;
      particles.push({
        x: mx, y: my,
        born: now,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.3, // slight upward drift
        size: 1.2 + Math.random() * 1.4,
      });
    }
  }, { passive: true });

  document.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-click');
    ripples.push({ x: mx, y: my, born: performance.now() });
    // Burst of particles on click
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.4;
      const speed = 0.8 + Math.random() * 1.6;
      particles.push({
        x: mx, y: my,
        born: performance.now(),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 2,
        burst: true,
      });
    }
  });

  document.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-click');
  });

  const hoverSel = 'a, button, .dossier-trigger, .cert-item, .nav-contact';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverSel)) document.body.classList.add('cursor-hover');
  }, { passive: true });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverSel)) document.body.classList.remove('cursor-hover');
  }, { passive: true });

  function drawTrail() {
    const now = performance.now();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      const t = (now - rp.born) / RIPPLE_LIFETIME;
      if (t >= 1) { ripples.splice(i, 1); continue; }
      const ease = 1 - Math.pow(1 - t, 3); // ease-out-cubic
      const radius = ease * 36;
      const alpha = (1 - t) * 0.3;
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(196,181,253,${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      const age = (now - p.born) / PARTICLE_LIFETIME;
      if (age >= 1) { particles.splice(i, 1); continue; }

      const life = 1 - age;
      const ease = 1 - Math.pow(age, 2); // ease-out-quad
      // Drift outward
      const x = p.x + p.vx * age * 40;
      const y = p.y + p.vy * age * 40;
      const r = p.size * ease;

      // purple → bright accent fade
      const cr = Math.round(124 + (196 - 124) * life);
      const cg = Math.round(58 + (181 - 58) * life);
      const cb = Math.round(237 + (253 - 237) * life);
      ctx.fillStyle = `rgba(${cr},${cg},${cb},${life * (p.burst ? 0.7 : 0.42)})`;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(drawTrail);
  }
  drawTrail();
}
