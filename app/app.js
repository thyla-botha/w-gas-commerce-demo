/* ============================================================
   weGAS Intelligence — app controller
   ============================================================ */
(function () {
  const NAV = [
    { id:'home', label:'Home', icon:'home', render:renderHome },
    { id:'bi', label:'Commerce Intelligence', icon:'bi', render:renderBI },
    { id:'contacts', label:'Customers (AMS)', icon:'contacts', render:renderAMS },
    { id:'segments', label:'Segments', icon:'segments', render:renderSegments },
    { id:'campaigns', label:'Campaigns', icon:'campaigns', render:renderCampaigns },
  ];

  // build sidebar
  const navList = document.getElementById('navList');
  navList.innerHTML = NAV.map(n => `
    <li class="nav-item ${n.id==='home'?'active':''}" data-nav="${n.id}">
      ${svg(n.icon)}<span class="nav-label">${n.label}</span>
    </li>`).join('');

  // pre-render all pages into DOM (content present at load, not display:none-hidden during render)
  const pageHost = document.getElementById('pageHost');
  pageHost.innerHTML = NAV.map(n =>
    `<div class="page ${n.id==='home'?'active':''}" id="page-${n.id}">${n.render()}</div>`
  ).join('');

  function setSurface(id) {
    const dark = (id !== 'home');
    document.body.classList.toggle('surface-dark', dark);
    document.body.style.background = dark ? '#0E0E0E' : 'var(--canvas)';
  }

  function goTo(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === 'page-' + id));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.nav === id));
    setSurface(id);
    // reset scroll of the active page viewport
    const vp = document.querySelector('#page-' + id + ' .viewport');
    if (vp) vp.scrollTop = 0;
    requestAnimationFrame(initVisibleCharts);
    animateIn(id);
    history.replaceState(null, '', '#' + id);
  }

  // ---- entrance motion (reduced-motion safe) ----
  const REDUCE = matchMedia('(prefers-reduced-motion: reduce)');
  function reveal(els) {
    if (REDUCE.matches || !els.length) return;
    els.forEach((el, i) => { el.classList.add('reveal'); el.classList.remove('in'); el.style.transitionDelay = Math.min(i * 55, 330) + 'ms'; });
    requestAnimationFrame(() => requestAnimationFrame(() => els.forEach(el => el.classList.add('in'))));
  }
  function animateIn(id) {
    const page = document.getElementById('page-' + id); if (!page) return;
    let els;
    if (id === 'home') els = [...page.querySelectorAll('.hero, .home-inner > .section, .home-inner > .refrain, .closing')];
    else {
      const panel = page.querySelector('.tabpanel.active');
      els = [...page.querySelectorAll('.dash-head, .ai-hero, .contact-header'), ...(panel ? [...panel.children] : [])];
    }
    reveal(els);
  }
  function animatePanel(id) {
    const panel = document.getElementById('panel-' + id); if (!panel) return;
    reveal([...panel.children]);
  }

  // nav clicks
  navList.addEventListener('click', e => {
    const item = e.target.closest('[data-nav]');
    if (item) goTo(item.dataset.nav);
  });

  // data-goto links (hero buttons)
  document.addEventListener('click', e => {
    const g = e.target.closest('[data-goto]');
    if (g) { e.preventDefault(); goTo(g.dataset.goto); }
  });

  // sidebar collapse
  document.getElementById('collapseBtn').addEventListener('click', () => {
    document.querySelector('.app').classList.toggle('collapsed');
  });

  // BI tab switching
  document.addEventListener('click', e => {
    const tab = e.target.closest('.tab');
    if (!tab) return;
    const id = tab.dataset.tab;
    const bar = tab.closest('.tabbar');
    bar.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t === tab));
    document.querySelectorAll('.tabpanel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + id));
    if (window.__renderAI) window.__renderAI(id);
    tab.scrollIntoView ? tab.closest('.tabbar').scrollTo({ left: tab.offsetLeft - 40, behavior: 'smooth' }) : null;
    animatePanel(id);
    requestAnimationFrame(initVisibleCharts);
  });

  // dashboard date-range control
  document.addEventListener('click', e => {
    const pb = e.target.closest('#periodBtn');
    if (pb) { e.stopPropagation(); pb.closest('.period').classList.toggle('open'); return; }
    const opt = e.target.closest('[data-period]');
    if (opt) {
      opt.closest('.period-menu').querySelectorAll('[data-period]').forEach(b => b.classList.toggle('on', b === opt));
      const lbl = document.getElementById('periodLabel'); if (lbl) lbl.textContent = opt.dataset.period;
      opt.closest('.period').classList.remove('open');
      return;
    }
    const open = document.querySelector('.period.open');
    if (open && !e.target.closest('.period')) open.classList.remove('open');
  });

  // working search — filters cards / rows in the active surface
  document.addEventListener('input', e => {
    const inp = e.target.closest('.search input'); if (!inp) return;
    const page = inp.closest('.page'); if (!page) return;
    const q = inp.value.trim().toLowerCase();
    const scope = page.querySelector('.tabpanel.active') || page.querySelector('.viewport');
    if (!scope) return;
    scope.querySelectorAll('.card, .seg-card, .camp-card, tbody tr').forEach(u => {
      u.style.display = (!q || u.textContent.toLowerCase().includes(q)) ? '' : 'none';
    });
  });

  // contact subtabs
  document.addEventListener('click', e => {
    const st = e.target.closest('.subtab');
    if (!st) return;
    const idx = st.dataset.subtab;
    const wrap = st.closest('.subtabs').parentElement;
    wrap.querySelectorAll('.subtab').forEach(s => s.classList.toggle('active', s === st));
    wrap.querySelectorAll('.subtab-pane').forEach(p => p.style.display = (p.dataset.pane === idx) ? '' : 'none');
    requestAnimationFrame(initVisibleCharts);
  });

  // scroll-down circle on home
  document.addEventListener('click', e => {
    if (e.target.closest('#scrollDown')) {
      document.getElementById('sec-1').scrollIntoView ? null : null;
      const vp = document.getElementById('home-scroll');
      const sec = document.getElementById('sec-1');
      if (vp && sec) vp.scrollTo({ top: sec.offsetTop - 20, behavior:'smooth' });
    }
  });

  // export-pdf -> print
  document.addEventListener('click', e => {
    if (e.target.closest('#exportPdf')) { e.preventDefault(); window.print(); }
  });

  // segment / campaign detail + builders + modal close
  document.addEventListener('click', e => {
    const segCard = e.target.closest('[data-seg]');
    if (segCard) { openSegmentDetail(+segCard.dataset.seg); return; }
    const campCard = e.target.closest('[data-camp]');
    if (campCard) { openCampaignDetail(+campCard.dataset.camp); return; }
    const opener = e.target.closest('[data-open]');
    if (opener) {
      e.preventDefault();
      const what = opener.dataset.open;
      if (what === 'seg-builder') openSegmentBuilder();
      else if (what === 'camp-builder') openCampaignBuilder();
      return;
    }
    if (e.target.closest('[data-close-modal]')) { closeModal(); }
  });

  // expose for launch cover
  window.__goTo = goTo;

  // init
  chartDefaults();
  setSurface('home');

  // home intel ticker
  const tickerMsgs = [
    '<b>42,610</b> registered customers sit one nudge from their first order.',
    'Win-Back to lapsed VIPs is returning <b>11.2x</b>. Recommend scaling.',
    '<b>R1.84M</b> is sitting in abandoned carts. The recovery window is open now.',
    'High-value customers are <b>9%</b> of the base but <b>58%</b> of revenue.',
  ];
  const tickerEl = document.getElementById('homeTicker');
  if (tickerEl) {
    const span = tickerEl.querySelector('span');
    let ti = 0;
    span.innerHTML = tickerMsgs[0];
    setInterval(() => {
      tickerEl.style.opacity = '0';
      setTimeout(() => { ti = (ti + 1) % tickerMsgs.length; span.innerHTML = tickerMsgs[ti]; tickerEl.style.opacity = '1'; }, 400);
    }, 3400);
  }
  const initial = (location.hash || '').replace('#','');
  if (NAV.find(n => n.id === initial)) goTo(initial); else goTo('home');

  // charts after fonts settle + on resize
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => requestAnimationFrame(initVisibleCharts));
  setTimeout(initVisibleCharts, 250);
  let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => {
    Object.values(_charts).forEach(c => { try { c.resize(); } catch(_){} });
  }, 160); });
})();
