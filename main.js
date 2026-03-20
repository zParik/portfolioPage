const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── SCROLL REVEAL ─── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 6) * 60 + 'ms';
  observer.observe(el);
});

// Hero content is always above fold, make visible immediately
document.querySelectorAll('.hero .reveal, .hero-inner, .hero-name, .hero-eyebrow, .hero-manifest, .hero-abstract, .hero-socials, .hero-actions').forEach(el => el.classList.add('visible'));

/* ─── TERMINAL ENGINE ─── */
const SESSIONS = [
  [
    { type: 'cmd', text: 'python paleguard.py --scan /proc/net' },
    { type: 'out', cls: 'warn', text: '[*] PaleGuard EDR initialising...' },
    { type: 'out', cls: 'ok',   text: '[✓] Loaded 3D volumetric model  (epoch 312)' },
    { type: 'out', cls: 'ok',   text: '[✓] Scanning process memory map' },
    { type: 'out', cls: 'ok',   text: '[✓] No anomalies detected. Score: 0.003' },
  ],
  [
    { type: 'cmd', text: 'git clone https://github.com/zParik/ARCHON && cd ARCHON' },
    { type: 'out', cls: '',     text: "Cloning into 'ARCHON'..." },
    { type: 'out', cls: 'ok',   text: 'done.' },
    { type: 'cmd', text: 'npm install && npm run build' },
    { type: 'out', cls: 'ok',   text: '✓ Built in 1.4s  →  dist/bundle.js' },
  ],
  [
    { type: 'cmd', text: 'python indoor_nav.py --camera 0 --mode assist' },
    { type: 'out', cls: 'warn', text: '[*] Loading YOLOv8-seg model...' },
    { type: 'out', cls: 'ok',   text: '[✓] Objects in frame: door(0.97), chair(0.91)' },
    { type: 'out', cls: 'ok',   text: '[✓] Path clear, proceed 2.1 m forward' },
  ],
  [
    { type: 'cmd', text: 'nmap -sV --script vuln 192.168.1.0/24' },
    { type: 'out', cls: 'warn', text: '[*] Starting Nmap 7.94...' },
    { type: 'out', cls: 'ok',   text: 'Host: 192.168.1.1  Ports: 22/open/ssh' },
    { type: 'out', cls: 'ok',   text: 'No critical CVEs found on scanned hosts.' },
  ],
  [
    { type: 'cmd', text: 'vim resume.c' },
    { type: 'out', cls: '',     text: '-- INSERT --   [vim-mode text editor]' },
    { type: 'cmd', text: 'gcc -O2 -o editor editor.c && ./editor' },
    { type: 'out', cls: 'ok',   text: "Parik's editor v0.1  |  Ctrl-Q to quit" },
  ],
  [
    { type: 'cmd', text: 'python asl_transcribe.py --source webcam' },
    { type: 'out', cls: 'warn', text: '[*] Loading hand landmark model...' },
    { type: 'out', cls: 'ok',   text: '[✓] Detected: "HELLO"  conf=0.98' },
    { type: 'out', cls: 'ok',   text: '[✓] Detected: "THANK YOU"  conf=0.96' },
  ],
  [
    { type: 'cmd', text: 'python tictactoe.py --mode minimax --depth 9' },
    { type: 'out', cls: 'warn', text: '[*] Minimax tree: 255168 nodes evaluated' },
    { type: 'out', cls: 'ok',   text: '[✓] Optimal move: (1,1) - centre' },
    { type: 'out', cls: 'ok',   text: 'Result: Draw  (perfect play enforced)' },
  ],
  [
    { type: 'cmd', text: 'cat /var/log/easteregg.log' },
    { type: 'out', cls: 'warn', text: '[*] hint: ↑↑↓↓←→←→BA' },
    { type: 'out', cls: '',     text: 'Try it. I dare you.' },
  ],
];

const termBody = document.getElementById('terminal-body');
let sessionIdx = 0;
let termGeneration = 0; // incremented to cancel in-flight sessions

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function typeText(el, text, speed = 38) {
  if (prefersReducedMotion) { el.textContent += text; return; }
  for (const ch of text) {
    el.textContent += ch;
    await sleep(speed + Math.random() * 22);
  }
}

function makeLine() {
  const line = document.createElement('div');
  line.className = 't-line';
  return line;
}

