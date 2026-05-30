// ─── Theme ──────────────────────────────────────────────────────────────────
const html = document.documentElement;
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
const stored = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', stored);

document.querySelectorAll('.theme-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
});

// ─── Nav scroll ──────────────────────────────────────────────────────────────
const nav = document.querySelector('.nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ─── Active nav link ─────────────────────────────────────────────────────────
const path = window.location.pathname;
document.querySelectorAll('.nav__links a').forEach(a => {
  const href = a.getAttribute('href') || '';
  const cleanHref = href.replace(/^\.\.\//, '').replace(/\/$/, '');
  const cleanPath = path.split('/').pop() || 'index.html';
  if (
    cleanHref === cleanPath ||
    (cleanPath === '' && cleanHref === 'index.html') ||
    (cleanHref.includes('works') && cleanPath.includes('works')) ||
    (cleanHref.includes('now') && cleanPath.includes('now'))
  ) {
    a.classList.add('active');
  }
});

// ─── Mobile hamburger ────────────────────────────────────────────────────────
const hamburger = document.querySelector('.nav__hamburger');
const navLinks  = document.querySelector('.nav__links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.innerHTML = open
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/></svg>`;
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/></svg>`;
    });
  });
}

// ─── Scroll fade-up (IntersectionObserver) ───────────────────────────────────
const fadeObserver = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); fadeObserver.unobserve(e.target); }
  }),
  { threshold: 0.05, rootMargin: '0px 0px 0px 0px' }
);
document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

// hero-stagger handled by CSS @keyframes hero-in
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── Works filter ────────────────────────────────────────────────────────────
const filterBtns   = document.querySelectorAll('.filter-btn');
const workItems    = document.querySelectorAll('[data-tags]');
const platformGroups = document.querySelectorAll('[data-platform-group]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');

    let shownIdx = 0;
    workItems.forEach(item => {
      const tags = item.getAttribute('data-tags') || '';
      const visible = filter === 'all' || tags.includes(filter);
      if (visible) {
        item.style.display = '';
        const delay = shownIdx * 0.05;
        item.style.opacity = '0';
        item.style.transform = 'translateY(12px)';
        setTimeout(() => {
          item.style.transition = `opacity 0.4s ${delay}s ease, transform 0.4s ${delay}s ease`;
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 10);
        shownIdx++;
      } else {
        item.style.display = 'none';
      }
    });

    // Hide entire platform group if none of its items are visible
    platformGroups.forEach(group => {
      const groupPlatform = group.getAttribute('data-platform-group');
      const hasVisible = filter === 'all' || filter === groupPlatform;
      group.style.display = hasVisible ? '' : 'none';
    });
  });
});

// ─── Reading progress bar (case study) ──────────────────────────────────────
const bar = document.getElementById('progressBar');
if (bar) {
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
}

// ─── Case study TOC active highlight ────────────────────────────────────────
const csSections = document.querySelectorAll('.cs-section[id]');
const tocLinks   = document.querySelectorAll('.cs-toc__link');
if (csSections.length && tocLinks.length) {
  const tocObserver = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          tocLinks.forEach(l => l.classList.remove('active'));
          const active = document.querySelector(`.cs-toc__link[href="#${e.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    },
    { rootMargin: '-20% 0px -70% 0px' }
  );
  csSections.forEach(s => tocObserver.observe(s));
}

// ─── Magnetic button effect ──────────────────────────────────────────────────
if (!prefersReducedMotion) {
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translateY(-2px) translate(${x * 0.08}px, ${y * 0.08}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// ─── Subtle parallax on orbs ─────────────────────────────────────────────────
if (!prefersReducedMotion) {
  const orbs = document.querySelectorAll('.hero__orb');
  if (orbs.length) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      orbs.forEach((orb, i) => {
        const speed = 0.04 + i * 0.02;
        orb.style.transform = `translateY(${y * speed}px)`;
      });
    }, { passive: true });
  }
}
