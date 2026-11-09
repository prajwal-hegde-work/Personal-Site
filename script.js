/* ============================================================
   SCRIPT.JS — Prajwal Hegde Personal Profile
   Handles: theme toggle, mobile nav, scroll-reveal
   NOTE: The no-flash theme script lives inline in <head> of
         each HTML file. This file wires everything up after
         DOMContentLoaded.
   ============================================================ */

'use strict';

/* ----------------------------------------------------------
   THEME TOGGLE
   ---------------------------------------------------------- */
function initTheme() {
  const toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;

  function updateLabel() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    toggle.setAttribute(
      'aria-label',
      isDark ? 'Switch to light theme' : 'Switch to dark theme'
    );
  }

  updateLabel(); // Set correct label on page load

  toggle.addEventListener('click', () => {
    const html  = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    const next  = isDark ? 'light' : 'dark';

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
  const hamburger = document.querySelector('.nav-toggle');
  const mobileMenu = document.getElementById('nav-mobile-menu');
  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close navigation menu');
    mobileMenu.classList.add('is-open');
    document.body.classList.add('menu-open');

    // Move focus to first focusable item
    const firstLink = mobileMenu.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
    mobileMenu.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    hamburger.focus();
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });

  // Close on tap outside menu/hamburger
  document.addEventListener('click', (e) => {
    if (
      hamburger.getAttribute('aria-expanded') === 'true' &&
      !hamburger.contains(e.target) &&
      !mobileMenu.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // Close when a nav link is clicked
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close if viewport grows to desktop width
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && hamburger.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });
}

/* ----------------------------------------------------------
   SCROLL REVEAL
   Uses IntersectionObserver; respects prefers-reduced-motion.
   CSS sets the initial hidden state; this adds .is-visible.
   ---------------------------------------------------------- */
function initScrollReveal() {
  // If the user prefers reduced motion, the CSS already shows
  // elements without animation — nothing else to do here.
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  if (prefersReducedMotion) return;

  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  // Fallback for older browsers
  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Animate only once
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -48px 0px',
    }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ----------------------------------------------------------
   INIT
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initScrollReveal();
});
