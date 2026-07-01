// ─── Content protection ──────────────────────────────────────────────────────
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart',   e => e.preventDefault());
document.addEventListener('selectstart', e => {
  if (!['INPUT','TEXTAREA'].includes(e.target.tagName)) e.preventDefault();
});
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && ['c','u','s','a'].includes(e.key.toLowerCase())) {
    e.preventDefault();
  }
  if (e.key === 'F12') e.preventDefault();
});

// ─── Theme ──────────────────────────────────────────────────────────────────
const html = document.documentElement;
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

// ─── Scroll fade-up ──────────────────────────────────────────────────────────
const fadeObserver = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); fadeObserver.unobserve(e.target); }
  }),
  { threshold: 0.05 }
);
document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── Works filter ────────────────────────────────────────────────────────────
const filterBtns     = document.querySelectorAll('.filter-btn');
const workItems      = document.querySelectorAll('[data-tags]');
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
    platformGroups.forEach(group => {
      const hasVisible = filter === 'all' || filter === group.getAttribute('data-platform-group');
      group.style.display = hasVisible ? '' : 'none';
    });
  });
});

// ─── Reading progress bar ────────────────────────────────────────────────────
const bar = document.getElementById('progressBar');
if (bar) {
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
}

// ─── Case study TOC ──────────────────────────────────────────────────────────
const csSections = document.querySelectorAll('.cs-section[id]');
const tocLinks   = document.querySelectorAll('.cs-toc__link');
if (csSections.length && tocLinks.length) {
  const tocObserver = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        tocLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.cs-toc__link[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    }),
    { rootMargin: '-20% 0px -70% 0px' }
  );
  csSections.forEach(s => tocObserver.observe(s));
}

// ─── Case study image lightbox ────────────────────────────────────────────────
if (document.querySelector('.cs-hero')) {
  const galleryImages = [...document.querySelectorAll('img')].filter(
    img => !img.closest('#chatbot') && !img.closest('.nav')
  );

  if (galleryImages.length) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
      <button class="lightbox-overlay__close" aria-label="Close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <button class="lightbox-overlay__prev" aria-label="Previous image">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button class="lightbox-overlay__next" aria-label="Next image">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      <img class="lightbox-overlay__img" alt="" />
      <p class="lightbox-overlay__counter"></p>
    `;
    document.body.appendChild(overlay);

    const lbImg    = overlay.querySelector('.lightbox-overlay__img');
    const counter  = overlay.querySelector('.lightbox-overlay__counter');
    const btnPrev  = overlay.querySelector('.lightbox-overlay__prev');
    const btnNext  = overlay.querySelector('.lightbox-overlay__next');
    const btnClose = overlay.querySelector('.lightbox-overlay__close');
    let current = 0;

    const render = i => {
      current = (i + galleryImages.length) % galleryImages.length;
      const img = galleryImages[current];
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt || '';
      counter.textContent = `${current + 1} / ${galleryImages.length}`;
      const showNav = galleryImages.length > 1;
      btnPrev.style.display = btnNext.style.display = showNav ? '' : 'none';
    };

    const openAt = i => {
      render(i);
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    // Cursor-following "click to enlarge" hint (desktop/mouse only — touch users
    // get the same signal for free on their first tap)
    let hint = null;
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      hint = document.createElement('div');
      hint.className = 'lightbox-hint';
      hint.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg><span data-i18n="lightbox.hint">${t('lightbox.hint')}</span>`;
      document.body.appendChild(hint);
    }

    galleryImages.forEach((img, i) => {
      img.classList.add('lightbox-trigger');
      img.addEventListener('click', () => openAt(i));
      if (hint) {
        img.addEventListener('mouseenter', () => hint.classList.add('is-visible'));
        img.addEventListener('mouseleave', () => hint.classList.remove('is-visible'));
        img.addEventListener('mousemove', e => {
          hint.style.left = e.clientX + 'px';
          hint.style.top = e.clientY + 'px';
        });
      }
    });

    // Reinforce the same signal in existing captions, for touch users and anyone
    // who scans past the hover state
    document.querySelectorAll('.cs-visual__caption').forEach(caption => {
      const visual = caption.closest('.cs-visual');
      if (visual && visual.querySelector('img.lightbox-trigger')) {
        const hintText = document.createElement('span');
        hintText.className = 'cs-visual__caption-hint';
        hintText.setAttribute('data-i18n', 'lightbox.captionHint');
        hintText.textContent = t('lightbox.captionHint');
        caption.appendChild(hintText);
      }
    });

    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', () => render(current - 1));
    btnNext.addEventListener('click', () => render(current + 1));
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', e => {
      if (!overlay.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') render(current - 1);
      if (e.key === 'ArrowRight') render(current + 1);
    });
  }
}

