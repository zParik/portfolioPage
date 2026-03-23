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

/* ─── SCROLL-SPY ─── */
const SPY_SECTIONS = ['projects', 'skills', 'background', 'off-clock'];
const spyMap = {};
SPY_SECTIONS.forEach(id => {
  const el = document.getElementById(id);
  const link = document.querySelector(`.nav-links a[href="#${id}"]`);
  if (el && link) spyMap[id] = { el, link };
});

function updateScrollSpy() {
  const threshold = window.scrollY + window.innerHeight * 0.55;
  let active = null;
  for (const id of SPY_SECTIONS) {
    const entry = spyMap[id];
    if (!entry) continue;
    if (entry.el.getBoundingClientRect().top + window.scrollY <= threshold) active = id;
  }
  Object.entries(spyMap).forEach(([id, { link }]) => {
    link.classList.toggle('active', id === active);
  });
}

window.addEventListener('scroll', updateScrollSpy, { passive: true });
updateScrollSpy();

/* ─── DYNAMIC YEAR ─── */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
