/* ─── SHARED UTILITIES ─── */
export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

export function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
