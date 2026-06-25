/* ============================================================
   PAGE 2 — COMMERCE INTELLIGENCE (dark surface, 9 sections)
   Northwind e-commerce demo
   ============================================================ */

/* metric card — green ▲ for good moves, red ▼ for bad moves */
function metricCard(m, chipIcon, chipCls='') {
  let delta = '';
  if (m.delta) {
    const down = String(m.delta).trim().startsWith('-');
    const cls = m.up === true ? 'up' : m.up === false ? 'down' : 'flat';
    delta = `<span class="delta ${cls}"><span class="arr">${down ? '▼' : '▲'}</span> ${m.delta}</span>`;
  }
  const prev = m.prev ? `<span class="metric-prev">${m.prev}</span>` : '';
  const chip = chipIcon ? `<div class="metric-chip ${chipCls}">${svg(chipIcon)}</div>` : '';
  const redVal = m.tone === 'red' ? ' style="color:var(--red)"' : '';
  return `<div class="card">
    ${chip}
    <div class="metric-label ${m.tone==='grey'?'grey':''}">${m.label}</div>
    <div class="metric-value"${redVal}>${m.value}</div>
    ${(delta||prev||m.note) ? `<div class="metric-sub">${delta} ${prev} ${m.note?`<span class="metric-prev">· ${m.note}</span>`:''}</div>` : ''}
  </div>`;
}

function dtable(headers, rows) {
  const th = headers.map(h => `<th>${h}</th>`).join('');
  const tr = rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
  return `<div class="dtable-wrap"><table class="dtable"><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table></div>`;
}

/* horizontal labelled bar list */
function barList(rows, max, fmtV, fill) {
  return rows.map(r => `
    <div class="country-row">
      <span class="cn">${r[0]}</span>
      <div class="country-track"><div class="country-fill" style="width:${Math.max((r[1]/max)*100,1.5)}%;background:${fill||'var(--teal)'}"></div></div>
      <span class="cv">${fmtV(r[1])}</span>
    </div>`).join('');
}

/* ---- per-tab AI intelligence (reacts to the section you're viewing) ---- */
const AI_BY_TAB = {
  executive: {
    lead: 'Revenue is up <b>8.2%</b> to <b>R6.84M</b>, but orders dipped <b class="bad">3.1%</b> — growth is coming from a higher average order value, not more buyers.',
    sub: 'We don’t just build dashboards. We turn complex data into clear signals, so you can adapt faster and spend less time second-guessing. Two things need attention this week.',
    signals: DATA.exec.alerts,
  },
  growth: {
    lead: 'New customers are up <b>14.3%</b>, but returning customers slipped <b class="bad">5.4%</b> — you’re filling the bucket faster than you’re keeping it full.',
    signals: [
      { tone:'alert', t:'The second order is the gap', s:'Most new buyers never come back. Route this month’s cohort into a post-purchase journey.' },
      { tone:'op', t:'Acquisition is healthy', s:'14.3% new-customer growth buys you room to fix retention without starving the funnel.' },
    ],
  },
  churn: {
    lead: '<b class="bad">8,910</b> customers went quiet in 30 days and <b class="bad">34,500</b> more are predicted to lapse — but the 30-day cohort is still warm.',
    signals: [
      { tone:'alert', t:'Act on the 30-day cohort now', s:'Trigger SMS + WhatsApp win-back while intent is still recoverable.' },
      { tone:'op', t:'31% of churn is price-driven', s:'Target win-back offers only at price-sensitive lapsers — don’t discount your loyalists.' },
    ],
  },
  convert: {
    lead: '<b>42,610</b> people registered but never placed a first order — up <b>9.4%</b>. They cleared the hardest step and stopped right before buying.',
    signals: [
      { tone:'op', t:'Free shipping beats a discount', s:'A timed first-order nudge by email then SMS within 48h converts the warmest pool you have.' },
      { tone:'alert', t:'Friction sits at checkout', s:'Browse-to-cart slipped while checkout drop-off climbed — audit the mobile flow.' },
    ],
  },
  abandoned: {
    lead: '<b class="bad">R1.84M</b> is sitting in abandoned carts, up <b class="bad">12.4%</b>, and recovery slipped to <b>18.3%</b>.',
    signals: [
      { tone:'alert', t:'Shipping cost is the trigger', s:'38% of drop-off happens the moment shipping appears. Test a free-shipping threshold in cart.' },
      { tone:'op', t:'Re-fire recovery at 1h and 24h', s:'Every point of recovery here is margin you’ve already earned the demand for.' },
    ],
  },
  value: {
    lead: 'High-value customers are <b>9%</b> of your base but drive <b>58%</b> of revenue — and their lifetime value is up <b>7.3%</b>.',
    signals: [
      { tone:'op', t:'Protect the top tier', s:'Early access, WhatsApp concierge, no-questions returns. Losing a few here hurts most.' },
      { tone:'alert', t:'61% of customers are low-value', s:'Don’t spend retention budget evenly — weight it to the tier that pays the bills.' },
    ],
  },
  marketing: {
    lead: 'Win-Back to lapsed VIPs returns <b>11.2x</b> while the broad sale blast trails at <b class="bad">3.2x</b>. Precision is beating volume.',
    signals: [
      { tone:'op', t:'Shift budget to lifecycle flows', s:'Tight, well-timed sends out-earn mass discounting on every rand spent.' },
      { tone:'alert', t:'CPA is climbing to R94', s:'Acquisition is getting pricier — lean harder on owned channels and repeat revenue.' },
    ],
  },
  paid: {
    lead: 'Meta ROAS has slipped to <b class="bad">2.8x</b> and cost per customer climbed to <b class="bad">R148</b>, while Google holds at <b>4.0x</b>.',
    signals: [
      { tone:'alert', t:'Meta prospecting is buying weaker customers', s:'Cap it at the audiences still clearing 3x and shift spend to Google + retargeting.' },
      { tone:'op', t:'Cost per lead is down 4.2%', s:'Top-of-funnel efficiency is improving — the leak is in conversion quality, not lead cost.' },
    ],
  },
  segmentation: {
    lead: '<b class="bad">63%</b> of customers have ordered only once and <b class="bad">34%</b> are discount-driven — you’re acquiring buyers but not building habits.',
    signals: [
      { tone:'op', t:'Build a second-order journey', s:'Move one-time buyers into a habit-forming flow before they lapse.' },
      { tone:'alert', t:'You’re training a third to wait for sales', s:'Reserve discounts for the discount-driven segment only.' },
    ],
  },
};

