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

/* Hero motion field. Builds a column of fine lines behind the wordmark,
   leans them toward the pointer, and drifts them on their own when there
   is none, so the first screen moves without a photo or a video on it.
   Decoration only: the container is aria-hidden and takes no pointer
   events, so nothing here stands between a visitor and the buttons.
   Skipped outright for anyone who has asked for reduced motion, and
   parked whenever the hero is scrolled out of view so a phone is not
   animating a screen nobody is looking at. */
(function () {
  var field = document.querySelector('[data-hero-field]');
  if (!field) return;

  var COUNT = 26;
  var lines = [];
  for (var i = 0; i < COUNT; i++) {
    var t = i / (COUNT - 1);
    // Width peaks in the middle so the stack reads as a column.
    var w = 16 + 46 * Math.sin(Math.PI * t);
    var el = document.createElement('i');
    el.style.top = (6 + t * 88) + '%';
    el.style.width = w + '%';
    el.style.marginLeft = (-w / 2) + '%';
    var base = 0.12 + 0.28 * Math.sin(Math.PI * t);
    el.style.opacity = base.toFixed(3);
    field.appendChild(el);
    lines.push({ el: el, t: t, base: base });
  }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce && reduce.matches) return;

  var hero = field.parentElement;
  var px = 0.5, py = 0.5, pointer = false;
  var raf = 0, running = false;

  hero.addEventListener('pointermove', function (e) {
    var r = hero.getBoundingClientRect();
    px = (e.clientX - r.left) / r.width;
    py = (e.clientY - r.top) / r.height;
    pointer = true;
  }, { passive: true });
  hero.addEventListener('pointerleave', function () { pointer = false; }, { passive: true });

  function frame(now) {
    var time = now / 1000;
    for (var i = 0; i < lines.length; i++) {
      var L = lines[i];
      var x = Math.sin(time * 0.55 + L.t * 5.2) * 9;
      var opacity = L.base;
      if (pointer) {
        var d = L.t - py;
        var pull = Math.exp(-(d * d) / 0.012);
        x += (px - 0.5) * 120 * pull;
        opacity += pull * 0.45;
      }
      L.el.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
      L.el.style.opacity = (opacity < 0.85 ? opacity : 0.85).toFixed(3);
    }
    raf = requestAnimationFrame(frame);
  }

  function start() { if (!running) { running = true; raf = requestAnimationFrame(frame); } }
  function stop()  { if (running) { running = false; cancelAnimationFrame(raf); pointer = false; } }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries[0].isIntersecting ? start() : stop();
    }, { threshold: 0 }).observe(hero);
  } else {
    start();
  }
  document.addEventListener('visibilitychange', function () {
    document.hidden ? stop() : start();
  });
})();

/* Register the service worker so the site can be installed to the home screen. */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').catch(function () { /* non-fatal */ });
  });
}