// ─── Deferred enhancements (after first paint) ───────────────────────────────
// Everything below is visual enhancement only — defer to avoid blocking TBT
const initEnhancements = () => {
  if (prefersReducedMotion) return;

  // Magnetic button
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translateY(-2px) translate(${(e.clientX - r.left - r.width/2) * 0.08}px, ${(e.clientY - r.top - r.height/2) * 0.08}px)`;
    }, { passive: true });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  // Hero photo 3D tilt
  const photoScene = document.getElementById('photoScene');
  const photoWrap  = photoScene?.closest('.hero__photo-wrap');
  if (photoWrap && photoScene) {
    const MAX_X = 10, MAX_Y = 8;
    photoWrap.addEventListener('mousemove', e => {
      const r = photoWrap.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width/2) / (r.width/2);
      const y = (e.clientY - r.top  - r.height/2) / (r.height/2);
      photoScene.style.transform = `perspective(900px) rotateY(${x*MAX_X}deg) rotateX(${-y*MAX_Y}deg) scale3d(1.04,1.04,1.04)`;
    }, { passive: true });
    photoWrap.addEventListener('mouseleave', () => {
      photoScene.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
    });
  }

  // Orb parallax — mouse + scroll
  const orbs = document.querySelectorAll('.hero__orb');
  const heroEl = document.querySelector('.hero');
  if (orbs.length) {
    let mouseX = 0, mouseY = 0, scrollY = 0;
    const updateOrbs = () => orbs.forEach((orb, i) => {
      orb.style.transform = `translate(${mouseX*(i+1)*14}px,${mouseY*(i+1)*14+scrollY*(0.04+i*0.02)}px)`;
    });
    if (heroEl) {
      heroEl.addEventListener('mousemove', e => {
        const r = heroEl.getBoundingClientRect();
        mouseX = (e.clientX - r.left - r.width/2) / r.width;
        mouseY = (e.clientY - r.top  - r.height/2) / r.height;
        updateOrbs();
      }, { passive: true });
      heroEl.addEventListener('mouseleave', () => { mouseX = 0; mouseY = 0; updateOrbs(); });
    }
    window.addEventListener('scroll', () => { scrollY = window.scrollY; updateOrbs(); }, { passive: true });
  }

  // Card 3D tilt
  document.querySelectorAll('.archive-card, .community-card, .cs-related__card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width/2)  / (r.width/2);
      const y = (e.clientY - r.top  - r.height/2) / (r.height/2);
      card.style.transform = `perspective(700px) rotateY(${x*7}deg) rotateX(${-y*5}deg) translateY(-4px)`;
    }, { passive: true });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  // Section heading reveal — batch reads before writes to avoid reflow churn
  const headings = [...document.querySelectorAll('.section-header .display-md, .page-hero .display-xl')];
  const htmlCache = headings.map(el => el.innerHTML); // read all first
  headings.forEach((el, i) => {
    const inner = document.createElement('span');
    inner.className = 'reveal-inner';
    inner.innerHTML = htmlCache[i];
    el.textContent = '';
    el.appendChild(inner);
    el.classList.add('reveal-heading');
  });
  const revealObserver = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
    }),
    { threshold: 0.2 }
  );
  document.querySelectorAll('.reveal-heading').forEach(el => revealObserver.observe(el));

  // Custom cursor — pause rAF when cursor is outside window
  if (window.matchMedia('(pointer: fine)').matches) {
    const dot  = Object.assign(document.createElement('div'), { className: 'cursor-dot' });
    const ring = Object.assign(document.createElement('div'), { className: 'cursor-ring' });
    document.body.append(dot, ring);

    let mx = -200, my = -200, rx = -200, ry = -200;
    let rafId = null, cursorInside = false;

    const tickRing = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      if (cursorInside) rafId = requestAnimationFrame(tickRing);
    };

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
      // Start on first mousemove (handles Windows/browsers where mouseenter on document doesn't fire)
      if (!cursorInside) {
        cursorInside = true;
        dot.classList.remove('is-hidden'); ring.classList.remove('is-hidden');
      }
      if (!rafId) rafId = requestAnimationFrame(tickRing);
    }, { passive: true });

    const HOVER_SEL = 'a, button, [role="button"], .work-item, .archive-card, .community-card, label';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(HOVER_SEL)) ring.classList.add('is-hovering');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(HOVER_SEL)) ring.classList.remove('is-hovering');
    });
    document.addEventListener('mousedown', () => ring.classList.add('is-clicking'));
    document.addEventListener('mouseup',   () => ring.classList.remove('is-clicking'));

    document.addEventListener('mouseleave', () => {
      cursorInside = false;
      dot.classList.add('is-hidden'); ring.classList.add('is-hidden');
      cancelAnimationFrame(rafId); rafId = null;
    });
  }

  // Magnetic nav links
  document.querySelectorAll('.nav__links a:not(.nav__cta)').forEach(link => {
    link.addEventListener('mousemove', e => {
      const r = link.getBoundingClientRect();
      link.style.transform = `translate(${(e.clientX - r.left - r.width/2) * 0.25}px,${(e.clientY - r.top - r.height/2) * 0.35}px)`;
    });
    link.addEventListener('mouseleave', () => {
      link.style.transform = '';
      link.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1), color 0.25s';
    });
    link.addEventListener('mouseenter', () => { link.style.transition = 'color 0.25s'; });
  });
};

// Use requestIdleCallback when available, fallback to setTimeout after first paint
if ('requestIdleCallback' in window) {
  requestIdleCallback(initEnhancements, { timeout: 2000 });
} else {
  requestAnimationFrame(() => setTimeout(initEnhancements, 0));
}