function renderAIBody(id) {
  const a = AI_BY_TAB[id] || AI_BY_TAB.executive;
  const signals = a.signals.map(s => `
    <div class="ai-signal ${s.tone}">
      <div class="ai-sig-ic">${svg(s.tone==='alert'?'alert':'trend')}</div>
      <div class="ai-sig-body"><div class="ai-sig-t">${s.t}</div><div class="ai-sig-s">${s.s}</div></div>
    </div>`).join('');
  return `
    <div class="ai-summary-col">
      <p class="ai-summary">${a.lead}</p>
      ${a.sub ? `<p class="ai-summary-2">${a.sub}</p>` : ''}
    </div>
    <div class="ai-signals">${signals}</div>`;
}

/* ---- hero AI panel (reads the store, reacts to the active tab) ---- */
function aiHeroPanel() {
  return `<div class="ai-hero">
    <div class="ai-hero-head">
      <span class="ai-badge">${svg('zap')} weGAS Intelligence</span>
      <span class="ai-live"><span class="d"></span> <span id="aiReading">reading Executive View</span> · live</span>
    </div>
    <div class="ai-hero-grid" id="aiPanelBody">${renderAIBody('executive')}</div>
  </div>`;
}

/* ---------- 1 · EXECUTIVE VIEW ---------- */
function tabExec() {
  const e = DATA.exec;
  const cards = e.headline.map((m,i) => metricCard(m, ['money','users','cart','tag','target'][i], i===0?'lime':'')).join('');
  const trends = e.trends.map(t => `
    <div class="card"><div class="metric-label grey">${t.k}</div><div class="metric-value" style="font-size:26px">${t.v}</div><div class="metric-sub"><span class="metric-prev">${t.sub}</span></div></div>`).join('');
  return `
    <div class="section-label">Business Health · This Month</div>
    <div class="grid cols-5">${cards}</div>

    <div class="grid cols-2" style="margin-top:16px">
      <div class="card lg">
        <div class="card-head"><span class="card-title">Revenue Trend</span><span class="card-note">Jan 2025 → Jun 2026 · ZAR / month</span></div>
        <div class="chart-box" style="height:300px"><canvas id="exRev"></canvas></div>
      </div>
      <div class="card lg">
        <div class="card-head"><span class="card-title">Revenue Split</span><span class="card-note">new vs returning</span></div>
        <div class="chart-box" style="height:300px"><canvas id="exSplit"></canvas></div>
      </div>
    </div>

    <div class="section-label">Forecasting &amp; Signals</div>
    <div class="grid cols-3">${trends}</div>

    ${intelBox({ variant:'op',
      observation:'Average order value is up 11.6% while order count is down 3.1%.',
      implication:'Your existing customers are spending more, but the top of the funnel is leaking. Lean too hard on AOV and growth stalls when this cohort matures.',
      action:'protect AOV gains with bundles, and reopen the funnel by fixing mobile checkout and re-engaging the 42,610 registered-never-purchased.',
      tag:{ type:'impact', value:'+R420k' } })}

    ${intelBox({ variant:'alert',
      observation:'R1.84M is sitting in abandoned carts, up 12.4% this month.',
      implication:'The recovery flow isn\'t firing reliably on mobile, where most of the drop-off happens.',
      action:'fix the mobile cart-recovery trigger first — it is the fastest revenue you can recover this week.',
      tag:{ type:'priority', value:'HIGH' } })}`;
}

