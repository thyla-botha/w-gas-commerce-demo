/* ============================================================
   PAGE 3 — CUSTOMERS / AMS (dark surface) · Northwind e-commerce
   ============================================================ */
function renderAMS() {
  const c = DATA.contact;

  const zarCards = c.zar.map(([k,v]) => `
    <div class="zar-card"><div class="k">${k}</div><div class="v"><span class="cur">R</span>${v}</div></div>`).join('');

  const infoRows = c.info.map(([k,v,tone]) => `
    <div class="info-row"><span class="k">${k}</span><span class="v ${tone||''}">${v}</span></div>`).join('');

  const segPills = c.segments.map(s => `<span class="tag">${s}</span>`).join('');

  const feed = c.history.map(h => `
    <div class="feed-item">
      <div class="feed-icon ${h.icon}">${svg(h.icon==='dep'?'cart':h.icon==='seg'?'segments':h.icon==='wa'?'whatsapp':'mail')}</div>
      <div class="feed-body"><div class="t">${h.t}</div><div class="s">${h.s}</div></div>
      <div class="feed-body" style="flex:0 0 auto;text-align:right"><div class="time">${h.time}</div></div>
    </div>`).join('');

  const socialEvents = [
    { icon:'email', t:'Email opened: Repeat-Buyer Rewards', s:'Email · 2 opens · 1 product click', time:'Jun 4 · 18:44' },
    { icon:'seg', t:'Page view: /home-living/throws', s:'Frontend tracking · 1 session', time:'Jun 4 · 18:45' },
    { icon:'dep', t:'Visit from Johannesburg, ZA', s:'Session · Chrome on Android', time:'Jun 4 · 08:12' },
    { icon:'email', t:'Email opened: Abandoned Cart Recovery', s:'Email · 1 open · 1 click to cart', time:'Jun 1 · 16:20' },
    { icon:'seg', t:'Page view: /checkout', s:'Frontend tracking · abandoned', time:'May 31 · 21:03' },
  ];
  const socialFeed = socialEvents.map(h => `
    <div class="feed-item">
      <div class="feed-icon ${h.icon}">${svg(h.icon==='dep'?'globe':h.icon==='seg'?'link':'mail')}</div>
      <div class="feed-body"><div class="t">${h.t}</div><div class="s">${h.s}</div></div>
      <div class="feed-body" style="flex:0 0 auto;text-align:right"><div class="time">${h.time}</div></div>
    </div>`).join('');

  const orderRows = [
    ['NW-88241','Jun 5 2026','3','R1,240','Fulfilled'],
    ['NW-88102','May 28 2026','1','R320','Refunded'],
    ['NW-87640','Apr 19 2026','2','R880','Fulfilled'],
    ['NW-86915','Mar 02 2026','4','R2,110','Fulfilled'],
    ['NW-86120','Jan 14 2026','1','R460','Fulfilled'],
  ].map(r => `<tr><td><strong style="color:#fff">${r[0]}</strong></td><td>${r[1]}</td><td>${r[2]}</td><td>R${r[3].replace('R','')}</td><td><span class="status-dot ${r[4]==='Refunded'?'done':''}">${r[4]}</span></td></tr>`).join('');

  const subtabs = ['Customer Information','Orders','Activity','Devices']
    .map((t,i) => `<button class="subtab ${i===0?'active':''}" data-subtab="${i}">${t}</button>`).join('');

  return `
  <div class="topbar dark">
    <div class="topbar-logo">we<span class="gas">GAS</span></div>
    <div class="search">${svg('search')}<input placeholder="search customers…"></div>
    <div class="topbar-spacer"></div>
    <div class="topbar-actions">
      <button class="icon-btn">${svg('bell')}<span class="dot"></span></button>
      <div class="user-chip"><div class="avatar">TW</div><span class="uname">Thyla Wgas</span></div>
    </div>
  </div>
  <div class="viewport surface-dark">
    <div class="dash">
      <div class="contact-header">
        <div class="contact-avatar">${c.initials}</div>
        <div class="contact-id">
          <h1>${c.name}</h1>
          <div class="meta">
            <span>Customer ID · NW-88241600</span>
            <span class="verified">${svg('check')} VIP</span>
            <span>Country · ZA</span>
            <span>Customer since 2024-05-20</span>
          </div>
        </div>
      </div>

      <div class="ams-layout">
        <div>
          <div class="zar-cards">${zarCards}</div>

          <div class="subtabs">${subtabs}</div>

          <!-- subtab 0 -->
          <div class="subtab-pane" data-pane="0">
            <div class="card lg">
              <div class="card-head"><span class="card-title">Customer Information</span><span class="card-note">profile · preferences · consent</span></div>
              <div class="info-grid">${infoRows}</div>
            </div>

            <div class="section-label">Segment Tags</div>
            <div class="card lg"><div class="seg-cloud" style="display:flex;flex-wrap:wrap;gap:10px">${segPills}</div></div>

            <div class="section-label">Engagements</div>
            <div class="card lg">
              <div class="card-head"><span class="card-title">Engagement Score</span><span class="card-note">rising to ~180 · Apr-Jun 2026</span></div>
              <div class="chart-box" style="height:240px"><canvas id="amsEngage"></canvas></div>
            </div>

            <div class="section-label">History</div>
            <div class="card lg"><div class="feed">${feed}</div></div>
          </div>

          <!-- subtab 1: Orders -->
          <div class="subtab-pane" data-pane="1" style="display:none">
            <div class="card lg">
              <div class="card-head"><span class="card-title">Order Summary</span><span class="card-note">lifetime · ZAR</span></div>
              <div class="info-grid">
                <div class="info-row"><span class="k">First Order</span><span class="v">2024-06-02</span></div>
                <div class="info-row"><span class="k">Customer Status</span><span class="v"><span class="badge-pill yes">${svg('check')} VIP</span></span></div>
                <div class="info-row"><span class="k">Total Orders</span><span class="v">14</span></div>
                <div class="info-row"><span class="k">Avg Order Value</span><span class="v">R1,316</span></div>
                <div class="info-row"><span class="k">Refund Rate</span><span class="v lime">3.2% · low</span></div>
                <div class="info-row"><span class="k">Preferred Category</span><span class="v">Home &amp; Living</span></div>
                <div class="info-row"><span class="k">Loyalty Tier</span><span class="v lime">Gold</span></div>
                <div class="info-row"><span class="k">Last Order</span><span class="v">2026-06-05</span></div>
              </div>
            </div>
            <div class="section-label">Order History</div>
            <div class="card" style="padding:8px 8px 4px">
              <div class="dtable-wrap"><table class="dtable">
                <thead><tr><th>Order</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
                <tbody>${orderRows}</tbody>
              </table></div>
            </div>
            ${intelBox({ variant:'op', observation:'Steady high-value orders with a low 3.2% refund rate — a model VIP.',
              implication:'Customers like this respond to access and recognition, not discounts.',
              action:'enrol in VIP early-access and offer a loyalty-tier upgrade preview.',
              tag:{ type:'priority', value:'HIGH' } })}
          </div>

          <!-- subtab 2: Activity -->
          <div class="subtab-pane" data-pane="2" style="display:none">
            <div class="section-label" style="margin-top:0">Engagement Over Time</div>
            <div class="card lg">
              <div class="card-head"><span class="card-title">Engagement Score</span><span class="card-note">peaked Feb · dipped · recovering</span></div>
              <div class="chart-box" style="height:240px"><canvas id="amsSocial"></canvas></div>
              ${intelLine('<b>Engagement peaked in February, dipped through autumn, and is recovering.</b> The rewards track is working — keep the WhatsApp touchpoints going.')}
            </div>
            <div class="section-label">Activity</div>
            <div class="card lg"><div class="feed">${socialFeed}</div></div>
          </div>

          <!-- subtab 3: Devices -->
          <div class="subtab-pane" data-pane="3" style="display:none">
            <div class="card" style="padding:8px 8px 4px">
              <div class="dtable-wrap"><table class="dtable">
                <thead><tr><th>Type</th><th>OS</th><th>OS Version</th><th>Browser</th><th>Brand</th><th>Date Added</th></tr></thead>
                <tbody>
                  <tr><td>Smartphone</td><td>Android</td><td>14</td><td>Chrome Mobile</td><td>Samsung</td><td>2 days ago</td></tr>
                  <tr><td>Desktop</td><td>macOS</td><td>n/a</td><td>Safari</td><td>n/a</td><td>3 weeks ago</td></tr>
                </tbody>
              </table></div>
            </div>
            ${intelLine('<b>Mobile-first shopper.</b> Prioritise SMS and WhatsApp over desktop email for anything time-sensitive.')}
          </div>
        </div>

        <!-- right rail -->
        <div class="rail">
          <div class="rail-card points-card">
            <div class="pts">1,240</div>
            <div class="lbl">Loyalty Points</div>
          </div>
          <div class="rail-card">
            <h4>Contact</h4>
            <div class="contact-line">${svg('mail')} naledi.k@example.com</div>
            <div class="contact-line">${svg('phone')} +27 82 ••• 4471</div>
            <div class="contact-line">${svg('pin')} Johannesburg, ZA</div>
          </div>
          <div class="rail-card">
            <h4>Upcoming Events</h4>
            <div class="event-item">
              <span class="dt">Q3 · W5</span>
              <span class="ev">VIP early-access drop will trigger a WhatsApp invite + email follow-up if no order in 7 days.</span>
            </div>
            <div class="event-item">
              <span class="dt">JUL 02</span>
              <span class="ev">Replenishment window opens — eligible for a loyalty-tier reward.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}
