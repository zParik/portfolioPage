/* ─── DELIGHTS ─── */
import { prefersReducedMotion } from './utils.js';

/* ── Console Easter Egg ── */
{
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
}

/* ── Email Clipboard Toast ── */
{
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
}

/* ── Section Num Glitch on Reveal ── */
{
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

  if (!prefersReducedMotion) {
    const numObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          numObserver.unobserve(e.target);
          setTimeout(() => scramble(e.target), 120);
        }
      });
    }, { threshold: 0.8 });

    document.querySelectorAll('.section-num').forEach(el => numObserver.observe(el));
  }
}

/* ── Earlier Work Toggle ── */
{
  const toggle = document.getElementById('earlier-work-toggle');
  const rows = document.getElementById('earlier-work-rows');
  const labelText = toggle && toggle.querySelector('.earlier-work-toggle-text');
  const statusEl = document.getElementById('ewt-status');
  const barEl = document.getElementById('ewt-bar');
  const pctEl = document.getElementById('ewt-pct');

  if (toggle && rows) {
    const TOTAL_BLOCKS = 20;
    const BLOCK_FILLED = '█';
    const BLOCK_EMPTY = '░';

    // Status messages cycle at specific fill milestones
    const MESSAGES = [
      { at: 0, text: 'INITIATING DECRYPTION...' },
      { at: 3, text: 'ENTERING PASSPHRASE...' },
      { at: 7, text: 'VERIFYING KEYFILE...' },
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
      const BASE_DELAY = 80;  // ms between blocks
      const JITTER = 40;      // ms random jitter per block

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
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
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
  }
}

/* ── Side Rail: Live Clock ── */
{
  const timeEl = document.getElementById('rail-time-l');
  if (timeEl) {
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
  }
}

/* ── Spec Tag Decode — character scramble on section 02 entry ── */
{
  if (!prefersReducedMotion) {
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-:/';
    const SCRAMBLE_DURATION = 480; // ms total per tag
    const LOCK_SPEED = 0.72;       // fraction of duration when locking starts (chars resolve left→right)
    const STAGGER_BASE = 28;       // ms between each tag's start

    function randChar() {
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    }

    function scrambleTag(tag, delay) {
      const original = tag.textContent;
      // skip tags that are empty or only whitespace
      if (!original.trim()) return;

      setTimeout(() => {
        const start = performance.now();

        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / SCRAMBLE_DURATION, 1);
          // how many chars are "locked" from the left
          const lockCount = progress > LOCK_SPEED
            ? Math.ceil((progress - LOCK_SPEED) / (1 - LOCK_SPEED) * original.length)
            : 0;

          let result = '';
          for (let i = 0; i < original.length; i++) {
            if (original[i] === ' ') { result += ' '; continue; }
            if (i < lockCount) {
              result += original[i];
            } else {
              // scramble: use random char but preserve case feel
              result += Math.random() < 0.3 ? original[i] : randChar().toLowerCase();
            }
          }
          tag.textContent = result;

          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            tag.textContent = original; // guarantee final text is correct
            tag.removeAttribute('data-scrambling');
          }
        }

        tag.setAttribute('data-scrambling', '');
        requestAnimationFrame(tick);
      }, delay);
    }

    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
      let fired = false;
      const observer = new IntersectionObserver(entries => {
        if (fired) return;
        if (!entries[0].isIntersecting) return;
        fired = true;
        observer.disconnect();

        const tags = skillsSection.querySelectorAll('.spec-tag');
        tags.forEach((tag, i) => scrambleTag(tag, i * STAGGER_BASE));
      }, { threshold: 0.15 });

      observer.observe(skillsSection);
    }
  }
}