/* ---------- 2 · CUSTOMER GROWTH ---------- */
function tabGrowth() {
  const cards = DATA.growth.cards.map((m,i) => metricCard(m, ['users','plus','repeat','trend'][i], i===1?'lime':'')).join('');
  return `
    <div class="section-label">How many customers are joining your business?</div>
    <div class="grid cols-4">${cards}</div>

    <div class="card lg" style="margin-top:16px">
      <div class="card-head"><span class="card-title">Customer Growth Trend</span><span class="card-note">new vs returning customers · monthly</span></div>
      <div class="chart-box" style="height:320px"><canvas id="cgNewReturn"></canvas></div>
    </div>

    ${intelBox({ variant:'op',
      observation:'New customer acquisition is up 14.3%, but returning customers slipped 5.4% this month.',
      implication:'You\'re filling the top of the bucket faster than you\'re keeping it full. Acquisition without retention is a treadmill.',
      action:'route this month\'s new buyers straight into the post-purchase journey to lift the second-order rate.',
      tag:{ type:'impact', value:'+R310k' } })}`;
}

/* ---------- 3 · CUSTOMERS YOU'RE LOSING ---------- */
function tabChurn() {
  const cards = DATA.churn.cards.map((m,i) => metricCard(m, ['clock','clock','clock','alert'][i])).join('');
  const maxR = Math.max(...DATA.churn.reasons.map(r=>r[1]));
  return `
    <div class="section-label">Who bought from you and never came back?</div>
    <div class="grid cols-4">${cards}</div>

    <div class="grid cols-2" style="margin-top:16px">
      <div class="card lg">
        <div class="card-head"><span class="card-title">Churn Trend</span><span class="card-note">% of active base lost per month</span></div>
        <div class="chart-box" style="height:280px"><canvas id="chTrend"></canvas></div>
      </div>
      <div class="card lg">
        <div class="card-head"><span class="card-title">Why Customers Leave</span><span class="card-note">exit-survey + behavioural signals</span></div>
        <div class="chart-box" style="height:280px"><canvas id="chReasons"></canvas></div>
      </div>
    </div>

    ${intelBox({ variant:'alert',
      observation:'8,910 customers have gone quiet in the last 30 days, and 34,500 more are predicted to lapse within the month.',
      implication:'The 30-day cohort still has warm intent. The longer the silence, the lower the odds of recovery.',
      action:'trigger the SMS + WhatsApp win-back on the 30-day cohort now, while they are still reachable.',
      tag:{ type:'priority', value:'HIGH' } })}

    ${intelBox({ variant:'op', compact:true,
      observation:'31% of churn is price-driven — these shoppers found it cheaper elsewhere.',
      implication:'Discounting everyone to defend them erodes margin across your whole base.',
      action:'target win-back offers only at price-sensitive lapsers, not full-price loyalists.',
      tag:{ type:'priority', value:'MED' } })}`;
}

