/* ============================================================
   SCRIPT.JS — Prajwal Hegde · Bento Portfolio
   Handles: theme toggle, mobile nav, scroll-reveal,
            typewriter, count-up.
   NOTE: The no-flash theme script lives inline in <head>.
   ============================================================ */

'use strict';

/* ----------------------------------------------------------
   THEME TOGGLE
   ---------------------------------------------------------- */
function initTheme() {
  var toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;

  function updateLabel() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    toggle.setAttribute(
      'aria-label',
      isDark ? 'Switch to light theme' : 'Switch to dark theme'
    );
  }

  updateLabel();

  toggle.addEventListener('click', function () {
    var html = document.documentElement;
    var isDark = html.getAttribute('data-theme') === 'dark';
    var next = isDark ? 'light' : 'dark';

    html.setAttribute('data-theme', next);
    updateLabel();

    try {
      localStorage.setItem('theme', next);
    } catch (e) {
      /* localStorage blocked — silently ignore */
    }
  });
}

/* ----------------------------------------------------------
   MOBILE NAVIGATION
   ---------------------------------------------------------- */
function initMobileNav() {
  var hamburger = document.querySelector('.nav-toggle');
  var mobileMenu = document.getElementById('nav-mobile-menu');
  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close navigation menu');
    mobileMenu.classList.add('is-open');
    document.body.classList.add('menu-open');

    var firstLink = mobileMenu.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
    mobileMenu.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    hamburger.focus();
  }

  hamburger.addEventListener('click', function () {
    var isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });

  document.addEventListener('click', function (e) {
    if (
      hamburger.getAttribute('aria-expanded') === 'true' &&
      !hamburger.contains(e.target) &&
      !mobileMenu.contains(e.target)
    ) {
      closeMenu();
    }
  });

  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth >= 768 && hamburger.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });
}

/* ----------------------------------------------------------
   SCROLL REVEAL
   ---------------------------------------------------------- */
function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(function (el) { observer.observe(el); });
}

/* ----------------------------------------------------------
   TYPEWRITER
   Types once, then shows a blinking cursor.
   Falls back to static text under prefers-reduced-motion
   or when JS is off (text is already in the HTML).
   ---------------------------------------------------------- */
function initTypewriter() {
  var el = document.querySelector('.typewriter-text');
  if (!el) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var fullText = el.textContent.trim();
  el.textContent = '';

  var i = 0;

  function type() {
    if (i < fullText.length) {
      el.textContent += fullText.charAt(i);
      i++;
      setTimeout(type, 45 + Math.random() * 35);
    }
  }

  /* Small delay so the card renders first */
  setTimeout(type, 700);
}

/* ----------------------------------------------------------
   COUNT-UP
   Animates a number from 0 to data-target when visible.
   Respects prefers-reduced-motion (shows final number).
   ---------------------------------------------------------- */
function initCountUp() {
  var elements = document.querySelectorAll('.count-up');
  if (!elements.length) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return; /* HTML already shows the final number */

  if (!('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el = entry.target;
        var target = parseInt(el.getAttribute('data-target'), 10);
        var prefix = el.getAttribute('data-prefix') || '';
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1200;
        var startTime = performance.now();

        function easeOutQuart(t) {
          return 1 - Math.pow(1 - t, 4);
        }

        function update(now) {
          var elapsed = now - startTime;
          var progress = Math.min(elapsed / duration, 1);
          var current = Math.round(easeOutQuart(progress) * target);
          el.textContent = prefix + current.toLocaleString('en-IN') + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  elements.forEach(function (el) { observer.observe(el); });
}

/* ----------------------------------------------------------
   INIT
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  initTheme();
  initMobileNav();
  initScrollReveal();
  initTypewriter();
  initCountUp();
});
