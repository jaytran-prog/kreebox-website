(function () {
  'use strict';

  const INVITE_MESSAGES_EN = [
    "Curious about my work? Ask away ✦",
    "Explore my portfolio with AI 💬",
    "Ask me anything about my process or experience",
  ];

  const INVITE_MESSAGES_VI = [
    "Tò mò về portfolio của tôi? Hỏi nhé ✦",
    "Khám phá công việc của tôi qua AI 💬",
    "Hỏi gì về quá trình làm việc hoặc kinh nghiệm cũng được",
  ];

  const QUICK_PROMPTS_EN = [
    'Most impactful project you\'ve done?',
    'How do you approach AI product design?',
    'How do you lead design teams?',
  ];

  const QUICK_PROMPTS_VI = [
    'Dự án ấn tượng nhất của bạn?',
    'Bạn thiết kế AI product như thế nào?',
    'Phong cách dẫn dắt team design của bạn?',
  ];

  const GREETING_EN = "Hey! I'm Jay 👋 Lead UX/UI Designer & Product Design Manager based in Ho Chi Minh City. Feel free to ask about my work, process, or experience.";
  const GREETING_VI = "Chào bạn! Tôi là Jay 👋 Lead UX/UI Designer & Product Design Manager tại TP.HCM. Bạn muốn khám phá portfolio, quy trình làm việc hay kinh nghiệm của tôi?";

  let messages = [];
  let isOpen = false;
  let isExpanded = false;
  let isLoading = false;
  let exchangeCount = 0;
  let greetingShown = false;

  // ── DOM ──────────────────────────────────────────────────────────
  function createChatbot() {
    const wrap = document.createElement('div');
    wrap.id = 'chatbot';
    wrap.innerHTML = `
      <button class="chatbot-fab" id="chatbotFab" aria-label="Chat with Jay" aria-expanded="false">
        <span class="chatbot-fab__icon chatbot-fab__icon--chat" aria-hidden="true">
          <svg class="cat-mascot" width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="cgFace" cx="40%" cy="28%" r="70%">
                <stop offset="0%" stop-color="#ddd6fe"/>
                <stop offset="42%" stop-color="#818cf8"/>
                <stop offset="100%" stop-color="#1e1b4b"/>
              </radialGradient>
              <radialGradient id="cgEarL" cx="55%" cy="5%" r="95%">
                <stop offset="0%" stop-color="#818cf8"/>
                <stop offset="100%" stop-color="#1e1b4b"/>
              </radialGradient>
              <radialGradient id="cgEarR" cx="45%" cy="5%" r="95%">
                <stop offset="0%" stop-color="#818cf8"/>
                <stop offset="100%" stop-color="#1e1b4b"/>
              </radialGradient>
              <filter id="cgDrop" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="3.5" flood-color="#0a0818" flood-opacity="0.55"/>
              </filter>
            </defs>

            <!-- Left ear -->
            <g class="cat-ear cat-ear--left">
              <polygon points="9,33 17,6 25,28" fill="url(#cgEarL)"/>
              <polygon points="12,31 17,11 23,28" fill="#fca5a5" opacity="0.55"/>
            </g>
            <!-- Right ear -->
            <g class="cat-ear cat-ear--right">
              <polygon points="35,28 43,6 51,33" fill="url(#cgEarR)"/>
              <polygon points="37,28 43,11 48,31" fill="#fca5a5" opacity="0.55"/>
            </g>

            <!-- Head sphere -->
            <circle cx="30" cy="38" r="20" fill="url(#cgFace)" filter="url(#cgDrop)"/>

            <!-- Specular highlight (3D sphere illusion) -->
            <ellipse cx="21" cy="28" rx="6.5" ry="4" fill="white" opacity="0.13" transform="rotate(-22 21 28)"/>

            <!-- Left eye -->
            <g class="cat-eye cat-eye--left">
              <circle cx="22" cy="37" r="5.2" fill="white"/>
              <circle cx="23" cy="37" r="3.3" fill="#12103a"/>
              <circle cx="24.5" cy="35.5" r="1.35" fill="white"/>
            </g>
            <!-- Right eye -->
            <g class="cat-eye cat-eye--right">
              <circle cx="38" cy="37" r="5.2" fill="white"/>
              <circle cx="39" cy="37" r="3.3" fill="#12103a"/>
              <circle cx="40.5" cy="35.5" r="1.35" fill="white"/>
            </g>

            <!-- Nose -->
            <path d="M28,42.5 L30,40 L32,42.5 Z" fill="#fda4af"/>

            <!-- Mouth (gentle smile) -->
            <path d="M25.5,44.5 Q30,49 34.5,44.5" stroke="#a78bfa" stroke-width="1.5" fill="none" stroke-linecap="round"/>

            <!-- Whiskers -->
            <line x1="3" y1="41" x2="19" y2="42.5" stroke="white" stroke-width="0.9" opacity="0.4" stroke-linecap="round"/>
            <line x1="3" y1="44.5" x2="19" y2="44" stroke="white" stroke-width="0.85" opacity="0.3" stroke-linecap="round"/>
            <line x1="41" y1="42.5" x2="57" y2="41" stroke="white" stroke-width="0.9" opacity="0.4" stroke-linecap="round"/>
            <line x1="41" y1="44" x2="57" y2="44.5" stroke="white" stroke-width="0.85" opacity="0.3" stroke-linecap="round"/>
          </svg>
        </span>
        <span class="chatbot-fab__icon chatbot-fab__icon--close" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </span>
        <span class="chatbot-fab__dot" aria-hidden="true"></span>
      </button>
      <div class="chatbot-invite" id="chatbotInvite" aria-hidden="true"></div>

      <div class="chatbot-panel" id="chatbotPanel" role="dialog" aria-label="Chat with Jay" aria-hidden="true">
        <div class="chatbot-panel__header">
          <div class="chatbot-panel__avatar" aria-hidden="true">
            <img src="/assets/images/phuong-tran.jpg" alt="" width="36" height="36" />
          </div>
          <div class="chatbot-panel__info">
            <p class="chatbot-panel__name">Jay Tran</p>
            <p class="chatbot-panel__status">
              <span class="chatbot-panel__status-dot" aria-hidden="true"></span>
              AI-powered · responds instantly
            </p>
          </div>
          <button class="chatbot-panel__btn" id="chatbotExpand" aria-label="Expand chat" title="Expand">
            <svg class="icon-expand" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
              <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
              <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
            </svg>
            <svg class="icon-shrink" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
              <polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/>
              <line x1="10" y1="14" x2="3" y2="21"/><line x1="21" y1="3" x2="14" y2="10"/>
            </svg>
          </button>
          <button class="chatbot-panel__btn" id="chatbotClose" aria-label="Close chat">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="chatbot-messages" id="chatbotMessages" role="log" aria-live="polite" aria-atomic="false"></div>

        <div class="chatbot-panel__footer">
          <div class="chatbot-quick" id="chatbotQuick" aria-label="Quick prompts"></div>
          <div class="chatbot-action-row">
            <button class="chatbot-suggestions-btn" type="button" id="chatbotSuggest" aria-label="Show suggestions">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span class="chatbot-suggestions-btn__label">Suggest prompts</span>
            </button>
          </div>
          <form class="chatbot-form" id="chatbotForm" autocomplete="off">
            <input
              class="chatbot-input"
              id="chatbotInput"
              type="text"
              placeholder="Ask me anything…"
              maxlength="500"
              aria-label="Message"
            />
            <button class="chatbot-send" type="submit" aria-label="Send message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);
  }

  // ── State ─────────────────────────────────────────────────────────
  function open() {
    isOpen = true;
    hideInvite();
    const fab = document.getElementById('chatbotFab');
    const panel = document.getElementById('chatbotPanel');
    fab.setAttribute('aria-expanded', 'true');
    fab.classList.add('is-open');
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    if (!greetingShown) { showGreeting(); greetingShown = true; }
    setTimeout(() => document.getElementById('chatbotInput').focus(), 350);
  }

  function close() {
    isOpen = false;
    const fab = document.getElementById('chatbotFab');
    const panel = document.getElementById('chatbotPanel');
    fab.setAttribute('aria-expanded', 'false');
    fab.classList.remove('is-open');
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
  }

  // ── Messages ──────────────────────────────────────────────────────
  function showGreeting() {
    const lang = getSiteLang();
    const path = window.location.pathname;
    const isWork = path.includes('/works/');
    const isCompany = path.includes('/company/');
    const pageTitle = document.querySelector('h1')?.textContent?.trim()
      || document.querySelector('meta[property="og:title"]')?.content?.split('|')[0]?.trim()
      || '';

    let text;
    if (isWork && pageTitle) {
      text = lang === 'vi'
        ? `Bạn đang xem case study "${pageTitle}". Hỏi tôi để tóm tắt dự án, tìm hiểu quy trình thiết kế, hoặc bất kỳ điều gì về dự án này.`
        : `You're reading the "${pageTitle}" case study. Ask me to summarize it, walk you through the process, or answer anything about this project.`;
    } else if (isCompany && pageTitle) {
      text = lang === 'vi'
        ? `Bạn đang xem trang về ${pageTitle}. Hỏi tôi về kinh nghiệm làm việc tại đây, các dự án, hoặc bất kỳ điều gì bạn muốn biết.`
        : `You're on the ${pageTitle} page. Ask me about my experience there, key projects, or anything you'd like to know.`;
    } else {
      text = lang === 'vi' ? GREETING_VI : GREETING_EN;
    }
    appendBot(text, false);
    showQuickPrompts(lang, isWork || isCompany);
  }

  function showQuickPrompts(lang, isContextPage = false) {
    const container = document.getElementById('chatbotQuick');
    if (!container) return;
    let prompts;
    if (isContextPage) {
      prompts = lang === 'vi'
        ? ['Tóm tắt dự án này cho tôi', 'Quy trình thiết kế như thế nào?', 'Kết quả đạt được là gì?']
        : ['Summarize this project for me', 'Walk me through the design process', 'What were the outcomes?'];
    } else {
      prompts = lang === 'vi' ? QUICK_PROMPTS_VI : QUICK_PROMPTS_EN;
    }
    container.innerHTML = '';
    prompts.forEach(p => {
      const btn = document.createElement('button');
      btn.className = 'chatbot-quick__chip';
      btn.textContent = p;
      btn.addEventListener('click', () => {
        container.innerHTML = '';
        sendMessage(p);
      });
      container.appendChild(btn);
    });
  }

  function appendUser(text) {
    const el = document.createElement('div');
    el.className = 'chatbot-msg chatbot-msg--user';
    el.innerHTML = `<div class="chatbot-msg__bubble">${escHtml(text)}</div>`;
    getMessages().appendChild(el);
    scrollBottom();
  }

  function parseCTAs(text) {
    const ctas = [];
    const clean = text.replace(/\[CTA:([^\|]+)\|([^\]]+)\]/g, (_, label, url) => {
      ctas.push({ label: label.trim(), url: url.trim() });
      return '';
    }).trim();
    return { clean, ctas };
  }

  function appendBot(text, stream = true) {
    const { clean, ctas } = parseCTAs(text);
    const el = document.createElement('div');
    el.className = 'chatbot-msg chatbot-msg--bot';
    el.innerHTML = `<div class="chatbot-msg__bubble"><span class="chatbot-msg__text"></span></div>`;
    getMessages().appendChild(el);
    scrollBottom();
    const span = el.querySelector('.chatbot-msg__text');
    const bubble = el.querySelector('.chatbot-msg__bubble');
    const lang = getSiteLang();
    const disclaimerText = lang === 'vi'
      ? 'AI có thể nhầm — liên hệ trực tiếp để chắc chắn.'
      : 'AI can be wrong — reach out to verify.';
    const addFooter = () => {
      if (ctas.length > 0) {
        const ctaRow = document.createElement('div');
        ctaRow.className = 'chatbot-msg__ctas';
        ctas.forEach(({ label, url }) => {
          const a = document.createElement('a');
          a.href = url;
          a.className = 'chatbot-msg__cta-btn';
          a.textContent = label + ' →';
          ctaRow.appendChild(a);
        });
        bubble.appendChild(ctaRow);
      }
      const d = document.createElement('div');
      d.className = 'chatbot-msg__disclaimer';
      d.innerHTML = `<span>${disclaimerText}</span><a href="mailto:jay.tran@kreebox.com" class="chatbot-msg__disclaimer-btn">Email Jay</a>`;
      bubble.appendChild(d);
      scrollBottom();
    };
    if (stream) {
      typeText(span, clean, 0, addFooter);
    } else {
      span.textContent = clean;
      addFooter();
    }
    return el;
  }

  function appendTyping() {
    const el = document.createElement('div');
    el.className = 'chatbot-msg chatbot-msg--bot chatbot-msg--typing';
    el.innerHTML = `<div class="chatbot-msg__bubble"><span class="chatbot-dots"><span></span><span></span><span></span></span></div>`;
    getMessages().appendChild(el);
    scrollBottom();
    return el;
  }

  function appendError() {
    const el = document.createElement('div');
    el.className = 'chatbot-msg chatbot-msg--bot';
    el.innerHTML = `<div class="chatbot-msg__bubble chatbot-msg__bubble--error">
      <span>Something went wrong on my end.</span>
      <a class="chatbot-error-cta" href="mailto:jay.tran@kreebox.com">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg>
        Email Jay directly
      </a>
    </div>`;
    getMessages().appendChild(el);
    scrollBottom();
  }

  function appendCta() {
    const existing = document.querySelector('.chatbot-cta');
    if (existing) return;
    const el = document.createElement('div');
    el.className = 'chatbot-cta';
    el.innerHTML = `<a href="mailto:jay.tran@kreebox.com" class="chatbot-cta__link">
      Talk to Jay directly →
    </a>`;
    getMessages().appendChild(el);
    scrollBottom();
  }

  function typeText(el, text, i = 0, onDone) {
    if (i < text.length) {
      el.textContent += text[i];
      scrollBottom();
      setTimeout(() => typeText(el, text, i + 1, onDone), 12);
    } else if (onDone) {
      onDone();
    }
  }

  // ── API ───────────────────────────────────────────────────────────
  async function sendMessage(text) {
    if (isLoading || !text.trim()) return;
    isLoading = true;

    hideQuickPrompts();
    appendUser(text);

    messages.push({ role: 'user', parts: [{ text }] });

    const typingEl = appendTyping();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, pageContext: getPageContext() })
      });

      typingEl.remove();

      if (!res.ok) throw new Error('API error');

      const data = await res.json();
      const reply = data.reply || 'Sorry, something went wrong.';

      messages.push({ role: 'model', parts: [{ text: reply }] });
      appendBot(reply);

      exchangeCount++;
      if (exchangeCount >= 3) appendCta();
    } catch {
      typingEl.remove();
      appendError();
    }

    isLoading = false;
  }

  // ── Helpers ───────────────────────────────────────────────────────
  function getMessages() { return document.getElementById('chatbotMessages'); }
  function scrollBottom() {
    const el = getMessages();
    if (el) el.scrollTop = el.scrollHeight;
  }
  function hideQuickPrompts() {
    const el = document.getElementById('chatbotQuick');
    if (el) el.innerHTML = '';
  }
  function escHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ── Page context ──────────────────────────────────────────────────
  function getPageContext() {
    const path = window.location.pathname;
    const isWork = path.includes('/works/');
    const isCompany = path.includes('/company/');
    if (!isWork && !isCompany) return null;

    const txt = el => el?.textContent?.trim() || '';
    const title = document.querySelector('meta[property="og:title"]')?.content || document.title || '';
    const description = document.querySelector('meta[name="description"]')?.content || '';
    const h1 = txt(document.querySelector('h1'));

    // Subtitle / hero intro
    const subtitle = txt(document.querySelector('.cs-hero__subtitle, .cs-intro, .hero-subtitle'));

    // All section headings + body paragraphs
    const sections = [];
    document.querySelectorAll('.cs-section, .cs-body, section').forEach(sec => {
      const heading = txt(sec.querySelector('h2, h3'));
      const paras = Array.from(sec.querySelectorAll('p'))
        .map(p => txt(p)).filter(Boolean).join(' ');
      if (heading || paras) sections.push((heading ? heading + ': ' : '') + paras);
    });

    // Metrics / stats
    const metrics = Array.from(document.querySelectorAll('.cs-metric, .metric, .stat'))
      .map(m => {
        const val = txt(m.querySelector('.cs-metric__value, .metric__value, strong, b'));
        const label = txt(m.querySelector('.cs-metric__label, .metric__label, p:last-child, span:last-child'));
        return val && label ? `${val} — ${label}` : txt(m);
      }).filter(Boolean).join('; ');

    // Feature segments / tags
    const segments = Array.from(document.querySelectorAll('.cs-segment, .feature-item'))
      .map(s => txt(s)).filter(Boolean).join('. ');

    // Outcomes / results sections
    const outcomes = Array.from(document.querySelectorAll('.cs-outcome, .outcome, .result'))
      .map(o => txt(o)).filter(Boolean).join('. ');

    const type = isWork ? 'project case study' : 'company profile';
    const parts = [
      `CURRENT PAGE CONTEXT (${type}):`,
      `Title: ${title}`,
      h1 ? `Heading: ${h1}` : '',
      description ? `Overview: ${description}` : '',
      subtitle ? `Intro: ${subtitle}` : '',
      metrics ? `Key metrics: ${metrics}` : '',
      segments ? `Feature areas: ${segments.slice(0, 600)}` : '',
      outcomes ? `Outcomes: ${outcomes.slice(0, 400)}` : '',
      sections.length ? `Content:\n${sections.join('\n').slice(0, 3000)}` : '',
      `\nThe user is on this page now. Answer questions specifically about this ${type} using the content above.`
    ].filter(Boolean).join('\n');

    return parts;
  }

  // ── Invite bubble ─────────────────────────────────────────────────
  function getSiteLang() {
    return localStorage.getItem('lang') || 'en';
  }

  function showInvite() {
    const el = document.getElementById('chatbotInvite');
    if (!el || isOpen) return;
    const lang = getSiteLang();
    const msgs = lang === 'vi' ? INVITE_MESSAGES_VI : INVITE_MESSAGES_EN;
    el.textContent = msgs[Math.floor(Math.random() * msgs.length)];
    el.classList.add('is-visible');
    setTimeout(hideInvite, 5000);
  }

  function hideInvite() {
    const el = document.getElementById('chatbotInvite');
    if (el) el.classList.remove('is-visible');
  }

  // ── Init ──────────────────────────────────────────────────────────
  function init() {
    createChatbot();

    document.getElementById('chatbotFab').addEventListener('click', () => {
      isOpen ? close() : open();
    });
    document.getElementById('chatbotClose').addEventListener('click', close);

    document.getElementById('chatbotForm').addEventListener('submit', e => {
      e.preventDefault();
      const input = document.getElementById('chatbotInput');
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      sendMessage(text);
    });

    // Prevent scroll inside chat from bubbling to page
    document.getElementById('chatbotMessages').addEventListener('wheel', e => {
      const el = e.currentTarget;
      const atTop = el.scrollTop === 0 && e.deltaY < 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight && e.deltaY > 0;
      if (!atTop && !atBottom) e.stopPropagation();
    }, { passive: true });

    document.getElementById('chatbotExpand').addEventListener('click', () => {
      isExpanded = !isExpanded;
      document.getElementById('chatbotPanel').classList.toggle('is-expanded', isExpanded);
      document.getElementById('chatbotExpand').setAttribute('aria-label', isExpanded ? 'Shrink chat' : 'Expand chat');
      scrollBottom();
    });

    document.getElementById('chatbotSuggest').addEventListener('click', () => {
      const container = document.getElementById('chatbotQuick');
      if (container.children.length) {
        container.innerHTML = '';
      } else {
        const path = window.location.pathname;
        const isContextPage = path.includes('/works/') || path.includes('/company/');
        showQuickPrompts(getSiteLang(), isContextPage);
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isOpen) close();
    });

    setTimeout(showInvite, 1800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