/* ---------- 4 · CUSTOMERS WAITING TO CONVERT ---------- */
function tabConvert() {
  const cards = DATA.convert.cards.map((m,i) => metricCard(m, ['target','trend','clock','cart'][i], i===0?'magenta':'')).join('');
  const maxF = DATA.convert.funnel[0][2];
  const funnel = DATA.convert.funnel.map((f,i) => `
    <div class="funnel-row">
      <div class="funnel-label"><span>${f[0]}</span><span class="funnel-pct">${f[1]}%</span></div>
      <div class="funnel-track"><div class="funnel-fill ${i===DATA.convert.funnel.length-1?'last':''}" style="width:${(f[2]/maxF)*100}%">${fmt(f[2])}</div></div>
    </div>`).join('');
  return `
    <div class="section-label">Who's interested but hasn't purchased yet?</div>
    <div class="grid cols-4">${cards}</div>

    <div class="card lg" style="margin-top:16px">
      <div class="card-head"><span class="card-title">Conversion Funnel</span><span class="card-note">store sessions → purchase · this month</span></div>
      <div class="funnel">${funnel}</div>
    </div>

    ${intelBox({ variant:'op',
      observation:'42,610 people registered an account but never placed a first order — up 9.4% this month.',
      implication:'They cleared the hardest step, signing up, and stopped right before the first purchase. This is the warmest untapped pool you have.',
      action:'run a timed first-order nudge (free shipping, not discount) by email then SMS within 48h of signup.',
      tag:{ type:'impact', value:'+R640k' } })}

    ${intelBox({ variant:'alert', compact:true,
      observation:'Browse-to-cart slipped 0.6pts while checkout drop-off climbed.',
      implication:'The friction is between cart and checkout, not on product pages.',
      action:'audit the mobile checkout flow — shipping cost and forced account creation are the usual culprits.',
      tag:{ type:'priority', value:'HIGH' } })}`;
}

/* ---------- 5 · ABANDONED REVENUE ---------- */
function tabAbandoned() {
  const cards = DATA.abandoned.cards.map((m,i) => metricCard(m, ['cart','repeat','funnel','money'][i], i===3?'lime':'')).join('');
  return `
    <div class="section-label">How much money is being left behind?</div>
    <div class="grid cols-4">${cards}</div>

    <div class="grid cols-2" style="margin-top:16px">
      <div class="card lg">
        <div class="card-head"><span class="card-title">Most Abandoned Products</span><span class="card-note">value left in carts · ZAR</span></div>
        <div class="chart-box" style="height:300px"><canvas id="abProducts"></canvas></div>
      </div>
      <div class="card lg">
        <div class="card-head"><span class="card-title">Where Checkout Breaks</span><span class="card-note">drop-off reason</span></div>
        <div class="chart-box" style="height:300px"><canvas id="abDrop"></canvas></div>
      </div>
    </div>

    ${intelBox({ variant:'alert',
      observation:'R1.84M sits in abandoned carts and recovery slipped to 18.3%. 38% of drop-off happens when shipping cost first appears.',
      implication:'Every point of recovery here is pure margin you\'ve already earned the demand for.',
      action:'test a shipping-threshold nudge in cart, and re-fire the recovery email + SMS at 1h and 24h.',
      tag:{ type:'impact', value:'+R280k' } })}`;
}

/* ---------- 6 · YOUR MOST VALUABLE CUSTOMERS ---------- */
function tabValue() {
  const cards = DATA.value.cards.map((m,i) => metricCard(m, ['star','users','users','coin'][i], i===0?'lime':'')).join('');
  return `
    <div class="section-label">Who drives the majority of your revenue?</div>
    <div class="grid cols-4">${cards}</div>

    <div class="grid cols-2" style="margin-top:16px">
      <div class="card lg">
        <div class="card-head"><span class="card-title">Revenue by Value Tier</span><span class="card-note">share of total revenue</span></div>
        <div class="chart-box" style="height:300px"><canvas id="cvalTiers"></canvas></div>
      </div>
      <div class="card lg">
        <div class="card-head"><span class="card-title">Lifetime Value Distribution</span><span class="card-note">customers by LTV band</span></div>
        <div class="chart-box" style="height:300px"><canvas id="cvalLtv"></canvas></div>
      </div>
    </div>

    ${intelBox({ variant:'op',
      observation:'High-value customers are just 9% of your base but drive 58% of revenue — and their LTV is up 7.3%.',
      implication:'A small group carries the business. Losing even a few hurts far more than losing many low-value buyers.',
      action:'give the high-value tier a dedicated VIP track: early access, WhatsApp concierge, and a no-questions returns promise.',
      tag:{ type:'priority', value:'HIGH' } })}`;
}