async function runSession(lines, gen) {
  termBody.innerHTML = '';
  for (const item of lines) {
    if (termGeneration !== gen) return; // session was interrupted
    const line = makeLine();

    if (item.type === 'cmd') {
      const prompt = document.createElement('span');
      prompt.className = 't-prompt';
      prompt.textContent = '❯';
      const cmd = document.createElement('span');
      cmd.className = 't-cmd';
      line.appendChild(prompt);
      line.appendChild(cmd);
      termBody.appendChild(line);
      termBody.scrollTop = termBody.scrollHeight;
      await typeText(cmd, item.text, 42);
      await sleep(180);
    } else {
      const out = document.createElement('span');
      out.className = 't-out' + (item.cls ? ' ' + item.cls : '');
      out.textContent = item.text;
      line.appendChild(out);
      termBody.appendChild(line);
      termBody.scrollTop = termBody.scrollHeight;
      await sleep(60);
    }
  }

  if (termGeneration !== gen) return;
  // trailing cursor on a new prompt line
  const cursorLine = makeLine();
  const prompt = document.createElement('span');
  prompt.className = 't-prompt';
  prompt.textContent = '❯';
  const cur = document.createElement('span');
  cur.className = 't-cursor';
  cursorLine.appendChild(prompt);
  cursorLine.appendChild(cur);
  termBody.appendChild(cursorLine);
  termBody.scrollTop = termBody.scrollHeight;
}

async function loop() {
  const gen = termGeneration;
  while (termGeneration === gen) {
    await runSession(SESSIONS[sessionIdx % SESSIONS.length], gen);
    if (termGeneration !== gen) return;
    sessionIdx++;
    await sleep(3200);
  }
}

setTimeout(loop, 800);

