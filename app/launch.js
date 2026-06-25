/* ============================================================
   weGAS Intelligence — LAUNCH cover
   one "ask → answer" conversation card as the hero
   ============================================================ */
(function () {
  const ICON = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 6.4L20 10l-6.1 1.6L12 18l-1.9-6.4L4 10l6.1-1.6z"/></svg>',
  };

  const root = document.getElementById('launch-root');
  if (!root) return;

  /* ---- compact answers (revealed inside the card) ---- */
  function ansDecisions() {
    const k = [['R6.84M', 'revenue'], ['18,420', 'customers'], ['94%', 'retention']];
    return `<div class="ans ans-kpis">${k.map(([v, l]) => `<div class="ak"><span class="akv">${v}</span><span class="akl">${l}</span></div>`).join('')}</div>`;
  }
  function ansCustomers() {
    const c = [['NK', 'Naledi K.', 'R18,420'], ['TM', 'Thabo M.', 'R14,120'], ['AP', 'Aisha P.', 'R12,800']];
    return `<div class="ans ans-cust">${c.map(([a, n, v]) => `<div class="ac"><span class="aca">${a}</span><span class="acn">${n}</span><span class="acv">${v}</span></div>`).join('')}</div>`;
  }
  function ansChurn() {
    const s = [['Champions', 88, ''], ['Repeat buyers', 62, ''], ['At-risk', 34, 'risk']];
    return `<div class="ans ans-seg">${s.map(([l, w, c]) => `<div class="sg ${c}"><span class="sgl">${l}</span><span class="sgt"><i style="width:${w}%"></i></span></div>`).join('')}</div>`;
  }
  function ansCampaign() {
    const n = ['Lapsed VIP', 'WhatsApp win-back', 'Re-converted'];
    return `<div class="ans ans-flow">${n.map((t, i) => `<span class="fn">${t}</span>${i < n.length - 1 ? `<span class="fa">${ICON.arrow}</span>` : ''}`).join('')}</div>`;
  }
  function ansRevenue() {
    return `<div class="ans ans-rev">
      <div class="rv-top"><span class="rv-v">R6.84M</span><span class="rv-d">&#9650; 8.2%</span></div>
      <svg class="rv-spark" viewBox="0 0 320 60" preserveAspectRatio="none">
        <defs><linearGradient id="rvg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="rgba(33,150,92,0.26)"/><stop offset="1" stop-color="rgba(33,150,92,0)"/></linearGradient></defs>
        <path d="M0,48 L40,42 L80,45 L120,32 L160,35 L200,22 L240,26 L280,12 L320,6 L320,60 L0,60 Z" fill="url(#rvg)"/>
        <path d="M0,48 L40,42 L80,45 L120,32 L160,35 L200,22 L240,26 L280,12 L320,6" fill="none" stroke="#21965C" stroke-width="2.5" stroke-linejoin="round"/>
      </svg>
    </div>`;
  }
  const ANSWERS = [ansDecisions(), ansCustomers(), ansChurn(), ansCampaign(), ansRevenue()];
  const answerPanels = ANSWERS.map((h, i) => `<div class="ans-panel" data-a="${i}">${h}</div>`).join('');

  /* ---- integration brands ---- */
  const G = {
    shopify: '<svg class="mq-g" viewBox="0 0 24 24" fill="#5E8E3E"><path d="M16 7V6a4 4 0 1 0-8 0v1H5l-1 13h16L19 7h-3zm-6 0V6a2 2 0 1 1 4 0v1h-4z"/></svg>',
    meta: '<svg class="mq-g" viewBox="0 0 24 24" fill="none" stroke="#0866FF" stroke-width="2.4" stroke-linecap="round"><path d="M8.6 8.6c-1.8 0-3.1 1.5-3.1 3.4s1.3 3.4 3 3.4c2.2 0 3.4-2.6 4.5-4.2"/><path d="M15.4 15.4c1.8 0 3.1-1.5 3.1-3.4s-1.3-3.4-3-3.4c-2.2 0-3.4 2.6-4.5 4.2"/></svg>',
    whatsapp: '<svg class="mq-g" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#1FA855"/><path fill="#fff" d="M12 6.2a5.8 5.8 0 0 0-4.9 8.9L6.3 18l3-.8A5.8 5.8 0 1 0 12 6.2zm3 8c-.1.4-.7.7-1 .8-.3 0-.6.1-1.9-.4-1.6-.6-2.6-2.2-2.7-2.4-.1-.1-.6-.9-.6-1.6s.4-1.1.5-1.3c.1-.1.3-.2.5-.2h.3c.1 0 .3 0 .4.3l.4.9c0 .1.1.3 0 .4l-.2.3c-.1.1-.2.2-.1.3.1.2.4.7.9 1.1.6.5 1.1.7 1.3.8.1 0 .3 0 .3-.1l.4-.5c.1-.1.2-.1.3 0l.9.4c.2.1.3.1.4.2 0 .1 0 .4-.1.7z"/></svg>',
    xero: '<svg class="mq-g" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#13B5EA"/><path stroke="#fff" stroke-width="2" stroke-linecap="round" d="M9 9l6 6M15 9l-6 6"/></svg>',
  };
  const INTEG = [
    ['Shopify', '#5E8E3E', G.shopify], ['WooCommerce', '#7F54B3', null], ['Stripe', '#635BFF', null],
    ['PayFast', '#1A4F8B', null], ['Yoco', '#0AA89B', null], ['Google Ads', '#4285F4', null],
    ['Meta', '#0866FF', G.meta], ['WhatsApp', '#1FA855', G.whatsapp], ['Klaviyo', '#15171A', null], ['Xero', '#13B5EA', G.xero],
  ];
  const integHTML = ([name, color, glyph]) => `<span class="mq-item" style="color:${color}">${glyph || ''}${name}</span>`;
  const marquee = [...INTEG, ...INTEG].map(integHTML).join('');

  root.innerHTML = `
    <div class="launch" id="launch">
      <nav class="launch-nav">
        <a class="launch-logo" href="https://w-gas.co.za" target="_top" rel="noopener" aria-label="Back to weGAS.co.za" title="Back to weGAS.co.za"></a>
        <ul class="navlinks">
          <li><a data-jump="bi" href="#">Intelligence</a></li>
          <li><a data-jump="contacts" href="#">Customers</a></li>
          <li><a data-jump="segments" href="#">Segments</a></li>
          <li><a data-jump="campaigns" href="#">Campaigns</a></li>
        </ul>
        <div class="nav-right">
          <button class="launch-ghost" data-enter="home">Enter demo</button>
        </div>
      </nav>

      <div class="launch-stage">
        <div class="hero-convo">
          <div class="hc-head"><span class="live-dot"></span> weGAS Intelligence</div>
          <div class="hc-q">
            <span class="hc-spark">${ICON.spark}</span>
            <div class="hc-qtext"><span id="hbType"></span><span class="hb-cursor" aria-hidden="true"></span></div>
          </div>
          <div class="hc-answer">${answerPanels}</div>
          <div class="hc-foot">
            <span class="hc-meta">data &amp; marketing intelligence &middot; for any business</span>
            <button class="hb-cta" data-enter="home">Enter the demo ${ICON.arrow}</button>
          </div>
        </div>
      </div>

      <div class="launch-marquee">
        <div class="strip-label">Built to integrate with</div>
        <div class="mq-track">${marquee}</div>
      </div>
    </div>`;

  /* ---- typed prompt + answer reveal ---- */
  const PROMPTS = [
    'turn your data into decisions.',
    'show me my highest-value customers.',
    'which segments are about to churn?',
    'build a win-back campaign for me.',
    'where is my revenue really growing?',
  ];
  const typeEl = document.getElementById('hbType');
  const panels = [...root.querySelectorAll('.ans-panel')];
  const showAnswer = (i) => panels.forEach((p, k) => p.classList.toggle('show', k === i));
  const hideAnswer = () => panels.forEach(p => p.classList.remove('show'));
  if (typeEl) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      typeEl.textContent = PROMPTS[0]; showAnswer(0);
    } else {
      let pi = 0, ci = 0, deleting = false;
      const type = () => {
        const w = PROMPTS[pi];
        if (!deleting) {
          typeEl.textContent = w.slice(0, ++ci);
          if (ci === w.length) { deleting = true; showAnswer(pi); return setTimeout(type, 2700); }
          return setTimeout(type, 48 + Math.random() * 46);
        }
        if (ci === w.length) hideAnswer();
        typeEl.textContent = w.slice(0, --ci);
        if (ci === 0) { deleting = false; pi = (pi + 1) % PROMPTS.length; return setTimeout(type, 460); }
        setTimeout(type, 26);
      };
      setTimeout(type, 700);
    }
  }

  /* ---- enter the app ---- */
  function enter(id) {
    const launch = document.getElementById('launch');
    launch.classList.add('hidden');
    if (window.__goTo) window.__goTo(id);
    setTimeout(() => { root.style.display = 'none'; }, 520);
  }
  root.addEventListener('click', e => {
    const en = e.target.closest('[data-enter]');
    if (en) { e.preventDefault(); enter(en.dataset.enter); return; }
    const jp = e.target.closest('[data-jump]');
    if (jp) { e.preventDefault(); enter(jp.dataset.jump); }
  });

  document.addEventListener('keydown', e => {
    const launch = document.getElementById('launch');
    if (!launch || launch.classList.contains('hidden')) return;
    if (e.key === 'Enter') enter('home');
  });
})();
