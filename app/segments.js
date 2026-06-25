/* ============================================================
   PAGE 4 — SEGMENTS (dark surface) · Northwind e-commerce
   ============================================================ */
const SEGMENT_ROWS = [
  { name:'All Customers', chan:'All Channels', icon:'users', count:712480, desc:'Every customer on record — the full addressable base.', tier:'Base', tone:'', fill:'var(--grey)',
    channels:['Email'], est:'R6.8M / mo', variant:'op',
    why:'The whole base, used sparingly. Blasting everyone burns deliverability and trains people to ignore you.',
    play:'reserve full-base sends for genuine, rare moments. Everything else runs through tighter segments.' },
  { name:'Repeat Buyers', chan:'Email', icon:'repeat', count:209840, desc:'Customers who have placed two or more orders.', tier:'Loyal', tone:'lime', fill:'var(--lime)',
    channels:['Email','WhatsApp'], est:'R4.1M / mo', variant:'op',
    why:'Repeat buyers are the foundation of recurring revenue and the cheapest growth you have.',
    play:'keep them active with replenishment reminders and rewards timed to each customer’s RFM tier.' },
  { name:'VIP / High-Value', chan:'WhatsApp · Email', icon:'star', count:64120, desc:'Top spenders — 9% of the base, 58% of revenue.', tier:'Champions', tone:'lime', fill:'var(--lime)',
    channels:['WhatsApp','Email'], est:'R3.9M / mo', variant:'op',
    why:'Your revenue core. A small group that drives an outsized share of orders.',
    play:'protect aggressively — VIP early access, WhatsApp concierge, no-questions returns. Clone winning campaigns here first.' },
  { name:'First-Time Buyers', chan:'Email', icon:'bag', count:142100, desc:'Placed exactly one order — the second-order opportunity.', tier:'Potential', tone:'', fill:'var(--teal)',
    channels:['Email'], est:'R1.6M / mo', variant:'op',
    why:'A first order is a habit not yet formed. The second order is where lifetime value really begins.',
    play:'move them into a post-purchase journey that earns the second order within 30 days.' },
  { name:'Cart Abandoners', chan:'Email · SMS', icon:'cart', count:28440, desc:'Added to cart in the last 7 days but didn’t check out.', tier:'At-Risk', tone:'red', fill:'var(--red)',
    channels:['Email','SMS'], est:'R1.84M recoverable', variant:'alert',
    why:'The demand is already there — they told you what they want. The friction is at checkout.',
    play:'re-fire the recovery email + SMS at 1h and 24h, and test a shipping-threshold nudge.' },
  { name:'Win-Back · Lapsed 30-90d', chan:'Email · WhatsApp', icon:'whatsapp', count:35830, desc:'Previous buyers gone quiet across the 30 / 60 / 90-day windows.', tier:'At-Risk', tone:'red', fill:'var(--red)',
    channels:['Email','SMS','WhatsApp'], est:'R1.2M recoverable', variant:'alert',
    why:'These customers had value and went quiet. The longer the gap, the lower the odds of recovery.',
    play:'trigger SMS + WhatsApp win-back on the 30-day cohort first, while intent is still warm.' },
  { name:'Registered · Never Purchased', chan:'SMS · Email', icon:'target', count:42610, desc:'Created an account but never placed a first order.', tier:'Potential', tone:'mag', fill:'var(--magenta)',
    channels:['SMS','Email'], est:'R640k untapped', variant:'op',
    why:'They cleared the hardest step — signing up — and stopped right before the first purchase.',
    play:'a timed first-order nudge (free shipping, not discount) by email then SMS converts a meaningful share.' },
  { name:'Discount-Driven', chan:'Email', icon:'tag', count:242240, desc:'Buy mostly on promotion — a third of the base.', tier:'Loyal', tone:'', fill:'#F5B73D',
    channels:['Email'], est:'margin watch', variant:'alert',
    why:'Discounting everyone to keep this group erodes margin across your whole base.',
    play:'reserve discounts for this segment only. Keep full-price loyalists on full price.' },
  { name:'SMS Opt-In · Recent', chan:'SMS', icon:'sms', count:9840, desc:'Ordered within 30 days and reachable by SMS.', tier:'Champions', tone:'lime', fill:'var(--lime)',
    channels:['SMS'], est:'R980k / mo', variant:'op',
    why:'Recent, reachable and warm — the perfect group for time-sensitive launches.',
    play:'use SMS for restocks, early access and limited-window offers.' },
  { name:'High-Refund · At-Risk', subtitle:'internal: returns watch', chan:'Email', icon:'alert', count:3800, desc:'Elevated return rate with rising churn risk.', tier:'At-Risk', tone:'red', fill:'var(--red)',
    channels:['Email'], est:'retention focus', variant:'alert',
    why:'High returns are a satisfaction signal, not an upsell opportunity. Pushing harder here is the wrong move.',
    play:'lead with sizing/fit guidance and product-match content, not aggressive promotion.' },
  { name:'Email Subscribers · No Order', chan:'Email', icon:'mail', count:51200, desc:'Subscribed to email but haven’t bought yet.', tier:'Potential', tone:'mag', fill:'var(--magenta)',
    channels:['Email'], est:'R520k untapped', variant:'op',
    why:'They want to hear from you — they just haven’t found the right reason to buy.',
    play:'lead with bestsellers and social proof, then a first-order incentive on the third touch.' },
];