/* ─── CUSTOM CURSOR - particle trail (fine pointer / desktop only) ─── */
if (window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion) {
  const dot    = document.getElementById('cursor-dot');
  const canvas = document.getElementById('cursor-trail');
  const ctx    = canvas.getContext('2d');

  let mx = 0, my = 0, ready = false;
  let lastSpawn = 0;

  // Particles: { x, y, born, life, r, vx, vy, size }
  const particles = [];
  // Click ripples: { x, y, born }
  const ripples = [];

  const PARTICLE_LIFETIME = 600;  // ms
  const SPAWN_INTERVAL    = 28;   // ms between spawns (throttle)
  const RIPPLE_LIFETIME   = 500;

  const noNative = document.createElement('style');
  noNative.textContent = '*, *::before, *::after, *:active, *:hover, *:focus, a:active, button:active, [role="button"]:active { cursor: none !important; }';
  document.head.appendChild(noNative);

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  function isLight() {
    return document.documentElement.getAttribute('data-theme') === 'light';
  }

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
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

  const hoverSel = 'a, button, .dossier-trigger, .cert-row, .nav-contact';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverSel)) document.body.classList.add('cursor-hover');
  }, { passive: true });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverSel)) document.body.classList.remove('cursor-hover');
  }, { passive: true });

  function drawTrail() {
    const now = performance.now();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const light = isLight();

    // Draw ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      const t  = (now - rp.born) / RIPPLE_LIFETIME;
      if (t >= 1) { ripples.splice(i, 1); continue; }
      const ease = 1 - Math.pow(1 - t, 3); // ease-out-cubic
      const radius = ease * 36;
      const alpha  = (1 - t) * (light ? 0.25 : 0.3);
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, radius, 0, Math.PI * 2);
      if (light) {
        ctx.strokeStyle = `rgba(109,40,217,${alpha})`;
      } else {
        ctx.strokeStyle = `rgba(196,181,253,${alpha})`;
      }
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p   = particles[i];
      const age = (now - p.born) / PARTICLE_LIFETIME;
      if (age >= 1) { particles.splice(i, 1); continue; }

      const life = 1 - age;
      const ease = 1 - Math.pow(age, 2); // ease-out-quad
      // Drift outward
      const x = p.x + p.vx * age * 40;
      const y = p.y + p.vy * age * 40;
      const r = p.size * ease;

      if (light) {
        // warm purple on light bg
        ctx.fillStyle = `rgba(109,40,217,${life * (p.burst ? 0.55 : 0.32)})`;
      } else {
        // purple → bright accent fade
        const cr = Math.round(124 + (196 - 124) * life);
        const cg = Math.round(58  + (181 - 58)  * life);
        const cb = Math.round(237 + (253 - 237) * life);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${life * (p.burst ? 0.7 : 0.42)})`;
      }

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(drawTrail);
  }
  drawTrail();
}

/* ─── DOSSIER SYSTEM ─── */
(function () {
  const overlay  = document.getElementById('dossier-overlay');
  const panel    = document.getElementById('dossier-panel');
  const closeBtn = document.getElementById('dossier-close');

  const fields = {
    stamp:        document.getElementById('dossier-stamp'),
    statusBadge:  document.getElementById('dossier-status-badge'),
    tabName:      document.getElementById('dossier-tab-name'),
    badge:        document.getElementById('dossier-badge'),
    name:         document.getElementById('dossier-name'),
    role:         document.getElementById('dossier-role'),
    statusText:   document.getElementById('dossier-status-text'),
    overview:     document.getElementById('dossier-overview'),
    architecture: document.getElementById('dossier-architecture'),
    contribution: document.getElementById('dossier-contribution'),
    outcome:      document.getElementById('dossier-outcome'),
    links:        document.getElementById('dossier-links'),
    fileId:       document.getElementById('dossier-file-id'),
  };

  let isOpen = false;
  let currentCard = null;

  function escHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function setDossierField(el, text) {
    const parts = text.split('||').map(s => s.trim()).filter(Boolean);
    if (parts.length <= 1) { el.textContent = text; return; }
    el.innerHTML = parts.map((p, i) => {
      const colonIdx = p.indexOf(':');
      if (i === 0 && colonIdx > 0 && colonIdx < 20) {
        const label = escHtml(p.slice(0, colonIdx + 1));
        const rest  = escHtml(p.slice(colonIdx + 1).trim());
        return `<span class="df-label">${label}</span> ${rest}`;
      }
      return `<span class="df-bullet">${escHtml(p)}</span>`;
    }).join('');
  }

  function populateDossier(card) {
    const d = card.dataset;

    const clearance = (d.dossierClearance || '').toUpperCase();
    const isActive  = clearance.includes('ACTIVE');

    fields.stamp.textContent = 'CLEARANCE: ' + clearance;
    fields.stamp.className   = 'dossier-stamp ' + (isActive ? 'clearance-active' : 'clearance-declassified');

    const status = (d.dossierStatus || '').toUpperCase();
    fields.statusBadge.textContent = status;
    fields.statusBadge.className   = 'dossier-status-badge ' + (status === 'ONGOING' ? 'status-ongoing' : 'status-complete');

    fields.tabName.textContent      = d.dossierName || '';
    fields.badge.textContent        = d.dossierBadge || '';
    fields.name.textContent         = d.dossierName || '';
    fields.role.textContent         = d.dossierRole || '';
    fields.statusText.textContent   = status;
    setDossierField(fields.overview,     d.dossierOverview || '');
    setDossierField(fields.architecture, d.dossierArchitecture || '');
    setDossierField(fields.contribution, d.dossierContribution || '');
    setDossierField(fields.outcome,      d.dossierOutcome || '');

    const unredacted = d.dossierUnredacted === 'true';
    [fields.overview, fields.architecture, fields.contribution, fields.outcome].forEach(el => {
      el.classList.toggle('redacted', !unredacted);
    });

    // Links
    fields.links.innerHTML = '';
    if (d.dossierGithub) {
      const a = document.createElement('a');
      a.className = 'dossier-link';
      a.href = d.dossierGithub;
      a.target = '_blank';
      a.rel = 'noopener';
      a.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>VIEW SOURCE`;
      fields.links.appendChild(a);
    }
    if (d.dossierLink) {
      const a = document.createElement('a');
      a.className = 'dossier-link';
      a.href = d.dossierLink;
      a.target = '_blank';
      a.rel = 'noopener';
      a.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>LIVE DEMO`;
      fields.links.appendChild(a);
    }
    if (d.dossierDemo) {
      const urls = d.dossierDemo.split(',').map(u => u.trim()).filter(Boolean);
      urls.forEach((url, i) => {
        const a = document.createElement('a');
        a.className = 'dossier-link';
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>DEMO ${urls.length > 1 ? i + 1 : ''}`.trim();
        fields.links.appendChild(a);
      });
    }

    const nameSlug = (d.dossierName || 'UNKNOWN').replace(/[^A-Z0-9]/gi, '-').toUpperCase();
    fields.fileId.textContent = 'FILE-' + nameSlug + '-' + new Date().getFullYear();
  }

  function openDossier(card) {
    if (isOpen) return;
    isOpen = true;
    currentCard = card;

    // FIRST: capture card position before anything changes
    const cardRect = card.getBoundingClientRect();

    // Populate content
    populateDossier(card);

    // Pre-measure: make overlay a flex container with the panel visible but
    // invisible so getBoundingClientRect returns the real settled position.
    overlay.style.display = 'flex';
    panel.style.transition = 'none';
    panel.style.transform  = 'none';
    panel.style.opacity    = '0';
    panel.style.visibility = 'hidden';

    // Force layout so the browser computes the panel's natural geometry
    panel.getBoundingClientRect(); // trigger reflow
    const panelRect = panel.getBoundingClientRect();

    // INVERT: transform that makes the panel sit exactly over the card
    const dx = cardRect.left + cardRect.width  / 2 - (panelRect.left + panelRect.width  / 2);
    const dy = cardRect.top  + cardRect.height / 2 - (panelRect.top  + panelRect.height / 2);
    const sx = cardRect.width  / panelRect.width;
    const sy = cardRect.height / panelRect.height;

    // Snap to inverted position (still invisible)
    panel.style.transform       = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    panel.style.transformOrigin = 'center center';
    panel.style.visibility      = 'visible';

    // Now activate overlay (fades scrim in)
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Set scanning state so dossier content starts hidden
    const inner = panel.querySelector('.dossier-inner');
    inner.classList.remove('dossier-revealed');
    inner.classList.add('dossier-scanning');

    // PLAY: one rAF is enough now that the transform is already applied
    requestAnimationFrame(() => {
      panel.style.transition = 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease';
      panel.style.transform  = 'translate(0,0) scale(1,1)';
      panel.style.opacity    = '1';
    });

    // Move focus to close button after animation completes, then reveal content
    setTimeout(() => {
      closeBtn.focus();
      inner.classList.remove('dossier-scanning');
      inner.classList.add('dossier-revealed');
    }, 460);

    card.classList.add('dossier-card-open');
  }

  function closeDossier() {
    if (!isOpen) return;

    // Mark closed immediately so a rapid re-open isn't blocked mid-animation
    isOpen = false;

    const card = currentCard;
    currentCard = null;
    const cardRect = card ? card.getBoundingClientRect() : null;
    const panelRect = panel.getBoundingClientRect();

    if (cardRect) {
      const dx = cardRect.left + cardRect.width / 2  - (panelRect.left + panelRect.width / 2);
      const dy = cardRect.top  + cardRect.height / 2 - (panelRect.top  + panelRect.height / 2);
      const sx = cardRect.width  / panelRect.width;
      const sy = cardRect.height / panelRect.height;

      panel.style.transition = 'transform 0.32s cubic-bezier(0.55, 0, 1, 0.45), opacity 0.22s ease';
      panel.style.transform  = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
      panel.style.opacity    = '0';
    } else {
      panel.style.transition = 'opacity 0.22s ease';
      panel.style.opacity    = '0';
    }

    overlay.classList.remove('active');
    document.body.style.overflow = '';

    if (card) card.classList.remove('dossier-card-open');

    // Return focus to the card that opened the dossier
    if (card) card.focus();

    setTimeout(() => {
      panel.style.transition  = 'none';
      panel.style.transform   = 'none';
      panel.style.opacity     = '0';
      panel.style.visibility  = 'hidden';
      overlay.style.display   = '';
      // Reset stagger state for next open
      const inner = panel.querySelector('.dossier-inner');
      inner.classList.remove('dossier-scanning', 'dossier-revealed');
    }, 340);
  }

  // Wire up triggers: click and keyboard (Enter/Space)
  document.querySelectorAll('.dossier-trigger').forEach(card => {
    card.addEventListener('click', () => openDossier(card));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDossier(card);
      }
    });
  });

  // Inject source-available indicator on cards with GitHub links
  document.querySelectorAll('.dossier-trigger[data-dossier-github]').forEach(card => {
    const indicator = document.createElement('span');
    indicator.className = 'source-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    indicator.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>SRC AVAILABLE';
    // Place before the arrow in declass cards, or group with status in featured cards
    const arrow = card.querySelector('.declass-card-arrow');
    const statusSpan = card.querySelector('.featured-card-status');
    const topRow = card.querySelector('.declass-card-top') || card.querySelector('.featured-card-header');
    if (arrow) {
      arrow.before(indicator);
    } else if (statusSpan) {
      const group = document.createElement('span');
      group.className = 'featured-card-header-right';
      statusSpan.replaceWith(group);
      group.appendChild(statusSpan);
      group.appendChild(indicator);
    } else if (topRow) {
      topRow.appendChild(indicator);
    }
  });

  // Inject demo-available indicator on cards with demo videos
  document.querySelectorAll('.dossier-trigger[data-dossier-demo]').forEach(card => {
    const indicator = document.createElement('span');
    indicator.className = 'demo-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    indicator.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>WATCH DEMO';
    const arrow = card.querySelector('.declass-card-arrow');
    const topRow = card.querySelector('.declass-card-top') || card.querySelector('.featured-card-header');
    if (arrow) arrow.before(indicator);
    else if (topRow) topRow.appendChild(indicator);
  });

  closeBtn.addEventListener('click', closeDossier);

  // Close on scrim click
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeDossier();
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) closeDossier();
  });

  // Swipe-down to close on mobile bottom sheet
  let touchStartY = 0;
  panel.addEventListener('touchstart', e => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  panel.addEventListener('touchend', e => {
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (dy > 72 && isOpen) closeDossier();
  }, { passive: true });
}());

