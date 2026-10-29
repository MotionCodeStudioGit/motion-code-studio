(() => {
  const nav = document.querySelector('[data-nav]');
  const hero = document.querySelector('.hero');
  const mobileCta = document.querySelector('.mobile-cta');

  let lastY = window.scrollY;
  let idleTimer;
  const onScroll = () => {
    const scrolled = window.scrollY;
    // Nav: switch to scrolled style after 24px
    if (nav) nav.classList.toggle('is-scrolled', scrolled > 24);
    // Past-hero state: reveal nav wordmark + gate the mobile CTA
    if (hero) {
      const heroBottom = hero.offsetTop + hero.offsetHeight;
      const triggerPoint = heroBottom - window.innerHeight * 0.3;
      const pastHero = scrolled > triggerPoint;
      if (nav) nav.classList.toggle('is-past-hero', pastHero);
      if (mobileCta) {
        const goingDown = scrolled > lastY + 4;
        const goingUp   = scrolled < lastY - 4;
        // Hide while actively scrolling down; show on scroll-up; never before hero
        if (!pastHero || goingDown) {
          mobileCta.classList.remove('is-visible');
        } else if (goingUp) {
          mobileCta.classList.add('is-visible');
        }
        // Slide back in shortly after scrolling stops (idle)
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          if (window.scrollY > triggerPoint) mobileCta.classList.add('is-visible');
        }, 550);
      }
    }
    lastY = scrolled;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Body map: hovering a pin lights its list row and the other way round.
  // Purely presentational. The pins and the rows are both ordinary links,
  // so every area is still reachable with this switched off.
  const bmap = document.querySelector('[data-bmap]');
  if (bmap) {
    const setActive = (region, on) => {
      bmap.querySelectorAll('[data-region="' + region + '"]')
          .forEach(el => el.classList.toggle('is-active', on));
    };
    bmap.querySelectorAll('[data-region]').forEach(el => {
      const region = el.getAttribute('data-region');
      el.addEventListener('mouseenter', () => setActive(region, true));
      el.addEventListener('mouseleave', () => setActive(region, false));
      el.addEventListener('focus',      () => setActive(region, true));
      el.addEventListener('blur',       () => setActive(region, false));
    });
  }

  const targets = document.querySelectorAll(
    '.hero__text, .split-section, .ptile, .half, .approach-section, .visit__col, .visit__details, .bmap__head, .bmap__grid'
  );
  targets.forEach((el, i) => {
    el.setAttribute('data-reveal', '');
    // Stagger preview tiles for cinematic entrance
    if (el.classList.contains('ptile')) {
      el.style.transitionDelay = (i % 2 === 0 ? '0ms' : '120ms');
    }
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(el => io.observe(el));
  } else {
    targets.forEach(el => el.classList.add('is-in'));
  }
})();

/* Register the service worker so the site can be installed to the home screen. */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').catch(function () { /* non-fatal */ });
  });
}
