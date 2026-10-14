// Enable JS styling features
document.documentElement.classList.add('js');

// Activate smooth scrolling only on user navigation or after initial load/restore settles
(function () {
  function enableSmoothScroll() {
    document.documentElement.classList.add('smooth-scroll');
  }

  // Activate immediately when clicking any in-page link
  document.addEventListener('click', function (e) {
    const a = e.target.closest('a[href^="#"]');
    if (a) enableSmoothScroll();
  }, { passive: true });

  // Activate after browser finishes initial layout and scroll position restoration
  window.addEventListener('load', function () {
    requestAnimationFrame(function () {
      setTimeout(enableSmoothScroll, 150);
    });
  });
})();

// Typing effect for roles in hero section
(function () {
  const el = document.getElementById('typed');
  if (!el) return;
  const roles = ['UI/UX Designer', 'Web Developer', 'IT Student'];
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
  let r = 0, c = 0, del = false;
  function tick() {
    const w = roles[r];
    el.textContent = w.slice(0, c);
    let t = del ? 45 : 90;
    if (!del && c === w.length) {
      del = true;
      t = 1400;
    } else if (del && c === 0) {
      del = false;
      r = (r + 1) % roles.length;
      t = 350;
    } else {
      c += del ? -1 : 1;
    }
    setTimeout(tick, t);
  }
  c = 0;
  tick();
})();

// Scroll progress bar, active navigation links, and reveal animations
(function () {
  const pg = document.getElementById('pg');
  const hd = document.querySelector('header');

  function onScroll() {
    if (pg) {
      const h = document.documentElement.scrollHeight - innerHeight;
      pg.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
    }
    if (hd) {
      hd.classList.toggle('sc', scrollY > 10);
    }
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      entry.target.classList.toggle('in', entry.isIntersecting);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  document.querySelectorAll('.rv').forEach(function (el) {
    io.observe(el);
  });

  const links = [].slice.call(document.querySelectorAll('nav a'));
  const ids = links.map(function (a) { return a.getAttribute('href').slice(1); });

  function setActive() {
    let cur = ids[0];
    ids.forEach(function (id) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 140) cur = id;
    });
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) {
      cur = ids[ids.length - 1];
    }
    links.forEach(function (a) {
      a.classList.toggle('on', a.getAttribute('href') === '#' + cur);
    });
  }
  addEventListener('scroll', setActive, { passive: true });
  addEventListener('resize', setActive);
  setActive();
})();

// Update copyright year
const yearEl = document.getElementById('y');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}


// Dark / Light Mode Button
(function () {
  const btn = document.getElementById('theme-btn') || document.getElementById('theme-toggle');
  if (!btn) return;

  const favicon = document.querySelector('link[rel="icon"]');

  function getCurrentTheme() {
    const explicit = document.documentElement.getAttribute('data-theme');
    if (explicit) return explicit;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function updateAria() {
    const isDark = getCurrentTheme() === 'dark';
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    if (favicon) {
      favicon.href = isDark ? 'Personal/icon.png' : 'Personal/icon2.png';
    }
  }

  updateAria();

  btn.addEventListener('click', function () {
    const current = getCurrentTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch (err) { }
    updateAria();
  });
})();

// Mobile Burger Menu Toggle
(function () {
  const burger = document.getElementById('burger-btn');
  const menu = document.getElementById('nav-menu');
  if (!burger || !menu) return;

  function closeMenu() {
    burger.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
  }

  function toggleMenu() {
    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    menu.classList.toggle('open', !isOpen);
  }

  burger.addEventListener('click', toggleMenu);

  // Close menu when clicking any nav link
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when clicking outside
  document.addEventListener('click', function (e) {
    if (!menu.contains(e.target) && !burger.contains(e.target) && menu.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu();
    }
  });
})();



// Quick Top / Back to Top Button Controller
(function () {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  function toggleBackToTop() {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }

  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  toggleBackToTop(); // Initial check

  backToTopBtn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
})();

// Interactive & Scroll-Reactive Ambient Glow Physics
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const g1 = document.getElementById('glow-1');
  const g2 = document.getElementById('glow-2');
  const g3 = document.getElementById('glow-3');
  if (!g1 || !g2 || !g3) return;

  let mouseX = 0, mouseY = 0;
  let curMouseX = 0, curMouseY = 0;
  let isTicking = false;

  // Track subtle mouse movement across viewport
  window.addEventListener('mousemove', function (e) {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    requestTick();
  }, { passive: true });

  window.addEventListener('scroll', function () {
    requestTick();
  }, { passive: true });

  function requestTick() {
    if (!isTicking) {
      requestAnimationFrame(updateAmbient);
      isTicking = true;
    }
  }

  function updateAmbient() {
    isTicking = false;

    // Silky damping for subtle mouse influence
    curMouseX += (mouseX - curMouseX) * 0.04;
    curMouseY += (mouseY - curMouseY) * 0.04;

    const scrollH = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollH > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollH)) : 0;

    // Calmer harmonic motion: gentle floating breathing rather than high-speed traversal
    const g1X = (Math.sin(progress * Math.PI) * 75) + (curMouseX * 16);
    const g1Y = (progress * 130) + (curMouseY * 14);
    const g1Rot = progress * 75;
    const g1Scale = 1 + Math.sin(progress * Math.PI) * 0.16;
    const g1Hue = Math.round(progress * 30);

    const g2X = (Math.cos(progress * Math.PI) * -65) + (curMouseX * -16);
    const g2Y = ((progress - 0.5) * -110) + (curMouseY * -14);
    const g2Rot = -progress * 60;
    const g2Scale = 1.04 + Math.sin(progress * Math.PI * 1.5) * 0.12;
    const g2Hue = Math.round(progress * 40);

    const g3X = (Math.sin(progress * 2 * Math.PI) * 45) + (curMouseX * 12);
    const g3Y = (progress * -95) + (curMouseY * 12);
    const g3Rot = progress * 45;
    const g3Scale = 0.96 + progress * 0.14;

    g1.style.transform = 'translate3d(' + g1X.toFixed(1) + 'px, ' + g1Y.toFixed(1) + 'px, 0) rotate(' + g1Rot.toFixed(1) + 'deg) scale(' + g1Scale.toFixed(2) + ')';
    g1.style.filter = 'blur(130px) hue-rotate(' + g1Hue + 'deg)';

    g2.style.transform = 'translate3d(' + g2X.toFixed(1) + 'px, ' + g2Y.toFixed(1) + 'px, 0) rotate(' + g2Rot.toFixed(1) + 'deg) scale(' + g2Scale.toFixed(2) + ')';
    g2.style.filter = 'blur(130px) hue-rotate(' + g2Hue + 'deg)';

    g3.style.transform = 'translate3d(' + g3X.toFixed(1) + 'px, ' + g3Y.toFixed(1) + 'px, 0) rotate(' + g3Rot.toFixed(1) + 'deg) scale(' + g3Scale.toFixed(2) + ')';

    // Continue frame update while mouse easing is settling
    if (Math.abs(mouseX - curMouseX) > 0.003 || Math.abs(mouseY - curMouseY) > 0.003) {
      requestTick();
    }
  }

  // Initial calculation
  updateAmbient();
})();

