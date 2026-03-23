/* ─── HERO BOOT SEQUENCE ─── */
/* Cinematic classified-dossier entry: scan sweep → decrypt → staged reveal */
import { prefersReducedMotion, sleep } from './utils.js';

if (!prefersReducedMotion) {
  const hero = document.querySelector('.hero');
  if (hero) {
    // Inject the scan-line element
    const scanner = document.createElement('div');
    scanner.className = 'hero-boot-scanner';
    scanner.setAttribute('aria-hidden', 'true');
    hero.appendChild(scanner);

    async function bootSequence() {
      // ── Phase 1: Scan line sweeps across hero ──────────────────────────────
      scanner.classList.add('active');
      await sleep(80);
      scanner.classList.add('scanning');
      await sleep(620); // matches CSS animation duration

      // ── Phase 2: Eyebrow (classification tag) ─────────────────────────────
      const eyebrow = document.querySelector('.hero-eyebrow');
      if (eyebrow) eyebrow.classList.add('boot-visible');
      await sleep(220);

      // ── Phase 3: Name — fade up cleanly, then a single light shimmer ───────
      const nameEl = document.querySelector('.hero-name');
      if (nameEl) {
        nameEl.classList.add('boot-visible');
        await sleep(380); // let the fade-up settle
        nameEl.classList.add('boot-shimmer');
        await sleep(820); // shimmer sweep duration + grace
        nameEl.classList.remove('boot-shimmer');
      }
      await sleep(60);

      // ── Phase 4: Impact headline ───────────────────────────────────────────
      const impact = document.querySelector('.hero-impact');
      if (impact) impact.classList.add('boot-visible');
      await sleep(150);

      // ── Phase 5: Executive summary ─────────────────────────────────────────
      const abstract = document.querySelector('.hero-abstract');
      if (abstract) abstract.classList.add('boot-visible');
      await sleep(150);

      // ── Phase 6: Bottom row (socials + CTA) ───────────────────────────────
      const bottomRow = document.querySelector('.hero-bottom-row');
      if (bottomRow) bottomRow.classList.add('boot-visible');
      await sleep(160);

      // ── Phase 7: Manifest rule line ────────────────────────────────────────
      const manifestRule = document.querySelector('.hero-manifest .manifest-rule');
      if (manifestRule) manifestRule.classList.add('boot-visible');
      await sleep(90);

      // ── Phase 8: Manifest columns — staggered ─────────────────────────────
      const cols = document.querySelectorAll('.hero-manifest .manifest-col');
      for (const col of cols) {
        col.classList.add('boot-visible');
        await sleep(115);
      }

      // ── Phase 9: Scanner exit ──────────────────────────────────────────────
      scanner.classList.add('done');
      await sleep(280);

      // ── Boot complete: hand off to normal visibility system ────────────────
      document.body.removeAttribute('data-boot');
      document.querySelectorAll(
        '.hero .reveal, .hero-inner, .hero-name, .hero-eyebrow, .hero-manifest, .hero-abstract, .hero-socials, .hero-actions'
      ).forEach(el => el.classList.add('visible'));
    }

    bootSequence();
  }
}