/* ─── KONAMI CODE - HACKERMAN MODE ─── */
(function () {
  const SEQ = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let pos = 0;
  let hacking = false;

  document.addEventListener('keydown', e => {
    if (e.key === SEQ[pos]) {
      pos++;
      if (pos === SEQ.length) { pos = 0; triggerHackerman(); }
    } else {
      pos = e.key === SEQ[0] ? 1 : 0;
    }
  });

  const HACK_LINES = [
    { type: 'cmd', text: 'sudo nmap -sS -O --script vuln 0.0.0.0/0' },
    { type: 'out', text: 'Starting Nmap 7.94 ( https://nmap.org )' },
    { type: 'out', text: 'Initiating SYN Stealth Scan...' },
    { type: 'out', text: 'Discovered open port 22/tcp on 192.168.0.1' },
    { type: 'out', text: 'Discovered open port 443/tcp on 10.0.0.254' },
    { type: 'cmd', text: 'python3 exploit.py --target mainframe --payload r00t' },
    { type: 'out', text: '[*] Sending stage (175686 bytes) to target...' },
    { type: 'out', text: '[*] Meterpreter session 1 opened' },
    { type: 'out', text: '[!] SYSTEM BREACH DETECTED' },
    { type: 'cmd', text: 'whoami' },
    { type: 'out', text: 'root@PARIK-MAINFRAME' },
    { type: 'cmd', text: 'cat /etc/shadow | hashcat --mode 1800' },
    { type: 'out', text: '[+] Hash cracked: hunter2' },
    { type: 'out', text: '[+] All your base are belong to us.' },
    { type: 'cmd', text: 'echo "jk lol - Parik was here 😈"' },
    { type: 'out', text: 'jk lol - Parik was here 😈' },
  ];

  async function triggerHackerman() {
    if (hacking) return;
    hacking = true;

    // Glitch the page
    document.body.classList.add('hackerman');

    // Scroll terminal into view
    const term = document.getElementById('terminal');
    if (term) term.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Interrupt normal loop, take over the terminal
    termGeneration++;

    // Run the fake hack session
    termBody.innerHTML = '';
    for (const item of HACK_LINES) {
      const line = makeLine();
      if (item.type === 'cmd') {
        const prompt = document.createElement('span');
        prompt.className = 't-prompt';
        prompt.textContent = '#';          // root prompt
        const cmd = document.createElement('span');
        cmd.className = 't-cmd';
        line.appendChild(prompt);
        line.appendChild(cmd);
        termBody.appendChild(line);
        await typeText(cmd, item.text, 18);
        await sleep(80);
      } else {
        const out = document.createElement('span');
        out.className = 't-out hack-out';
        out.textContent = item.text;
        line.appendChild(out);
        termBody.appendChild(line);
        await sleep(35);
      }
    }

    // Hold for a moment then restore
    await sleep(3500);
    document.body.classList.remove('hackerman');
    hacking = false;
    // Resume normal terminal loop
    loop();
  }
}());