function renderSegments() {
  const base = 712480;
  const cards = SEGMENT_ROWS.map((s,i) => {
    const share = Math.round((s.count / base) * 100);
    return `
    <div class="seg-card" data-seg="${i}">
      <div class="top">
        <div class="metric-chip">${svg(s.icon)}</div>
        <span class="tier-pill ${s.tone}">${s.tier}</span>
      </div>
      <div class="seg-chan">${s.chan}</div>
      <div class="seg-name">${s.name}</div>
      <p class="seg-desc">${s.desc}</p>
      <div class="seg-foot">
        <div class="seg-count">${fmt(s.count)}</div>
        <div class="seg-share">${share}% of base</div>
      </div>
      <div class="seg-bar"><div class="seg-fill" style="width:${Math.max(share,2)}%;background:${s.fill}"></div></div>
    </div>`;
  }).join('');

  const summary = [
    { chip:'segments', label:'Active Segments', value:String(SEGMENT_ROWS.length) },
    { chip:'users', label:'Customers Segmented', value:'712,480' },
    { chip:'target', label:'Conversion-Ready', value:'42,610', tone:'mag' },
    { chip:'zap', label:'Re-Engagement Pool', value:'35,830', tone:'lime' },
  ].map(m => `<div class="card">
      <div class="metric-chip ${m.tone==='lime'?'lime':m.tone==='mag'?'magenta':''}">${svg(m.chip)}</div>
      <div class="metric-label ${m.tone?'':'grey'}">${m.label}</div>
      <div class="metric-value">${m.value}</div>
    </div>`).join('');

  const maxRev = Math.max(...DATA.rfm.map(r=>r[2]));
  const tiers = DATA.rfm.map(([seg,b,rev]) => `
    <div class="tier-card">
      <div class="tn">${seg}</div>
      <div class="tm"><span class="k">% of base</span><span class="v">${b}%</span></div>
      <div class="tm"><span class="k">% of revenue</span><span class="v rev">${rev}%</span></div>
      <div class="tbar"><div style="width:${(rev/maxRev)*100}%"></div></div>
    </div>`).join('');

  return `
  <div class="topbar dark">
    <div class="topbar-logo">we<span class="gas">GAS</span></div>
    <div class="search">${svg('search')}<input placeholder="search segments…"></div>
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
          <div><h1>Segments</h1><div class="sub">Northwind · live audience builder</div></div>
        </div>
        <div class="work-actions">
          <a class="pill pill-teal" style="padding:11px 22px;font-size:11px" data-open="seg-builder">${svg('target')} New Segment</a>
        </div>
      </div>

      <div class="grid cols-4" style="margin-top:26px">${summary}</div>

      <div class="section-label">All Segments <span style="color:var(--grey-2);font-weight:400;text-transform:none;letter-spacing:0">· click any segment for detail</span></div>
      <div class="seg-grid">${cards}</div>

      <div class="section-label">RFM Value Tiers</div>
      <div class="tier-strip">${tiers}</div>

      ${intelBox({ variant:'op',
        observation:'Champions are 9% of the base but drive 58% of revenue.',
        implication:'Segmentation keeps the right message on the right tier — protecting high-value customers while converting the 42,610 registered-but-never-purchased.',
        action:'never burn your best offers on low-value audiences. Match offer depth to RFM tier.',
        tag:{ type:'impact', value:'+R640k' } })}
    </div>
  </div>`;
}
