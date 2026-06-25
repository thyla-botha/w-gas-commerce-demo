/* ============================================================
   PAGE 5 — CAMPAIGNS (dark surface) · Northwind e-commerce
   ============================================================ */
const CAMPAIGNS = [
  { name:'Win-Back · Lapsed VIP', status:'Active', chan:'WhatsApp', seg:'Win-Back · Lapsed 30-90d',
    sent:'12,640', conv:'410', rev:'R1,180,000', roi:'11.2x', feature:true, card:true,
    flow:[
      ['trigger','Previous VIP · no order 60+ days'],
      ['send','WhatsApp · we saved your favourites'],
      ['wait','Wait 3 days'],
      ['cond','If no reply'],
      ['send','WhatsApp · personal note + free shipping'],
    ],
    intel:{ variant:'op', observation:'Highest-ROI campaign in the account at 11.2x \u2014 WhatsApp to lapsed VIPs.',
      implication:'Reach is small but every recovered VIP is worth far more than a new customer.',
      action:'expand the budget and clone this logic onto at-risk high-value customers.', tag:{type:'impact',value:'+R1.18M'} } },
  { name:'Abandoned Cart Recovery', status:'Active', chan:'Email+SMS', seg:'Cart Abandoners',
    sent:'41,220', conv:'1,310', rev:'R1,420,000', roi:'8.4x', feature:true, card:true,
    flow:[
      ['trigger','Cart abandoned · no checkout in 1h'],
      ['send','Email · your cart is waiting'],
      ['wait','Wait 1 day'],
      ['cond','If still not purchased'],
      ['send','SMS · complete your order + free shipping'],
    ],
    intel:{ variant:'op', observation:'8.4x ROI recovering carts left at checkout.',
      implication:'These shoppers already chose the product. The gap is friction, not intent.',
      action:'tighten the first send to within 1h and fix the mobile checkout trigger.', tag:{type:'impact',value:'+R1.42M'} } },
  { name:'First-Order Nudge', status:'Active', chan:'Email', seg:'Registered · Never Purchased',
    sent:'38,510', conv:'640', rev:'R890,000', roi:'5.1x', card:true,
    flow:[
      ['trigger','Registered · no order in 48h'],
      ['send','Email · welcome + bestsellers'],
      ['wait','Wait 4 days'],
      ['cond','If opened, not purchased'],
      ['send','Email · free shipping on first order'],
    ],
    intel:{ variant:'op', observation:'5.1x converting registered-but-never-purchased through email alone.',
      implication:'Adding an SMS step would likely lift first-order conversion further.',
      action:'A/B test an SMS branch for sign-ups who opted into SMS.', tag:{type:'impact',value:'+R890k'} } },
  { name:'Repeat-Buyer Rewards', status:'Active', chan:'Email', seg:'Repeat Buyers',
    sent:'28,440', conv:'720', rev:'R760,000', roi:'4.6x', card:true,
    flow:[
      ['trigger','2+ orders · 30 days since last'],
      ['send','Email · rewards + replenishment'],
      ['wait','Wait 3 days'],
      ['cond','If clicked'],
      ['send','Email · tiered loyalty offer'],
    ],
    intel:{ variant:'op', observation:'4.6x lifting order frequency among already-loyal customers.',
      implication:'This group responds to timing and rewards more than discount depth.',
      action:'test replenishment timing rather than increasing discount size.', tag:{type:'impact',value:'+R760k'} } },
  { name:'Seasonal Sale Blast', status:'Completed', chan:'Email', seg:'All Customers',
    sent:'64,280', conv:'980', rev:'R540,000', roi:'3.2x', card:true,
    flow:[
      ['trigger','All customers · sale window'],
      ['send','Email · season sale is live'],
    ],
    intel:{ variant:'op', observation:'Broad sale blast at 3.2x \u2014 the lowest ROI of the active set.',
      implication:'Mass sends reach everyone but convert thinly. Volume, not precision.',
      action:'narrow the next sale send to recent and high-intent buyers.', tag:{type:'priority',value:'MED'} } },
  { name:'VIP Early Access · Q3', status:'Scheduled', chan:'WhatsApp', seg:'VIP / High-Value',
    sent:'n/a', conv:'n/a', rev:'n/a', roi:'n/a', card:false,
    flow:[ ['trigger','VIP tier · Q3 launch window'], ['send','WhatsApp · early access (scheduled)'] ],
    intel:{ variant:'op', observation:'Scheduled early-access drop for your best customers in Q3.',
      implication:'Rewards loyalty and drives launch-day revenue.', action:'launch at the start of Q3-Week5.', tag:{type:'priority',value:'HIGH'} } },
  { name:'Browse Re-Engagement', status:'Active', chan:'SMS · Email', seg:'Registered · Never Purchased',
    sent:'9,210', conv:'n/a', rev:'n/a', roi:'n/a', card:false,
    flow:[ ['trigger','Viewed product · no cart'], ['send','SMS · still thinking it over?'], ['wait','Wait 2 days'], ['send','Email · what others bought'] ],
    intel:{ variant:'op', observation:'Always-on nudge against high-intent browsers.',
      implication:'Feeds the same pool behind your first-order campaign.', action:'keep running, monitor for fatigue.', tag:{type:'priority',value:'MED'} } },
  { name:'Restock Alert · Home & Living', status:'Active', chan:'Email', seg:'SMS Opt-In · Recent', sent:'n/a', conv:'n/a', rev:'n/a', roi:'n/a', card:false,
    flow:[ ['trigger','Wishlisted · back in stock'], ['send','Email · it\u2019s back \u2014 limited stock'] ], intel:null },
  { name:'Replenishment · Consumables', status:'Active', chan:'Email', seg:'Repeat Buyers', sent:'n/a', conv:'n/a', rev:'n/a', roi:'n/a', card:false,
    flow:[ ['trigger','Reorder window reached'], ['send','Email · time to restock'] ], intel:null },
];