/* ---------- 7 · MARKETING PERFORMANCE ---------- */
function tabMarketing() {
  const cards = DATA.marketing.cards.map((m,i) => metricCard(m, ['trend','money','tag','send'][i], i===0?'lime':'')).join('');
  const rows = DATA.marketing.campaigns.map(([c,ch,sent,conv,rev,roi]) => [
    `<strong style="color:#fff">${c}</strong>`,
    `<span class="chan-badge">${ch}</span>`,
    sent, conv, `<span style="color:var(--lime);font-weight:600">${rev}</span>`, `<span class="roi-badge">${roi}</span>`
  ]);
  return `
    <div class="section-label">Which campaigns actually generate revenue?</div>
    <div class="grid cols-4">${cards}</div>

    <div class="section-label">Campaign ROI</div>
    <div class="card" style="padding:8px 8px 4px">
      ${dtable(['Campaign','Channel','Sent','Conversions','Revenue','ROI'], rows)}
    </div>

    <div class="grid cols-2" style="margin-top:16px">
      <div class="card lg">
        <div class="card-head"><span class="card-title">Revenue by Channel</span><span class="card-note">attributed ZAR</span></div>
        <div class="chart-box" style="height:280px"><canvas id="mkChannel"></canvas></div>
      </div>
      <div class="card lg">
        <div class="card-head"><span class="card-title">ROI by Campaign</span><span class="card-note">return on spend</span></div>
        <div class="chart-box" style="height:280px"><canvas id="mkRoi"></canvas></div>
      </div>
    </div>

    ${intelBox({ variant:'op',
      observation:'Win-Back to lapsed VIPs returns 11.2x while the broad Seasonal Sale blast trails at 3.2x.',
      implication:'Precision beats volume. Tight, well-timed flows out-earn mass discounting on every rand spent.',
      action:'shift budget from broad blasts into targeted lifecycle flows, and clone the Win-Back logic onto at-risk high-value customers.',
      tag:{ type:'impact', value:'+R1.18M' } })}`;
}

/* ---------- 8 · PAID MEDIA INTELLIGENCE ---------- */
function tabPaid() {
  const cards = DATA.paid.cards.map((m,i) => metricCard(m, ['money','trend','target','users'][i])).join('');
  const platforms = DATA.paid.platforms.map(p => `
    <div class="chan-cluster">
      <div class="head">
        <div class="chip" style="background:rgba(123,255,95,0.1);color:var(--lime)">${svg(p.icon)}</div>
        <div><h3>${p.name}</h3></div>
        <span class="roi-badge" style="margin-left:auto">${p.roas} ROAS</span>
      </div>
      <div class="chan-metrics">
        <div class="chan-metric"><span class="k">Spend</span><span class="v">${p.spend}</span></div>
        <div class="chan-metric"><span class="k">Revenue</span><span class="v ${p.up?'lime':''}">${p.rev}</span></div>
        <div class="chan-metric"><span class="k">Avg CPC</span><span class="v">${p.cpc}</span></div>
        <div class="chan-metric"><span class="k">Conv. Rate</span><span class="v">${p.conv}</span></div>
      </div>
    </div>`).join('');
  return `
    <div class="section-label">Know where every advertising rand goes</div>
    <div class="grid cols-4">${cards}</div>

    <div class="section-label">Platform Performance</div>
    <div class="grid cols-3">${platforms}</div>

    <div class="card lg" style="margin-top:16px">
      <div class="card-head"><span class="card-title">ROAS Trend · Google vs Meta</span><span class="card-note">last 9 months</span></div>
      <div class="chart-box" style="height:280px"><canvas id="pmRoas"></canvas></div>
    </div>

    ${intelBox({ variant:'alert',
      observation:'Meta ROAS has slipped to 2.8x while cost per customer climbed to R148. Google is holding at 4.0x.',
      implication:'Prospecting spend on Meta is buying weaker customers. You\'re paying more to acquire people who spend less.',
      action:'shift the prospecting budget toward Google and retargeting, and cap Meta at the audiences still clearing 3x.',
      tag:{ type:'priority', value:'HIGH' } })}`;
}

