/* ─── COUNT-UP ANIMATION ─── */
function runCountUp(el) {
  const target = parseFloat(el.dataset.countTarget);
  if (isNaN(target)) return;
  const suffix = el.dataset.countSuffix || '';
  const duration = 1100;
  const start = performance.now();

  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3); // ease-out-cubic
    const val = target * eased;
    el.textContent = (target < 10 ? val.toFixed(1) : Math.round(val)) + suffix;
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(tick);
}

const obs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = 'true';
      runCountUp(entry.target);
    }
  });
}, { threshold: 0.6 });

// Observe all count-up targets (both cards and dossier metrics)
function initCountUps() {
  document.querySelectorAll('[data-count-target]').forEach(el => obs.observe(el));
}

// Export for dynamic elements (e.g. dossier metrics strip)
export function observeCountUps(root) {
  (root || document).querySelectorAll('[data-count-target]').forEach(el => obs.observe(el));
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCountUps);
} else {
  initCountUps();
}
