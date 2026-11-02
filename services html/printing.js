/* JP ADWORKS – Printing page: menu, reveal, smooth scroll, back-to-top, missing-image fallback.
   Fully independent of the homepage script. */
(() => {
  'use strict';

  /* Missing images → neutral labelled placeholder so layout stays balanced until real files are added */
  document.querySelectorAll('img').forEach(img => {
    const swap = () => {
      const ph = document.createElement('span');
      ph.className = 'ph ' + img.className;
      ph.textContent = img.alt || img.getAttribute('src');
      img.replaceWith(ph);
    };
    img.addEventListener('error', swap, { once: true });
    if (img.complete && img.naturalWidth === 0) swap();
  });

  /* Mobile hamburger menu (same behaviour as homepage) */
  const burger = document.querySelector('.burger');
  const nav = document.getElementById('nav');
  const setMenu = open => {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 768) setMenu(false); });

  /* Smooth scroll for any same-page #anchor (cross-page links use the browser default) */
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const t = a.getAttribute('href').length > 1 && document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  }));

  /* Scroll reveal (neutralised by prefers-reduced-motion in CSS) */
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: .12 });
    items.forEach(el => io.observe(el));
  } else items.forEach(el => el.classList.add('in'));

  /* Back to top button */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => backToTop.classList.toggle('is-visible', window.scrollY > 300), { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();
