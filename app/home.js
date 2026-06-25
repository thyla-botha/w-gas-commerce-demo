/* ============================================================
   PAGE 1 — HOME (light marketing surface)
   Northwind · e-commerce intelligence · minimal editorial
   ============================================================ */
function renderHome() {

  // marketing copy blocks (kept short, confident, minimal)
  const blocks = [
    {
      num:'01 / RELATIONSHIPS', title:'relationships first.',
      lead:[
        'Great technology is easy to buy.',
        'Great partnerships are harder to find.',
      ],
      soft:[
        'The strongest businesses are built on trust, transparency and shared goals.',
        'That’s why we understand your business before recommending platforms, dashboards or automation.',
      ],
      cap:'Because no system succeeds without the people behind it.'
    },
    {
      num:'02 / THE FUTURE', title:'the future isn’t <span class="mag">slowing down</span>.',
      lead:[
        'AI is accelerating. Expectations are changing. Complexity is everywhere.',
      ],
      soft:[
        'Most businesses don’t need more technology. They need clarity. They need confidence.',
        'They need to know what matters, what doesn’t, and where to focus next.',
      ],
    },
    {
      num:'03 / DIRECTION', title:'data should create <span class="mag">direction</span>.',
      lead:[
        'Information is everywhere. Insight is rare.',
      ],
      soft:[
        'The goal isn’t to collect more data — it’s to understand what the data is trying to tell you.',
        'Where customers are getting stuck. Where opportunities are being missed. Where growth is already happening.',
      ],
    },
    {
      num:'04 / SYSTEMS + PEOPLE', title:'systems <span class="mag">+</span> people.',
      lead:[
        'The magic happens between the technology and the humans using it.',
      ],
      soft:[
        'Every platform can generate reports. Every dashboard can display numbers.',
        'Real impact comes from the conversations, decisions and actions that happen afterwards.',
      ],
      cap:'That’s where we work.'
    },
    {
      num:'05 / CALM', title:'build calm into <span class="mag">complexity</span>.',
      lead:[
        'Hope is not a strategy. Neither is reacting to every new trend.',
      ],
      soft:[
        'We help businesses create clear foundations, connected systems and reliable data — so growth becomes intentional instead of accidental.',
      ],
    },
    {
      num:'06 / ADAPTABILITY', title:'a business that can <span class="mag">adapt</span> wins.',
      lead:[
        'The tools will change. The principles won’t.',
      ],
      soft:[],
      pillars:['Adaptability','Emotional intelligence','Strong leadership','Clear information'],
    },
  ];

  const sections = blocks.map((b,i) => {
    const lead = b.lead.map(l => `<p class="lede">${l}</p>`).join('');
    const soft = b.soft.map(l => `<p class="lede soft">${l}</p>`).join('');
    const cap = b.cap ? `<p class="caption">${b.cap}</p>` : '';
    const pillars = b.pillars ? `<div class="pillars">${b.pillars.map(p => `<span>${p}</span>`).join('')}</div>` : '';
    // insert the refrain after blocks 2 and 5
    const refrain = (i===1 || i===4) ? `
      <section class="refrain">
        <span class="r-line"></span>
        <h3>clarity creates <span class="mag">momentum</span>.</h3>
        <span class="r-line"></span>
      </section>` : '';
    return `
      <section class="section block" id="sec-${i+1}">
        <div class="section-num">${b.num}</div>
        <h2>${b.title}</h2>
        <div class="block-body">${lead}${soft}${cap}${pillars}</div>
      </section>${refrain}`;
  }).join('');

  return `
  <div class="topbar">
    <div class="topbar-logo">we<span class="gas">GAS</span></div>
    <div class="search">${svg('search')}<input placeholder="search customers, segments, campaigns…"></div>
    <div class="topbar-spacer"></div>
    <div class="topbar-actions">
      <button class="icon-btn">${svg('bell')}<span class="dot"></span></button>
      <div class="user-chip"><div class="avatar">TW</div><span class="uname">Thyla Wgas</span></div>
    </div>
  </div>

  <div class="viewport" id="home-scroll">
    <section class="hero">
      <div class="eyebrow">DATA &amp; COMMERCE INTELLIGENCE</div>
      <h1>clarity creates <span class="mag">momentum</span>.</h1>
      <div class="hero-actions">
        <a class="pill pill-magenta" data-goto="bi">See the intelligence ${svg('arrowRight')}</a>
        <button class="scroll-circle" id="scrollDown" title="Scroll">${svg('arrowDown')}</button>
      </div>
    </section>

    <div class="home-inner">
      ${sections}

      <!-- live intelligence ticker -->
      <section class="section" id="sec-ticker" style="border-top:none">
        <div class="ticker">
          <div class="ticker-head">
            <span class="lbl">weGAS Intelligence is watching</span>
            <span class="live">Live</span>
          </div>
          <div class="ticker-item ticker-fade" id="homeTicker">${svg('zap')}<span></span></div>
        </div>
      </section>
    </div>

    <!-- closing -->
    <section class="closing" id="sec-close">
      <div class="section-num">THE BOTTOM LINE</div>
      <h2>we don’t just build<br><span class="mag">dashboards</span>.</h2>
      <p class="sub">We help businesses make sense of change — turning complex data into clear signals so you can adapt faster, spot opportunities sooner, and spend less time second-guessing. Because uncertainty slows businesses down. Clarity creates momentum.</p>
      <a class="pill pill-magenta" data-goto="bi">Step inside the dashboard ${svg('arrowRight')}</a>
    </section>

    <footer class="home-footer">
      <div><span style="text-transform:none">weGAS.</span> · DATA &amp; COMMERCE INTELLIGENCE</div>
      <div>NORTHWIND · DEMO ENVIRONMENT</div>
    </footer>
  </div>`;
}
