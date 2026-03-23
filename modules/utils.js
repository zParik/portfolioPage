/* ─── SHARED UTILITIES ─── */
export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
