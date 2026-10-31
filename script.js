/* JP ADWORKS – lightweight interactions: menu, carousels, reveal, missing-image fallback */
(() => {
  'use strict';

  /* Missing images → neutral placeholder showing the alt text, so layout never breaks
     while you haven't yet dropped real files into /assets. */
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

  /* Mobile menu */
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

  /* Update active navbar link on scroll */
  const sectionLinks = [...document.querySelectorAll(
    '#nav a[href^="#"]:not(.btn)'
  )];

  function updateActiveNav() {
    let currentId = 'hero';

    sectionLinks.forEach(link => {
      const section = document.querySelector(link.getAttribute('href'));

      if (section && section.getBoundingClientRect().top <= 150) {
        currentId = section.id;
      }
    });

    if (window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 5) {
      currentId = 'contact';
    }

    sectionLinks.forEach(link => {
      link.classList.toggle(
        'is-active',
        link.getAttribute('href') === `#${currentId}`
      );
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  window.addEventListener('load', updateActiveNav);
  updateActiveNav();

  /* Project carousel: native scroll-snap (mouse/touch/keyboard) + prev/next buttons */
  document.querySelectorAll('[data-carousel]').forEach(c => {
    const track = c.querySelector('.carousel__track');
    const step = () => (track.firstElementChild?.getBoundingClientRect().width || 300) + 16;
    c.querySelector('.arrow--prev').onclick = () => track.scrollBy({ left: -step(), behavior: 'smooth' });
    c.querySelector('.arrow--next').onclick = () => track.scrollBy({ left: step(), behavior: 'smooth' });
    // Mouse drag for desktop
    let down = false, sx = 0, sl = 0;
    track.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') { down = true; sx = e.clientX; sl = track.scrollLeft; track.classList.add('drag'); } });
    window.addEventListener('pointerup', () => { down = false; track.classList.remove('drag'); });
    track.addEventListener('pointermove', e => { if (down) track.scrollLeft = sl - (e.clientX - sx); });
  });

  /* Testimonial slider */
  document.querySelectorAll('[data-testi]').forEach(t => {
    const slides = [...t.querySelectorAll('blockquote')];
    let i = 0;
    t.querySelectorAll('[data-dir]').forEach(b => b.addEventListener('click', () => {
      slides[i].classList.remove('is-on');
      i = (i + Number(b.dataset.dir) + slides.length) % slides.length;
      slides[i].classList.add('is-on');
    }));
  });

  /* Scroll reveal (disabled automatically for reduced motion via CSS) */
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
    items.forEach(el => io.observe(el));
  } else items.forEach(el => el.classList.add('in'));

  /* Back to Top Button */
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('is-visible', window.scrollY > 300);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
})();