/* ---------- 9 · CUSTOMER SEGMENTATION ---------- */
function tabSegmentation() {
  const maxFreq = Math.max(...DATA.segTab.frequency.map(f=>f[1]));
  const maxGeo = Math.max(...DATA.segTab.geo.map(g=>g[1]));
  const beh = DATA.segTab.behaviour.map(b => `
    <div class="tier-card">
      <div class="tn">${b[0]}</div>
      <div class="tm"><span class="k">share of base</span><span class="v">${b[1]}%</span></div>
      <div class="tbar"><div style="width:${b[1]*2.6}%;background:${b[2]}"></div></div>
    </div>`).join('');
  return `
    <div class="section-label">Stop marketing to everyone</div>
    <div class="grid cols-2">
      <div class="card lg">
        <div class="card-head"><span class="card-title">Purchase Frequency</span><span class="card-note">customers by lifetime orders</span></div>
        <div class="chart-box" style="height:280px"><canvas id="segFreq"></canvas></div>
      </div>
      <div class="card lg">
        <div class="card-head"><span class="card-title">Product Interest</span><span class="card-note">share of customers by top category</span></div>
        <div class="chart-box" style="height:280px"><canvas id="segInterest"></canvas></div>
      </div>
    </div>

    <div class="section-label">Behaviour Segments</div>
    <div class="tier-strip">${beh}</div>

    <div class="section-label">Geographic Segments</div>
    <div class="card lg"><div class="country-list">${barList(DATA.segTab.geo, maxGeo, fmt, 'var(--teal)')}</div></div>

    ${intelBox({ variant:'op',
      observation:'63% of customers have ordered only once, and 34% of the base is discount-driven.',
      implication:'You\'re acquiring buyers but not building habits — and training a third of them to wait for a sale.',
      action:'move one-time buyers into a second-order journey and reserve discounts for the discount-driven segment only.',
      tag:{ type:'impact', value:'+R520k' } })}`;
}

const BI_TABS = [
  { id:'executive', label:'Executive View', render:tabExec },
  { id:'growth', label:'Customer Growth', render:tabGrowth },
  { id:'churn', label:'Customers Losing', render:tabChurn },
  { id:'convert', label:'Waiting to Convert', render:tabConvert },
  { id:'abandoned', label:'Abandoned Revenue', render:tabAbandoned },
  { id:'value', label:'Valuable Customers', render:tabValue },
  { id:'marketing', label:'Marketing', render:tabMarketing },
  { id:'paid', label:'Paid Media', render:tabPaid },
  { id:'segmentation', label:'Segmentation', render:tabSegmentation },
];

function renderBI() {
  const tabs = BI_TABS.map((t,i) => `<button class="tab ${i===0?'active':''}" data-tab="${t.id}">${t.label}</button>`).join('');
  const panels = BI_TABS.map((t,i) => `<div class="tabpanel ${i===0?'active':''}" id="panel-${t.id}">${t.render()}</div>`).join('');

  return `
  <div class="topbar dark">
    <div class="topbar-logo">we<span class="gas">GAS</span></div>
    <div class="search">${svg('search')}<input placeholder="search the board…"></div>
    <div class="topbar-spacer"></div>
    <div class="topbar-actions">
      <button class="icon-btn">${svg('bell')}<span class="dot"></span></button>
      <div class="user-chip"><div class="avatar">TW</div><span class="uname">Thyla Wgas</span></div>
    </div>
  </div>
  <div class="viewport surface-dark">
    <div class="dash">
      <div class="dash-head">
        <div class="dash-title">
          <div class="badge">N</div>
          <div>
            <h1>Northwind</h1>
            <div class="sub">Commerce Intelligence · Jun 2026</div>
          </div>
        </div>
        <div class="dash-actions">
          <div class="period" id="periodCtl">
            <button class="period-btn" id="periodBtn">${svg('cal')} <span id="periodLabel">Last 30 days</span> <span class="period-caret">${svg('chevron')}</span></button>
            <div class="period-menu" id="periodMenu">
              ${['Last 7 days','Last 30 days','Last 90 days','Year to date'].map(p=>`<button data-period="${p}" class="${p==='Last 30 days'?'on':''}">${p}</button>`).join('')}
            </div>
          </div>
          <a class="export-link" id="exportPdf">${svg('pdf')} Export</a>
        </div>
      </div>
      ${aiHeroPanel()}
      <div class="tabbar">${tabs}</div>
      ${panels}
      <div class="dash-foot"><span class="r-line"></span><span class="tx">clarity creates <span class="mag">momentum</span></span><span class="r-line"></span></div>
    </div>
  </div>`;
}

/* swap the AI panel + reading label when the active tab changes */
const BI_TAB_LABEL = BI_TABS.reduce((m,t) => (m[t.id]=t.label, m), {});
window.__renderAI = function (id) {
  const body = document.getElementById('aiPanelBody');
  if (!body) return;
  body.innerHTML = renderAIBody(id);
  body.classList.remove('ai-swap'); void body.offsetWidth; body.classList.add('ai-swap');
  const reading = document.getElementById('aiReading');
  if (reading) reading.textContent = 'reading ' + (BI_TAB_LABEL[id] || 'Executive View');
};
