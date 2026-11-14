/* ========================================
   PORTFOLIO — SCRIPT.JS
   Interactions, animations & particles
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ——— Navbar scroll effect ———
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // ——— Mobile menu toggle ———
  const toggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  // Close menu on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // ——— Active nav link on scroll ———
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-link');
  const observerNav = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinksAll.forEach(l => l.classList.remove('active'));
        const id = entry.target.getAttribute('id');
        const active = document.querySelector(`.nav-link[href="#${id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -60% 0px' });
  sections.forEach(s => observerNav.observe(s));

  // ——— Timeline items fade-in ———
  const timelineItems = document.querySelectorAll('.timeline-item');
  const observerTimeline = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });
  timelineItems.forEach(item => observerTimeline.observe(item));

  // ——— Counter animation for stats ———
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  const observerStats = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        if (el.dataset.animated) return;
        el.dataset.animated = 'true';
        let current = 0;
        const increment = Math.ceil(target / 40);
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current;
        }, 30);
      }
    });
  }, { threshold: 0.5 });
  statNumbers.forEach(n => observerStats.observe(n));

  // ——— Hero particles ———
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      const size = Math.random() * 4 + 2;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 6 + 's';
      p.style.animationDuration = (Math.random() * 6 + 4) + 's';
      particlesContainer.appendChild(p);
    }
  }

  // ——— Smooth reveal for hero image fallback ———
  const heroImg = document.getElementById('hero-image');
  if (heroImg) {
    heroImg.addEventListener('error', () => {
      // If no profile image found, show a placeholder
      heroImg.style.display = 'none';
      const container = heroImg.closest('.hero-image-container');
      if (container) {
        container.innerHTML = `
          <div style="width:100%;height:100%;border-radius:50%;background:var(--bg-card);
            display:flex;align-items:center;justify-content:center;border:2px solid var(--border);
            position:relative;z-index:1;">
            <svg width="80" height="80" fill="none" stroke="var(--text-muted)" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
            </svg>
          </div>
          <div class="hero-image-ring"></div>
        `;
      }
    });
  }

});
