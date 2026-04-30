/* ============================================
   Nyxx — Main JavaScript
   ============================================ */

(function () {
  'use strict';

  // --- roundRect polyfill ---
  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
      if (w < 2 * r) r = w / 2;
      if (h < 2 * r) r = h / 2;
      this.beginPath();
      this.moveTo(x + r, y);
      this.arcTo(x + w, y, x + w, y + h, r);
      this.arcTo(x + w, y + h, x, y + h, r);
      this.arcTo(x, y + h, x, y, r);
      this.arcTo(x, y, x + w, y, r);
      this.closePath();
      return this;
    };
  }

  // --- Year in footer ---
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Intersection Observer for fade-in ---
  const fadeEls = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    fadeEls.forEach((el) => fadeObserver.observe(el));
  } else {
    // Fallback: show everything
    fadeEls.forEach((el) => el.classList.add('is-visible'));
  }

  // --- Navigation ---
  const nav = document.getElementById('nav');
  const navToggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');
  let lastScroll = 0;

  // Mobile toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
      navLinks.classList.toggle('nav__links--open');
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('nav__links--open');
      });
    });
  }

  // Scroll-based nav behavior
  if (nav) {
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      // Hide/show nav on scroll direction
      if (currentScroll > lastScroll && currentScroll > 200) {
        nav.style.transform = 'translateY(-100%)';
      } else {
        nav.style.transform = 'translateY(0)';
      }

      // Add scrolled class for styling
      if (currentScroll > 50) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight : 72;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Scroll spy (active nav link) ---
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav__link');

  if (sections.length && navLinksAll.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinksAll.forEach((link) => {
              link.classList.toggle(
                'nav__link--active',
                link.getAttribute('href') === `#${id}`
              );
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: `-${nav ? nav.offsetHeight : 72}px 0px -50% 0px` }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // --- Hero Waveform Canvas ---
  const canvas = document.getElementById('heroWaveform');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let animFrame;
    let time = 0;

    function resizeCanvas() {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function drawWaveform() {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      ctx.clearRect(0, 0, width, height);

      const bars = Math.floor(width / 6);
      const barWidth = 2;
      const gap = (width - bars * barWidth) / (bars - 1);

      for (let i = 0; i < bars; i++) {
        const x = i * (barWidth + gap);

        // Generate wave height using layered sine waves
        const baseHeight = Math.sin((i + time) * 0.05) * 0.3;
        const wave2 = Math.sin((i + time * 1.5) * 0.08) * 0.2;
        const wave3 = Math.sin((i + time * 0.7) * 0.12) * 0.15;
        const noise = Math.sin(i * 0.3 + time * 2) * 0.1;
        const heightRatio = Math.abs(baseHeight + wave2 + wave3 + noise) + 0.05;

        const barHeight = Math.max(4, heightRatio * height * 0.6);
        const y = (height - barHeight) / 2;

        // Gradient color based on position
        const alpha = 0.15 + heightRatio * 0.25;
        ctx.fillStyle = `rgba(123, 97, 255, ${alpha})`;

        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 1);
        ctx.fill();
      }

      time += 0.5;
      animFrame = requestAnimationFrame(drawWaveform);
    }

    resizeCanvas();
    drawWaveform();

    window.addEventListener('resize', () => {
      resizeCanvas();
    }, { passive: true });

    // Pause animation when hero is not visible
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            cancelAnimationFrame(animFrame);
          } else {
            drawWaveform();
          }
        });
      },
      { threshold: 0 }
    );

    const hero = document.getElementById('hero');
    if (hero) heroObserver.observe(hero);
  }

  // --- Work Category Filter ---
  const filterBtns = document.querySelectorAll('.work__filter');
  const workItems = document.querySelectorAll('.work__item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active state
      filterBtns.forEach((b) => {
        b.classList.remove('work__filter--active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('work__filter--active');
      btn.setAttribute('aria-selected', 'true');

      // Filter items
      workItems.forEach((item) => {
        const category = item.dataset.category;
        const show = filter === 'all' || category === filter;

        if (show) {
          item.style.display = '';
          item.style.opacity = '0';
          item.style.transform = 'translateY(12px)';
          requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.96)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // --- Gradient orbs parallax ---
  const orbs = document.querySelectorAll('.orb');
  if (orbs.length) {
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      orbs.forEach((orb, i) => {
        const speed = 0.02 + (i * 0.01);
        orb.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }, { passive: true });
  }

})();