/* ─── MOBILE DRAWER TOGGLE ─── */
const hamburger = document.getElementById('hamburger');
const drawer = document.getElementById('mobile-drawer');
const drawerScrim = document.getElementById('mobile-drawer-scrim');
const drawerClose = document.getElementById('drawer-close');

function setDrawerOpen(open) {
  drawer.classList.toggle('open', open);
  drawerScrim.classList.toggle('open', open);
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.style.overflow = open ? 'hidden' : '';
}

hamburger.addEventListener('click', () => {
  setDrawerOpen(!drawer.classList.contains('open'));
});
drawerClose.addEventListener('click', () => setDrawerOpen(false));
drawerScrim.addEventListener('click', () => setDrawerOpen(false));
// Close drawer when a nav link inside it is clicked
drawer.querySelectorAll('.drawer-nav a').forEach(a => {
  a.addEventListener('click', () => setDrawerOpen(false));
});

/* ─── NAV SCROLL STATE ─── */
window.addEventListener('scroll', () => {
  document.querySelector('nav').classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ─── SCROLLBAR SECTION COLOR ─── */
(function () {
  const sections = [
    { id: 'projects',   color: [45, 212, 191] },   // teal
    { id: 'skills',     color: [96, 165, 250] },    // blue
    { id: 'background', color: [167, 139, 250] },   // purple
    { id: 'off-clock',  color: [251, 191, 36] },    // amber
  ];

  const root = document.documentElement;
  let ticking = false;

  function updateScrollbarColor() {
    const scrollY = window.scrollY + window.innerHeight * 0.4;
    let active = null;

    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i].id);
      if (el && scrollY >= el.offsetTop) {
        active = sections[i];
        break;
      }
    }

    if (active) {
      const [r, g, b] = active.color;
      root.style.setProperty('--scrollbar-thumb', `rgba(${r},${g},${b},0.18)`);
      root.style.setProperty('--scrollbar-thumb-hover', `rgba(${r},${g},${b},0.35)`);
    } else {
      root.style.setProperty('--scrollbar-thumb', 'rgba(255,255,255,0.10)');
      root.style.setProperty('--scrollbar-thumb-hover', 'rgba(255,255,255,0.22)');
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollbarColor);
      ticking = true;
    }
  }, { passive: true });

  updateScrollbarColor();
})();

