/* ─── SCROLLBAR SECTION COLOR ─── */
const sections = [
  { id: 'projects', color: [45, 212, 191] },   // teal
  { id: 'skills', color: [96, 165, 250] },      // blue
  { id: 'background', color: [167, 139, 250] }, // purple
  { id: 'off-clock', color: [251, 191, 36] },   // amber
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
