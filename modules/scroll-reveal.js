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
// (skipped during boot sequence — bootSequence() handles hero visibility)
if (!document.body.hasAttribute('data-boot')) {
  document.querySelectorAll('.hero .reveal, .hero-inner, .hero-name, .hero-eyebrow, .hero-manifest, .hero-abstract, .hero-socials, .hero-actions').forEach(el => el.classList.add('visible'));
}

// Manifest rows are now always in the DOM (not display:none) — force reveal so
// IntersectionObserver threshold doesn't block them when section first loads
document.querySelectorAll('.manifest-section .reveal').forEach(el => el.classList.add('visible'));