/* ─── DYNAMIC YEAR ─── */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ─── DELIGHT: CONSOLE EASTER EGG ─── */
(function () {
  const S = [
    'color: #a78bfa; font-size: 14px; font-weight: bold; font-family: monospace',
    'color: #c4b5fd; font-size: 11px; font-family: monospace',
    'color: #72728a; font-size: 11px; font-family: monospace',
    'color: #a78bfa; font-size: 11px; font-family: monospace',
  ];
  console.log('%c PARIKSHIETH HARISH', S[0]);
  console.log('%c Computer Vision & Cybersecurity Researcher', S[1]);
  console.log('%c ─────────────────────────────────────────', S[2]);
  console.log('%c [*] Inspecting the DOM? Bold move, recruiter.', S[3]);
  console.log('%c [✓] Stack: PyTorch · C++ · Cryptography · Flutter', S[1]);
  console.log('%c [✓] Site: zero-dependency static HTML/CSS/JS', S[1]);
  console.log('%c [>] Reach out: parikshieth@gmail.com', S[3]);
  console.log('%c ─────────────────────────────────────────', S[2]);
}());

/* ─── DELIGHT: EMAIL CLIPBOARD TOAST ─── */
(function () {
  const toast = document.createElement('div');
  toast.id = 'copy-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = '[✓] Copied to clipboard';
  document.body.appendChild(toast);

  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
  }

  // Wire to email links
  document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
    a.addEventListener('click', e => {
      const email = a.href.replace('mailto:', '');
      if (navigator.clipboard) {
        e.preventDefault();
        navigator.clipboard.writeText(email).then(() => {
          showToast('[✓] ' + email + ' copied');
          // Still open the mail client after a brief delay
          setTimeout(() => { window.location.href = a.href; }, 600);
        }).catch(() => {
          // Clipboard denied, fall through to normal mailto: behaviour
          window.location.href = a.href;
        });
      }
    });
  });
}());

/* ─── DELIGHT: SECTION NUM GLITCH ON REVEAL ─── */
(function () {
  const CHARS = '0123456789ABCDEF';
  function scramble(el) {
    const target = el.textContent.trim();
    let frame = 0;
    const total = 10;
    const id = setInterval(() => {
      if (frame >= total) { el.textContent = target; clearInterval(id); return; }
      el.textContent = CHARS[Math.floor(Math.random() * CHARS.length)] +
                       CHARS[Math.floor(Math.random() * CHARS.length)];
      frame++;
    }, 40);
  }

  if (prefersReducedMotion) return; // skip animation for reduced-motion users

  const numObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        numObserver.unobserve(e.target);
        setTimeout(() => scramble(e.target), 120);
      }
    });
  }, { threshold: 0.8 });

  document.querySelectorAll('.section-num').forEach(el => numObserver.observe(el));
}());

