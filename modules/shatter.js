/* ─── SHATTER TRANSITION ─── */
import { startRadar, pauseRadar } from './radar.js';

/* ── Mini radar teaser ── */
(function initRadarTeaser() {
  const canvas = document.getElementById('radar-teaser-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const S = canvas.width; // 72
  const cx = S / 2, cy = S / 2, r = S / 2 - 2;
  const blips = [
    { a: 0.8, d: 0.38 }, { a: 2.1, d: 0.6 }, { a: 3.7, d: 0.45 },
    { a: 4.9, d: 0.7 }, { a: 5.5, d: 0.25 },
  ];
  let angle = 0;
  let rafId;

  function draw() {
    ctx.clearRect(0, 0, S, S);

    // background
    ctx.fillStyle = '#0c0c10';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // rings
    ctx.strokeStyle = 'rgba(167,139,250,0.12)';
    ctx.lineWidth = 0.5;
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, r * (i / 3), 0, Math.PI * 2);
      ctx.stroke();
    }

    // sweep fill
    const sweepLen = Math.PI * 0.55;
    const grad = ctx.createConicalGradient
      ? null
      : null; // fallback: arc fill
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, angle - sweepLen, angle);
    ctx.closePath();
    ctx.fillStyle = 'rgba(124,58,237,0.13)';
    ctx.fill();
    ctx.restore();

    // sweep line
    ctx.save();
    ctx.strokeStyle = 'rgba(167,139,250,0.55)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
    ctx.stroke();
    ctx.restore();

    // blips — only show if they're "behind" the sweep
    blips.forEach(b => {
      const bAngle = b.a;
      let delta = (angle - bAngle) % (Math.PI * 2);
      if (delta < 0) delta += Math.PI * 2;
      if (delta > sweepLen) return;
      const fade = 1 - delta / sweepLen;
      const bx = cx + Math.cos(bAngle) * r * b.d;
      const by = cy + Math.sin(bAngle) * r * b.d;
      ctx.beginPath();
      ctx.arc(bx, by, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167,139,250,${fade * 0.9})`;
      ctx.fill();
    });

    // clip to circle
    ctx.save();
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    angle += 0.025;
    if (angle > Math.PI * 2) angle -= Math.PI * 2;
    rafId = requestAnimationFrame(draw);
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    draw();
  } else {
    // static single frame
    draw();
    cancelAnimationFrame(rafId);
  }
})();

/* ── Decode transmission: classified text periodically de-scrambles to plain English ── */
(function initBtnDecode() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const btn = document.getElementById('radar-reveal-btn');
  if (!btn) return;
  const textEl = btn.querySelector('.rrb-text');
  if (!textEl) return;

  const CLASSIFIED = '[ OVERRIDE COGNITOHAZARD FILTERS ]';
  const PLAINTEXT  = '[ OPEN INTEL RADAR \u2014 14 PROJECTS ]';
  const NOISE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789▓▒░█';

  function randomize(template) {
    return template.split('').map(ch => {
      if (ch === ' ' || ch === '[' || ch === ']') return ch;
      return NOISE_CHARS[Math.floor(Math.random() * NOISE_CHARS.length)];
    }).join('');
  }

  let running = false;

  function runDecode() {
    if (running) return;
    running = true;

    const SCRAMBLE_DUR = 480;   // ms: original → noise
    const DECODE_DUR   = 560;   // ms: noise converges → plaintext
    const HOLD_DUR     = 1800;  // ms: hold plaintext
    const ENCODE_DUR   = 480;   // ms: noise → back to classified

    let phase = 0;
    let phaseStart = performance.now();
    let rafId;

    function frame(now) {
      const elapsed = now - phaseStart;
      let nextPhase = false;

      if (phase === 0) {
        // scramble: original → noise
        textEl.textContent = randomize(CLASSIFIED);
        if (elapsed >= SCRAMBLE_DUR) nextPhase = true;

      } else if (phase === 1) {
        // converge: noise → plaintext (characters resolve left-to-right)
        const t = Math.min(elapsed / DECODE_DUR, 1);
        const resolved = Math.floor(t * PLAINTEXT.length);
        textEl.textContent = PLAINTEXT.split('').map((ch, i) => {
          if (ch === ' ' || ch === '[' || ch === ']') return ch;
          if (i < resolved) return ch;
          return NOISE_CHARS[Math.floor(Math.random() * NOISE_CHARS.length)];
        }).join('');
        if (elapsed >= DECODE_DUR) nextPhase = true;

      } else if (phase === 2) {
        // hold plaintext
        textEl.textContent = PLAINTEXT;
        btn.classList.add('rrb-decoded');
        if (elapsed >= HOLD_DUR) nextPhase = true;

      } else if (phase === 3) {
        // re-encode: plaintext → noise
        textEl.textContent = randomize(PLAINTEXT);
        if (elapsed >= ENCODE_DUR) nextPhase = true;

      } else {
        // restore
        textEl.textContent = CLASSIFIED;
        btn.classList.remove('rrb-decoded');
        running = false;
        return;
      }

      if (nextPhase) { phase++; phaseStart = now; }
      rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);
  }

  // first decode at 4s, then every 11s
  setTimeout(() => {
    runDecode();
    setInterval(runDecode, 11000);
  }, 4000);
})();

const revealBtn = document.getElementById('radar-reveal-btn');
const backBtn = document.getElementById('radar-back-btn');
const manifestSection = document.getElementById('manifest-section');
const radarSection = document.getElementById('radar-section');
if (revealBtn && backBtn && manifestSection && radarSection) {

  const STAGGER = 30;      // ms between each row flying out
  const FLY_DUR = 380;     // ms for each row's fly-out
  const RETURN_DUR = 280;  // ms for each row's fly-back

  function getShatterTargets() {
    return [...manifestSection.querySelectorAll(
      '.manifest-row, .manifest-header, .manifest-earlier-toggle, .radar-reveal-row'
    )];
  }

  /* ── Shatter out → show radar ── */
  revealBtn.addEventListener('click', () => {
    const items = getShatterTargets();
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Scroll the projects section into view so the shatter plays on screen */
    const projectsSection = document.getElementById('projects');
    const alreadyVisible = projectsSection
      ? projectsSection.getBoundingClientRect().top >= -40
      : true;

    if (projectsSection && !alreadyVisible) {
      projectsSection.scrollIntoView({ behavior: noMotion ? 'instant' : 'smooth', block: 'start' });
    }

    const scrollDelay = (!alreadyVisible && !noMotion) ? 420 : 0;

    if (noMotion) {
      manifestSection.hidden = true;
      radarSection.hidden = false;
      requestAnimationFrame(() => startRadar());
      return;
    }

    /* Assign each item a random shatter vector — delayed if scroll was needed */
    setTimeout(() => {
    items.forEach((item, i) => {
      const dx = (Math.random() - 0.5) * 900;
      const dy = (Math.random() * 0.55 - 0.15) * 600;
      const rot = (Math.random() - 0.5) * 28;
      item.animate([
        { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${dx}px,${dy}px) rotate(${rot}deg)`, opacity: 0 },
      ], {
        duration: FLY_DUR,
        delay: i * STAGGER,
        easing: 'cubic-bezier(0.4, 0, 1, 0.6)',
        fill: 'forwards',
      });
    });

    const totalMs = items.length * STAGGER + FLY_DUR + 60;
    setTimeout(() => {
      /* Cancel fill-forwards so manifest can be restored later */
      items.forEach(item => item.getAnimations().forEach(a => a.cancel()));
      manifestSection.hidden = true;

      radarSection.hidden = false;
      /* Wait one rAF so the browser lays out the now-visible section
         before resize() reads clientWidth (was 0 while hidden) */
      requestAnimationFrame(() => {
        radarSection.animate(
          [{ opacity: 0, transform: 'scale(0.97)' },
          { opacity: 1, transform: 'scale(1)' }],
          { duration: 420, easing: 'cubic-bezier(0.2, 0, 0, 1)', fill: 'forwards' }
        );
        startRadar();
      });
    }, totalMs);
    }, scrollDelay); // wait for scroll to settle before shattering
  });

  /* ── Back: hide radar → restore manifest ── */
  backBtn.addEventListener('click', () => {
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    radarSection.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: noMotion ? 0 : 240, easing: 'ease-out', fill: 'forwards' }
    );

    setTimeout(() => {
      radarSection.getAnimations().forEach(a => a.cancel());
      radarSection.hidden = true;
      pauseRadar();

      manifestSection.hidden = false;

      if (!noMotion) {
        const items = getShatterTargets();
        items.forEach((item, i) => {
          item.animate([
            { transform: 'translateY(14px)', opacity: 0 },
            { transform: 'translateY(0)', opacity: 1 },
          ], {
            duration: RETURN_DUR,
            delay: i * 18,
            easing: 'cubic-bezier(0.2, 0, 0, 1)',
            fill: 'forwards',
          });
        });
      }
    }, noMotion ? 0 : 220);
  });
}