function renderCampaigns() {
  const statusCls = s => s==='Active' ? '' : s==='Scheduled' ? 'sched' : 'done';

  const cards = CAMPAIGNS.map((c,i) => c.card ? `
    <div class="camp-card ${c.feature?'feature':''}" data-camp="${i}">
      <div class="top">
        <div class="cname">${c.name}</div>
        <span class="roi-badge">${c.roi} ROI</span>
      </div>
      <div class="cmeta">
        <span class="status-dot ${statusCls(c.status)}">${c.status}</span>
        <span class="chan-badge">${c.chan}</span>
        <span class="tag">${c.seg}</span>
      </div>
      <div class="camp-stats">
        <div class="camp-stat"><div class="k">Sent</div><div class="v">${c.sent}</div></div>
        <div class="camp-stat"><div class="k">Conversions</div><div class="v lime">${c.conv}</div></div>
        <div class="camp-stat"><div class="k">Revenue</div><div class="v">${c.rev}</div></div>
        <div class="camp-stat"><div class="k">ROI</div><div class="v roi">${c.roi}</div></div>
      </div>
    </div>` : '').join('');

  const pipeline = CAMPAIGNS.map((c,i) => !c.card ? `
    <tr data-camp="${i}" style="cursor:pointer">
      <td><strong style="color:#fff">${c.name}</strong></td>
      <td><span class="status-dot ${statusCls(c.status)}">${c.status}</span></td>
      <td><span class="chan-badge">${c.chan}</span></td>
      <td>${c.seg}</td>
    </tr>` : '').join('');

  const summary = [
    { chip:'campaigns', label:'Active Campaigns', value:'8' },
    { chip:'users', label:'Total Reach', value:'185,090' },
    { chip:'money', label:'Attributed Revenue', value:'R4,790,000', tone:'lime' },
    { chip:'trend', label:'Blended ROI', value:'6.5x', tone:'mag' },
  ].map(m => `<div class="card">
      <div class="metric-chip ${m.tone==='lime'?'lime':m.tone==='mag'?'magenta':''}">${svg(m.chip)}</div>
      <div class="metric-label ${m.tone?'':'grey'}">${m.label}</div>
      <div class="metric-value">${m.value}</div>
    </div>`).join('');

  return `
  <div class="topbar dark">
    <div class="topbar-logo">we<span class="gas">GAS</span></div>
    <div class="search">${svg('search')}<input placeholder="search campaigns…"></div>
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
          <div><h1>Campaigns</h1><div class="sub">Northwind · orchestration &amp; performance</div></div>
        </div>
        <div class="work-actions">
          <a class="pill pill-magenta" style="padding:11px 22px;font-size:11px" data-open="camp-builder">${svg('zap')} New Campaign</a>
        </div>
      </div>

      <div class="grid cols-4" style="margin-top:26px">${summary}</div>

      <div class="section-label">Live &amp; Recent Campaigns <span style="color:var(--grey-2);font-weight:400;text-transform:none;letter-spacing:0">· click any campaign for the flow</span></div>
      <div class="camp-grid">${cards}</div>

      <div class="section-label">Pipeline</div>
      <div class="card" style="padding:8px 8px 4px">
        <div class="dtable-wrap"><table class="dtable">
          <thead><tr><th>Campaign Name</th><th>Status</th><th>Channel</th><th>Segment</th></tr></thead>
          <tbody>${pipeline}</tbody>
        </table></div>
      </div>
    </div>
  </div>`;
}