/* ─── DELIGHT: TERMINAL RED DOT RESETS SESSION ─── */
(function () {
  const redDot = document.querySelector('.terminal-dot.red');
  if (!redDot) return;
  redDot.title = 'Clear session';
  redDot.addEventListener('click', () => {
    // Interrupt current session, show blank prompt, restart loop
    termGeneration++;
    termBody.innerHTML = '';
    const cursorLine = makeLine();
    const prompt = document.createElement('span');
    prompt.className = 't-prompt';
    prompt.textContent = '❯';
    const cur = document.createElement('span');
    cur.className = 't-cursor';
    cursorLine.appendChild(prompt);
    cursorLine.appendChild(cur);
    termBody.appendChild(cursorLine);
    setTimeout(loop, 900);
  });
}());

/* \u2500\u2500\u2500 EARLIER WORK TOGGLE \u2500\u2500\u2500 */
(function () {
  const toggle    = document.getElementById('earlier-work-toggle');
  const rows      = document.getElementById('earlier-work-rows');
  const labelText = toggle && toggle.querySelector('.earlier-work-toggle-text');
  const statusEl  = document.getElementById('ewt-status');
  const barEl     = document.getElementById('ewt-bar');
  const pctEl     = document.getElementById('ewt-pct');
  if (!toggle || !rows) return;

  const TOTAL_BLOCKS = 20;
  const BLOCK_FILLED = '█';
  const BLOCK_EMPTY  = '░';

  // Status messages cycle at specific fill milestones
  const MESSAGES = [
    { at:  0, text: 'INITIATING DECRYPTION...' },
    { at:  3, text: 'ENTERING PASSPHRASE...' },
    { at:  7, text: 'VERIFYING KEYFILE...' },
    { at: 11, text: 'CROSS-REFERENCING ARCHIVES...' },
    { at: 15, text: 'DECLASSIFYING RECORDS...' },
    { at: 18, text: 'SECURITY CLEARANCE GRANTED' },
  ];

  // Build the block spans once
  const blockEls = [];
  for (let i = 0; i < TOTAL_BLOCKS; i++) {
    const s = document.createElement('span');
    s.className = 'ewt-block';
    s.textContent = BLOCK_EMPTY;
    barEl.appendChild(s);
    blockEls.push(s);
  }

  let animationId = null;

  function resetBar() {
    blockEls.forEach(b => {
      b.textContent = BLOCK_EMPTY;
      b.className = 'ewt-block';
    });
    if (statusEl) statusEl.textContent = 'INITIATING DECRYPTION...';
    if (pctEl) { pctEl.textContent = '0%'; pctEl.classList.remove('complete'); }
  }

  function runDeclassifyAnimation(onComplete) {
    resetBar();

    // Each block takes ~100-130ms, staggered 
    // Total: ~20 * 110 = ~2200ms, then 300ms grace = ~2500ms total
    const BASE_DELAY  = 80;  // ms between blocks
    const JITTER      = 40;  // ms random jitter per block

    let currentBlock = 0;

    function fillNext() {
      if (currentBlock >= TOTAL_BLOCKS) {
        // All filled: pulse to green
        blockEls.forEach(b => {
          b.className = 'ewt-block filled-full';
          b.textContent = BLOCK_FILLED;
        });
        if (pctEl) { pctEl.textContent = '100%'; pctEl.classList.add('complete'); }
        if (statusEl) statusEl.textContent = 'ACCESS GRANTED ///';

        animationId = setTimeout(onComplete, 420);
        return;
      }

      // Check for a message milestone
      const msg = MESSAGES.slice().reverse().find(m => currentBlock >= m.at);
      if (msg && statusEl && statusEl.textContent !== msg.text) {
        statusEl.textContent = msg.text;
      }

      // Light up this block
      blockEls[currentBlock].textContent = BLOCK_FILLED;
      blockEls[currentBlock].className = 'ewt-block filled';

      // Update % counter
      const pct = Math.round(((currentBlock + 1) / TOTAL_BLOCKS) * 100);
      if (pctEl) pctEl.textContent = pct + '%';

      currentBlock++;
      const delay = BASE_DELAY + Math.random() * JITTER;
      animationId = setTimeout(fillNext, delay);
    }

    fillNext();
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';

    if (isOpen) {
      // --- Collapse instantly ---
      clearTimeout(animationId);
      toggle.classList.remove('is-loading');
      toggle.setAttribute('aria-expanded', 'false');
      rows.hidden = true;
      if (labelText) labelText.textContent = 'Show Earlier Work';
      resetBar();
      return;
    }

    // --- Expand with animation ---
    if (toggle.classList.contains('is-loading')) return; // already animating

    if (prefersReducedMotion) {
      // Skip animation for reduced-motion users
      toggle.setAttribute('aria-expanded', 'true');
      rows.hidden = false;
      if (labelText) labelText.textContent = 'Hide Earlier Work';
      return;
    }

    toggle.classList.add('is-loading');

    runDeclassifyAnimation(() => {
      // Reveal the rows
      rows.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      toggle.classList.remove('is-loading');
      if (labelText) labelText.textContent = 'Hide Earlier Work';

      // Reveal any un-observed elements (IntersectionObserver won't fire on hidden content)
      rows.querySelectorAll('.reveal:not(.visible)').forEach(el => {
        el.classList.add('visible');
      });
    });
  });
}());

/* ─── SIDE RAIL: LIVE CLOCK ─── */
(function () {
  const timeEl = document.getElementById('rail-time-l');
  if (!timeEl) return;
  function tick() {
    const now = new Date();
    // Display in IST (UTC+5:30)
    const ist = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
    const h = String(ist.getUTCHours()).padStart(2, '0');
    const m = String(ist.getUTCMinutes()).padStart(2, '0');
    const s = String(ist.getUTCSeconds()).padStart(2, '0');
    timeEl.textContent = `${h}:${m}:${s}`;
  }
  tick();
  setInterval(tick, 1000);
}());

/* ─── AMBIENT BACKGROUND CANVAS ─── */
(function () {
  if (prefersReducedMotion) return;

  const canvas = document.getElementById('ambient-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Node configuration
  const NODE_COUNT = 22;
  const ACCENT_V   = [167, 139, 250]; // --accent
  const ACCENT_T   = [45, 212, 191];  // --cat-security (teal)

  // Generate nodes scattered across full viewport, weighted toward sides
  function makeNode() {
    // Bias x toward edges (left 0-20% or right 80-100%) for side-ambient feel
    const side = Math.random() < 0.5 ? 'left' : 'right';
    const x = side === 'left'
      ? Math.random() * 0.22 * window.innerWidth
      : (0.78 + Math.random() * 0.22) * window.innerWidth;
    return {
      x, y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.08,
      vy: (Math.random() - 0.5) * 0.08,
      r: 1 + Math.random() * 1.2,
      baseOpacity: 0.04 + Math.random() * 0.08,
      pingTimer: 400 + Math.random() * 1200,  // frames until first ping (staggered start)
      pingAge: -1,                              // -1 = no ping active
      PING_DURATION: 240,                       // ~4s at 60fps, very slow fade
      color: Math.random() < 0.7 ? ACCENT_V : ACCENT_T,
    };
  }

  let nodes = Array.from({ length: NODE_COUNT }, makeNode);

  // Connection edges: pairs of nearby nodes get a faint line
  function getEdges() {
    const MAX_DIST = 160;
    const edges = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) edges.push({ i, j, dist, maxDist: MAX_DIST });
      }
    }
    return edges;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update node positions (slow drift)
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      // Wrap around
      if (n.x < -20)  n.x = canvas.width + 20;
      if (n.x > canvas.width  + 20) n.x = -20;
      if (n.y < -20)  n.y = canvas.height + 20;
      if (n.y > canvas.height + 20) n.y = -20;

      // Ping countdown
      if (n.pingAge >= 0) {
        n.pingAge++;
        if (n.pingAge > n.PING_DURATION) n.pingAge = -1;
      } else {
        n.pingTimer--;
        if (n.pingTimer <= 0) {
          n.pingAge = 0;
          n.pingTimer = 800 + Math.random() * 1600; // 13–40s between pings per node
        }
      }
    }

    // Draw edges
    const edges = getEdges();
    for (const e of edges) {
      const a = nodes[e.i];
      const b = nodes[e.j];
      const fade = 1 - e.dist / e.maxDist;
      const [r, g, bl] = a.color;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = `rgba(${r},${g},${bl},${fade * 0.045})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Draw nodes + pings
    for (const n of nodes) {
      const [r, g, b] = n.color;

      // Base dot
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${n.baseOpacity})`;
      ctx.fill();

      // Radar ping ring
      if (n.pingAge >= 0) {
        const t = n.pingAge / n.PING_DURATION;   // 0→1
        const pingR = n.r + t * 18;
        const pingO = (1 - t) * 0.22;
        ctx.beginPath();
        ctx.arc(n.x, n.y, pingR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r},${g},${b},${pingO})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Inner bright flash at start of ping
        if (t < 0.15) {
          const flash = (0.15 - t) / 0.15;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${flash * 0.35})`;
          ctx.fill();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
}());

