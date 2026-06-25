/* ============================================================
   weGAS — detail views + semi-functional builders
   (segment detail, segment builder, campaign detail, campaign builder)
   ============================================================ */

/* ---------- shared format ---------- */
function fmtVal(n) {
  if (n >= 1e6) return 'R' + (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return 'R' + Math.round(n / 1e3) + 'k';
  return 'R' + Math.round(n);
}

/* ============================================================
   SEGMENT DETAIL
   ============================================================ */
function openSegmentDetail(i) {
  const s = SEGMENT_ROWS[i];
  const share = ((s.count / 712480) * 100).toFixed(1);
  const tag = (s.est && s.est[0] === 'R') ? { type:'impact', value:s.est }
            : (s.variant === 'alert' ? { type:'priority', value:'HIGH' } : null);
  const html = `
    <div class="modal-eyebrow">Segment</div>
    <h2>${s.name}</h2>
    ${s.subtitle ? `<div class="sub">${s.subtitle}</div>` : ''}
    <div class="modal-meta">
      <span class="tier-pill ${s.tone}">${s.tier}</span>
      <span class="chan-badge">${s.chan}</span>
    </div>
    <div class="detail-stats">
      <div class="detail-stat"><div class="k">Contacts</div><div class="v">${fmt(s.count)}</div></div>
      <div class="detail-stat"><div class="k">% of base</div><div class="v">${share}%</div></div>
      <div class="detail-stat"><div class="k">RFM Tier</div><div class="v" style="font-size:18px">${s.tier}</div></div>
      <div class="detail-stat"><div class="k">Est. Value</div><div class="v lime" style="font-size:17px">${s.est}</div></div>
    </div>
    <div class="detail-block-label">Description</div>
    <p style="font-family:var(--mono);font-size:13px;line-height:1.65;color:#cfcfcf">${s.desc}</p>
    <div class="detail-block-label">Recommended Channels</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">${s.channels.map(ch => `<span class="tag">${ch}</span>`).join('')}</div>
    ${intelBox({ variant:s.variant, observation:s.why, action:s.play, tag })}
    <div class="builder-actions">
      <button class="pill pill-ghost-dark" data-close-modal style="padding:11px 22px;font-size:11px">Close</button>
      <button class="pill pill-teal" data-open="seg-builder" style="padding:11px 22px;font-size:11px">${svg('target')} Refine in builder</button>
    </div>`;
  openModal(html);
}

/* ============================================================
   SEGMENT BUILDER — live count from sample population
   ============================================================ */
let _segPop = null;
function segPopulation() {
  if (_segPop) return _segPop;
  const countries = [['South Africa',0.58],['Mozambique',0.12],['Botswana',0.06],['Namibia',0.04],
    ['Zimbabwe',0.03],['Zambia',0.02],['Lesotho',0.015],['Nigeria',0.014],['Kenya',0.011],['Other',0.11]];
  const pick = () => { let r = Math.random(), a = 0; for (const [c,w] of countries) { a += w; if (r <= a) return c; } return 'Other'; };
  const chans = ['Email','SMS','WhatsApp'];
  const N = 4000;
  const pop = [];
  for (let k = 0; k < N; k++) {
    const verified = Math.random() < 0.62;
    const ftd = verified && Math.random() < 0.66;        // deposited
    // skewed ZAR: most small, few large
    let zar = 0;
    if (ftd) { const r = Math.random(); zar = r < 0.7 ? Math.round(200 + Math.random()*2500) : r < 0.93 ? Math.round(2500 + Math.random()*12000) : Math.round(15000 + Math.random()*90000); }
    const activeDays = Math.round(Math.pow(Math.random(), 1.7) * 365);
    const ch = chans.filter(() => Math.random() < 0.7); if (ch.length === 0) ch.push('Email');
    pop.push({ id: 88000000 + Math.floor(Math.random()*1999999), zar, activeDays, verified, ftd, country: pick(), channels: ch });
  }
  _segPop = pop;
  return pop;
}

/* derive an RFM tier from a sample contact */
function tierOf(ct) {
  if (!ct.ftd) return ct.activeDays > 120 ? 'Dormant' : 'Potential';
  if (ct.zar >= 15000 && ct.activeDays <= 60) return 'Champions';
  if (ct.zar >= 4000 && ct.activeDays <= 120) return 'Loyal';
  if (ct.activeDays > 180) return 'Dormant';
  if (ct.activeDays > 120) return 'At-Risk';
  return 'Potential';
}

function segNumCmp(val, op, raw) {
  if (raw === '') return true;
  if (op === 'between') { const [a,b] = raw.split('-').map(x => parseFloat(x.replace(/[^\d.]/g,''))); if (isNaN(a)||isNaN(b)) return true; return val >= a && val <= b; }
  const n = parseFloat(raw.replace(/[^\d.]/g,'')); if (isNaN(n)) return true;
  if (op === '>') return val > n;
  if (op === '<') return val < n;
  return val === n;
}
function segBoolCmp(val, op, raw) {
  if (raw === '') return true;
  const want = /^(y|yes|true|1|deposited)/.test(raw);
  return (op === 'is not') ? (val !== want) : (val === want);
}
function segStrCmp(val, op, raw) {
  if (raw === '') return true;
  const hit = val.includes(raw);
  return (op === 'is not') ? !hit : hit;
}

function segEvalFilter(ct, f) {
  const raw = (f.value || '').trim().toLowerCase();
  switch (f.field) {
    case 'zar': return segNumCmp(ct.zar, f.op, raw);
    case 'active': return segNumCmp(ct.activeDays, f.op, raw);
    case 'verified': return segBoolCmp(ct.verified, f.op, raw);
    case 'ftd': return segBoolCmp(ct.ftd, f.op, raw);
    case 'country': return segStrCmp(ct.country.toLowerCase(), f.op, raw);
    case 'channel': { if (raw === '') return true; const has = ct.channels.some(c => c.toLowerCase().includes(raw)); return (f.op === 'is not') ? !has : has; }
    default: return true;
  }
}

/* field metadata drives adaptive operator + value controls */
const SEG_COUNTRIES = ['South Africa','Mozambique','Botswana','Namibia','Zimbabwe','Zambia','Lesotho','Nigeria','Kenya'];
const SEG_FIELDDEFS = {
  zar:      { label:'Total ZAR',          kind:'num',  ops:['>','<','between'] },
  active:   { label:'Last Active (days)', kind:'num',  ops:['<','>','between'] },
  verified: { label:'Verified',           kind:'enum', ops:['is','is not'], values:['Yes','No'] },
  ftd:      { label:'Order Status',        kind:'enum', ops:['is','is not'], values:['Purchased','Not purchased'] },
  tier:     { label:'RFM Tier',           kind:'enum', ops:['is','is not'], values:['Champions','Loyal','Potential','At-Risk','Dormant'] },
  country:  { label:'Country',            kind:'enum', ops:['is','is not'], values:SEG_COUNTRIES },
  channel:  { label:'Channel Reachable',  kind:'enum', ops:['includes','excludes'], values:['Email','SMS','WhatsApp'] },
};
const SEG_FIELD_ORDER = ['zar','active','verified','ftd','tier','country','channel'];

function segDefaultFilter(field='zar') {
  const d = SEG_FIELDDEFS[field];
  return { field, op:d.ops[0], value: d.kind==='enum' ? d.values[0] : '', min:'', max:'' };
}

function segEvalFilter(ct, f) {
  const d = SEG_FIELDDEFS[f.field];
  if (d.kind === 'num') {
    const v = f.field === 'zar' ? ct.zar : ct.activeDays;
    if (f.op === 'between') { const a = parseFloat(f.min), b = parseFloat(f.max); if (isNaN(a) || isNaN(b)) return true; return v >= a && v <= b; }
    const n = parseFloat(f.value); if (isNaN(n)) return true;
    return f.op === '>' ? v > n : v < n;
  }
  if (f.field === 'verified') { const want = f.value === 'Yes'; return f.op === 'is' ? ct.verified === want : ct.verified !== want; }
  if (f.field === 'ftd') { const want = f.value === 'Purchased'; return f.op === 'is' ? ct.ftd === want : ct.ftd !== want; }
  if (f.field === 'tier') { const hit = tierOf(ct) === f.value; return f.op === 'is' ? hit : !hit; }
  if (f.field === 'country') { const hit = ct.country === f.value; return f.op === 'is' ? hit : !hit; }
  if (f.field === 'channel') { const hit = ct.channels.includes(f.value); return f.op === 'includes' ? hit : !hit; }
  return true;
}

const SEG_RECIPES = [
  { label:'High-value dormant', filters:[{field:'zar',op:'>',value:'5000',min:'',max:''},{field:'active',op:'>',value:'90',min:'',max:''}] },
  { label:'Registered, never ordered', filters:[{field:'verified',op:'is',value:'Yes',min:'',max:''},{field:'ftd',op:'is',value:'Not purchased',min:'',max:''}] },
  { label:'Recent SMS-reachable', filters:[{field:'active',op:'<',value:'30',min:'',max:''},{field:'channel',op:'includes',value:'SMS',min:'',max:''}] },
  { label:'VIP Champions', filters:[{field:'tier',op:'is',value:'Champions',min:'',max:''}] },
  { label:'Mid-tier nurture', filters:[{field:'zar',op:'between',value:'',min:'2000',max:'8000'}] },
];

function segValueControl(f) {
  const d = SEG_FIELDDEFS[f.field];
  if (d.kind === 'enum') {
    return `<select class="builder-select bf-val">${d.values.map(v => `<option ${f.value===v?'selected':''}>${v}</option>`).join('')}</select>`;
  }
  if (f.op === 'between') {
    return `<div style="display:flex;gap:6px"><input class="builder-input bf-min" placeholder="min" value="${f.min||''}" style="width:50%"><input class="builder-input bf-max" placeholder="max" value="${f.max||''}" style="width:50%"></div>`;
  }
  return `<input class="builder-input bf-val" placeholder="value" value="${f.value||''}">`;
}

function segAdvRow(f, idx) {
  const d = SEG_FIELDDEFS[f.field];
  return `<div class="adv-row" data-idx="${idx}">
    <select class="builder-select bf-field">${SEG_FIELD_ORDER.map(k => `<option value="${k}" ${f.field===k?'selected':''}>${SEG_FIELDDEFS[k].label}</option>`).join('')}</select>
    <select class="builder-select bf-op">${d.ops.map(o => `<option ${f.op===o?'selected':''}>${o}</option>`).join('')}</select>
    <div class="bf-valwrap">${segValueControl(f)}</div>
    <button class="builder-del" title="remove">${svg('trash')}</button>
  </div>`;
}

function openSegmentBuilder() {
  const state = { matchAll: true, filters: [ segDefaultFilter('zar') ] };
  state.filters[0].value = '5000';

  const html = `
    <div class="modal-eyebrow">Segment Builder</div>
    <h2>New Segment</h2>
    <div class="sub">Build an audience from live attributes. Everything recomputes against a working sample of the base.</div>

    <div class="detail-block-label">Quick start</div>
    <div class="recipe-row">${SEG_RECIPES.map((r,i) => `<button class="recipe" data-recipe="${i}">${r.label}</button>`).join('')}</div>

    <div class="bx2">
      <div class="bx2-main">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:14px">
          <div class="detail-block-label" style="margin:0">Filters</div>
          <div class="seg-ctl" id="segMatch">
            <button data-match="all" class="on">Match all</button>
            <button data-match="any">Match any</button>
          </div>
        </div>
        <div id="segFilters"></div>
        <button class="builder-add" id="segAddFilter">${svg('plus')} Add filter</button>

        <div class="detail-block-label">Sample matches</div>
        <div class="card" style="padding:6px 8px 2px">
          <div class="dtable-wrap"><table class="preview-table">
            <thead><tr><th>Customer ID</th><th>Country</th><th>Total Spend</th><th>Last active</th><th>Verified</th><th>Ordered</th></tr></thead>
            <tbody id="segPreview"></tbody>
          </table></div>
        </div>
      </div>

      <div class="bx2-results">
        <div class="res-count" id="segCount">0</div>
        <div class="res-sub"><span id="segPctBase">0%</span> of base · matching customers</div>
        <div class="res-value" id="segValue">R0 / mo</div>
        <div class="res-value-k">estimated value</div>
        <div class="res-divider"></div>
        <div class="res-label">RFM mix</div>
        <div id="segDist"></div>
        <div class="res-divider"></div>
        <div class="res-label">Reachability</div>
        <div class="reach-pills" id="segReach"></div>
      </div>
    </div>

    <div id="segIntel"></div>
    <div class="builder-actions">
      <button class="pill pill-ghost-dark" data-close-modal style="padding:11px 22px;font-size:11px">Cancel</button>
      <button class="pill pill-teal" id="segSave" style="padding:11px 22px;font-size:11px">${svg('check')} Save Segment</button>
    </div>`;

  const TIERS = ['Champions','Loyal','Potential','At-Risk','Dormant'];
  const TIER_COLORS = { Champions:'var(--lime)', Loyal:'var(--teal)', Potential:'#9aa0ff', 'At-Risk':'#F5B73D', Dormant:'var(--red)' };

  openModal(html, { wide:true, onOpen: ov => {
    const filtersEl = ov.querySelector('#segFilters');
    const renderFilters = () => {
      filtersEl.innerHTML = state.filters.map((f,i) =>
        (i > 0 ? `<div class="joiner">${state.matchAll ? 'AND' : 'OR'}</div>` : '') + segAdvRow(f, i)
      ).join('');
    };

    const recompute = () => {
      const pop = segPopulation();
      const test = ct => state.matchAll ? state.filters.every(f => segEvalFilter(ct, f)) : state.filters.some(f => segEvalFilter(ct, f));
      const matched = pop.filter(test);
      const scale = 712480 / pop.length;
      const count = Math.round(matched.length * scale);
      const value = matched.reduce((a, c) => a + c.zar * 0.01, 0) * scale;
      ov.querySelector('#segCount').textContent = fmt(count);
      ov.querySelector('#segPctBase').textContent = ((count / 712480) * 100).toFixed(1) + '%';
      ov.querySelector('#segValue').textContent = fmtVal(value) + ' / mo';

      // RFM distribution
      const dist = {}; TIERS.forEach(t => dist[t] = 0);
      matched.forEach(c => dist[tierOf(c)]++);
      const dmax = Math.max(1, ...TIERS.map(t => dist[t]));
      ov.querySelector('#segDist').innerHTML = TIERS.map(t => {
        const p = matched.length ? Math.round((dist[t] / matched.length) * 100) : 0;
        return `<div class="dist-row"><span class="dl">${t}</span><div class="dist-track"><div class="dist-fill" style="width:${(dist[t]/dmax)*100}%;background:${TIER_COLORS[t]}"></div></div><span class="dv">${p}%</span></div>`;
      }).join('');

      // reachability
      const reach = { Email:0, SMS:0, WhatsApp:0 };
      matched.forEach(c => c.channels.forEach(ch => reach[ch]++));
      ov.querySelector('#segReach').innerHTML = ['Email','SMS','WhatsApp'].map(ch => {
        const p = matched.length ? Math.round((reach[ch] / matched.length) * 100) : 0;
        return `<div class="reach-pill"><span>${ch}</span><span class="rv">${p}%</span></div>`;
      }).join('');

      // preview
      const sample = matched.slice(0, 6);
      ov.querySelector('#segPreview').innerHTML = sample.length ? sample.map(c =>
        `<tr><td>${c.id}</td><td>${c.country}</td><td>R${fmt(c.zar)}</td><td>${c.activeDays}d ago</td><td class="${c.verified?'yes':'no'}">${c.verified?'Yes':'No'}</td><td class="${c.ftd?'yes':'no'}">${c.ftd?'Yes':'No'}</td></tr>`
      ).join('') : `<tr><td colspan="6" style="text-align:center;color:var(--grey-2);padding:18px">No contacts match these filters</td></tr>`;

      const rec = value > 3e6 ? 'SMS + WhatsApp for the high-value moments' : count > 50000 ? 'Email for reach, SMS for the warm sub-set' : 'SMS + Email';
      ov.querySelector('#segIntel').innerHTML = intelBox({ variant:'op', compact:true,
        observation:`This segment matches ${fmt(count)} customers worth about ${fmtVal(value)} per month.`,
        action:`${rec}.` });
    };

    const refresh = () => { renderFilters(); recompute(); };

    // match logic toggle
    ov.querySelector('#segMatch').addEventListener('click', e => {
      const b = e.target.closest('[data-match]'); if (!b) return;
      state.matchAll = b.dataset.match === 'all';
      ov.querySelectorAll('#segMatch button').forEach(x => x.classList.toggle('on', x === b));
      refresh();
    });
    // value typing (no re-render, keep focus)
    ov.addEventListener('input', e => {
      const row = e.target.closest('.adv-row'); if (!row) return;
      const i = +row.dataset.idx;
      if (e.target.classList.contains('bf-val')) state.filters[i].value = e.target.value;
      else if (e.target.classList.contains('bf-min')) state.filters[i].min = e.target.value;
      else if (e.target.classList.contains('bf-max')) state.filters[i].max = e.target.value;
      recompute();
    });
    // field / op changes (re-render row controls)
    ov.addEventListener('change', e => {
      const row = e.target.closest('.adv-row'); if (!row) return;
      const i = +row.dataset.idx;
      if (e.target.classList.contains('bf-field')) state.filters[i] = segDefaultFilter(e.target.value);
      else if (e.target.classList.contains('bf-op')) state.filters[i].op = e.target.value;
      else if (e.target.classList.contains('bf-val')) state.filters[i].value = e.target.value;
      refresh();
    });
    ov.querySelector('#segAddFilter').addEventListener('click', () => { state.filters.push(segDefaultFilter('tier')); refresh(); });
    ov.addEventListener('click', e => {
      if (e.target.closest('.builder-del')) {
        const i = +e.target.closest('.adv-row').dataset.idx;
        if (state.filters.length > 1) { state.filters.splice(i, 1); refresh(); }
        return;
      }
      const rc = e.target.closest('[data-recipe]');
      if (rc) { state.filters = JSON.parse(JSON.stringify(SEG_RECIPES[+rc.dataset.recipe].filters)); refresh(); return; }
      if (e.target.closest('#segSave')) {
        const c = ov.querySelector('#segCount').textContent;
        ov.querySelector('.modal').innerHTML = builderSuccess('Segment saved', `${c} customers now sit in your new segment. It syncs to Campaigns and the customer graph, and weGAS Intelligence will track it for drift.`);
        wireSuccess(ov);
      }
    });
    refresh();
  }});
}

/* ============================================================
   CAMPAIGN DETAIL — flow nodes
   ============================================================ */
function flowNodes(flow) {
  const meta = { trigger:['Trigger','trigger','zap'], send:['Send','send','send'], wait:['Delay','wait','clock'], cond:['Condition','cond','branch'] };
  return flow.map((step, idx) => {
    const [type, label] = step;
    const [t, cls, icon] = meta[type] || meta.send;
    return `<div class="flow-node ${cls}">
        <div class="fn-ic">${svg(icon)}</div>
        <div class="fn-body"><div class="ft">${t}</div><div class="fl">${label}</div></div>
      </div>${idx < flow.length - 1 ? '<div class="flow-connector"></div>' : ''}`;
  }).join('');
}

function openCampaignDetail(i) {
  const c = CAMPAIGNS[i];
  const statusCls = c.status === 'Active' ? '' : c.status === 'Scheduled' ? 'sched' : 'done';
  const hasMetrics = c.sent && c.sent !== '—' && c.sent !== 'n/a';
  const stats = hasMetrics ? `
    <div class="detail-stats">
      <div class="detail-stat"><div class="k">Sent</div><div class="v">${c.sent}</div></div>
      <div class="detail-stat"><div class="k">Conversions</div><div class="v lime">${c.conv}</div></div>
      <div class="detail-stat"><div class="k">Revenue</div><div class="v">${c.rev}</div></div>
      <div class="detail-stat"><div class="k">ROI</div><div class="v mag">${c.roi}</div></div>
    </div>` : '';
  const html = `
    <div class="modal-eyebrow">Campaign</div>
    <h2>${c.name}</h2>
    <div class="modal-meta">
      <span class="status-dot ${statusCls}">${c.status}</span>
      <span class="chan-badge">${c.chan}</span>
      <span class="tag">${c.seg}</span>
    </div>
    ${stats}
    <div class="detail-block-label">Automation Flow</div>
    <div class="flow">${flowNodes(c.flow)}</div>
    ${c.intel ? intelBox(c.intel) : ''}
    <div class="builder-actions">
      <button class="pill pill-ghost-dark" data-close-modal style="padding:11px 22px;font-size:11px">Close</button>
      <button class="pill pill-magenta" data-open="camp-builder" style="padding:11px 22px;font-size:11px">${svg('zap')} Clone &amp; edit</button>
    </div>`;
  openModal(html);
}

/* ============================================================
   CAMPAIGN BUILDER v2 — drag-to-build visual flow canvas
   ============================================================ */
const CAMP_PALETTE = [
  { type:'send', label:'Send message', icon:'send' },
  { type:'wait', label:'Wait / delay', icon:'clock' },
  { type:'cond', label:'If / condition', icon:'branch' },
  { type:'goal', label:'Goal', icon:'target' },
];
const CAMP_RULES = ['opened','clicked','purchased','not opened'];
const CAMP_GOALS = ['First order','Repeat order','Account created'];
const CHAN_COST = { Email:0.15, SMS:0.45, WhatsApp:0.65 };
const STACK_RATE = { 'Email':0.094, 'SMS':0.12, 'WhatsApp':0.13, 'Email+SMS':0.148, 'Email+WhatsApp':0.16, 'SMS+WhatsApp':0.17, 'Email+SMS+WhatsApp':0.196 };

function campDefaultNode(type) {
  if (type === 'send') return { type, channel:'Email', msg:'message body' };
  if (type === 'wait') return { type, days:2 };
  if (type === 'cond') return { type, rule:'opened' };
  return { type:'goal', goal:'First order' };
}

let _cbDrag = null;

function openCampaignBuilder() {
  const state = { segIdx: 5, steps: [ campDefaultNode('send') ] };
  const segOptions = SEGMENT_ROWS.map((s,i) => `<option value="${i}">${s.name} · ${fmt(s.count)}</option>`).join('');

  const nodeHtml = (st, idx) => {
    const meta = { send:['Send','send','send'], wait:['Delay','wait','clock'], cond:['Condition','cond','branch'], goal:['Goal','goal','target'] }[st.type];
    let controls = '';
    if (st.type === 'send') {
      controls = `<select class="builder-select cn-ch">${['Email','SMS','WhatsApp'].map(c => `<option ${st.channel===c?'selected':''}>${c}</option>`).join('')}</select>
        <input class="builder-input cn-msg" value="${(st.msg||'').replace(/"/g,'&quot;')}" placeholder="message">`;
    } else if (st.type === 'wait') {
      controls = `<span style="font-family:var(--mono);font-size:12px;color:var(--grey);align-self:center">Wait</span>
        <input class="builder-input cn-days" type="number" min="0" value="${st.days}" style="width:70px">
        <span style="font-family:var(--mono);font-size:12px;color:var(--grey);align-self:center">days</span>`;
    } else if (st.type === 'cond') {
      controls = `<span style="font-family:var(--mono);font-size:12px;color:var(--grey);align-self:center">If</span>
        <select class="builder-select cn-rule">${CAMP_RULES.map(r => `<option ${st.rule===r?'selected':''}>${r}</option>`).join('')}</select>`;
    } else {
      controls = `<select class="builder-select cn-goal">${CAMP_GOALS.map(g => `<option ${st.goal===g?'selected':''}>${g}</option>`).join('')}</select>`;
    }
    const branch = st.type === 'cond' ? `<div class="cond-branch"><span class="cond-chip yes">Yes → continue</span><span class="cond-chip no">No → exit</span></div>` : '';
    return `<div class="cnode ${meta[1]}" data-idx="${idx}">
        <div class="cnode-grip" draggable="true">⋮⋮</div>
        <div class="cnode-main">
          <div class="cnode-top"><div class="cnode-ic">${svg(meta[2])}</div><div class="cnode-type">${meta[0]}</div></div>
          <div class="cnode-controls">${controls}</div>
          ${branch}
        </div>
        <button class="cnode-del" data-delstep="${idx}" title="remove">${svg('trash')}</button>
      </div>`;
  };

  const channelsUsed = () => {
    const set = [...new Set(state.steps.filter(s => s.type === 'send').map(s => s.channel))];
    return set.length ? set : ['Email'];
  };

  const html = `
    <div class="modal-eyebrow">Campaign Builder</div>
    <h2>New Campaign</h2>
    <div class="sub">Drag blocks onto the canvas to build the journey. Reorder by dragging, edit inline. Projections update live.</div>

    <div class="detail-block-label">Audience Segment</div>
    <select class="builder-select" id="campSeg" style="max-width:380px">${segOptions}</select>

    <div class="detail-block-label">Flow</div>
    <div class="cb">
      <div class="cb-palette">
        <div class="pt">Drag a block</div>
        ${CAMP_PALETTE.map(b => `<div class="palette-block ${b.type}" draggable="true" data-block="${b.type}"><div class="pb-ic">${svg(b.icon)}</div>${b.label}</div>`).join('')}
      </div>
      <div class="cb-canvas" id="campCanvas"></div>
    </div>

    <div class="cb-stats" id="campStats"></div>

    <div class="builder-actions">
      <button class="pill pill-ghost-dark" data-close-modal style="padding:11px 22px;font-size:11px">Cancel</button>
      <button class="pill pill-magenta" id="campLaunch" style="padding:11px 22px;font-size:11px">${svg('send')} Launch Campaign</button>
    </div>`;

  openModal(html, { wide:true, onOpen: ov => {
    const canvas = ov.querySelector('#campCanvas');

    const renderCanvas = () => {
      const seg = SEGMENT_ROWS[state.segIdx];
      const trigger = `<div class="cnode trigger fixed">
          <div class="cnode-grip" style="cursor:default;color:var(--lime)">${svg('zap')}</div>
          <div class="cnode-main"><div class="cnode-type">Trigger · entry</div>
            <div class="cnode-fixed-label">${seg.name}<small>${fmt(seg.count)} customers enter this journey</small></div></div>
        </div>`;
    const nodes = state.steps.map((st,i) => `<div class="cb-conn"></div>` + nodeHtml(st,i)).join('');
      canvas.innerHTML = trigger + (state.steps.length ? nodes : '<div class="cb-conn"></div><div class="cb-empty">Drag a block here to add your first step</div>');
    };

    const recompute = () => {
      const seg = SEGMENT_ROWS[state.segIdx];
      const reach = seg.count;
      const ch = channelsUsed();
      const key = ['Email','SMS','WhatsApp'].filter(c => ch.includes(c)).join('+');
      // conversion + ROI bands calibrated to the real campaigns in this app (~2-3.5% conv, R1,100/conv, 4-12x ROI)
      const CONV = { 'Email':0.022, 'SMS':0.026, 'WhatsApp':0.030, 'Email+SMS':0.030, 'Email+WhatsApp':0.032, 'SMS+WhatsApp':0.034, 'Email+SMS+WhatsApp':0.038 };
      const ROIB = { 'Email':4.0, 'SMS':5.5, 'WhatsApp':8.0, 'Email+SMS':6.0, 'Email+WhatsApp':7.5, 'SMS+WhatsApp':9.0, 'Email+SMS+WhatsApp':8.5 };
      const sends = state.steps.filter(s => s.type === 'send').length || 1;
      const conds = state.steps.filter(s => s.type === 'cond').length;
      const convRate = CONV[key] || 0.022;
      const bonus = Math.min(1.35, 1 + 0.05 * Math.max(0, sends - 1) + 0.05 * conds);
      const conv = Math.round(reach * convRate * bonus);
      const rev = conv * 1100;
      const roi = Math.min(12, (ROIB[key] || 4.0) * (1 + 0.05 * conds + 0.03 * Math.max(0, sends - 1)));
      ov.querySelector('#campStats').innerHTML = `
        <div class="cb-stat"><div class="k">Estimated Reach</div><div class="v">${fmt(reach)}</div></div>
        <div class="cb-stat"><div class="k">Projected Conversions</div><div class="v lime">${fmt(conv)}</div></div>
        <div class="cb-stat"><div class="k">Projected Revenue</div><div class="v">${fmtVal(rev)}</div></div>
        <div class="cb-stat"><div class="k">Est. ROI</div><div class="v mag">${roi.toFixed(1)}x</div></div>`;
    };

    const refresh = () => { renderCanvas(); recompute(); };

    ov.querySelector('#campSeg').addEventListener('change', e => { state.segIdx = +e.target.value; refresh(); });

    // inline edits (no re-render, keep focus)
    canvas.addEventListener('input', e => {
      const node = e.target.closest('.cnode[data-idx]'); if (!node) return;
      const s = state.steps[+node.dataset.idx];
      if (e.target.classList.contains('cn-msg')) s.msg = e.target.value;
      else if (e.target.classList.contains('cn-days')) s.days = +e.target.value || 0;
      recompute();
    });
    canvas.addEventListener('change', e => {
      const node = e.target.closest('.cnode[data-idx]'); if (!node) return;
      const s = state.steps[+node.dataset.idx];
      if (e.target.classList.contains('cn-ch')) s.channel = e.target.value;
      else if (e.target.classList.contains('cn-rule')) s.rule = e.target.value;
      else if (e.target.classList.contains('cn-goal')) s.goal = e.target.value;
      recompute();
    });
    // delete
    canvas.addEventListener('click', e => {
      const del = e.target.closest('[data-delstep]');
      if (del) { state.steps.splice(+del.dataset.delstep, 1); refresh(); }
    });

    // drag: palette blocks
    ov.querySelectorAll('.palette-block').forEach(b => {
      b.addEventListener('dragstart', () => { _cbDrag = { kind:'block', type:b.dataset.block }; });
      // click-to-add fallback
      b.addEventListener('click', () => { state.steps.push(campDefaultNode(b.dataset.block)); refresh(); });
    });
    // drag: nodes (reorder) — only from the grip handle so inputs stay editable
    canvas.addEventListener('dragstart', e => {
      const grip = e.target.closest('.cnode-grip[draggable]'); if (!grip) return;
      const node = grip.closest('.cnode[data-idx]'); if (!node) return;
      _cbDrag = { kind:'node', idx:+node.dataset.idx };
      node.classList.add('dragging');
      try { e.dataTransfer.setDragImage(node, 24, 24); } catch (_) {}
    });
    canvas.addEventListener('dragend', e => {
      const node = e.target.closest('.cnode'); if (node) node.classList.remove('dragging');
      canvas.classList.remove('drag-over');
    });
    canvas.addEventListener('dragover', e => { e.preventDefault(); canvas.classList.add('drag-over'); });
    canvas.addEventListener('dragleave', e => { if (!canvas.contains(e.relatedTarget)) canvas.classList.remove('drag-over'); });
    canvas.addEventListener('drop', e => {
      e.preventDefault(); canvas.classList.remove('drag-over');
      if (!_cbDrag) return;
      const targetNode = e.target.closest('.cnode[data-idx]');
      let to = targetNode ? +targetNode.dataset.idx : state.steps.length;
      if (_cbDrag.kind === 'block') {
        state.steps.splice(to, 0, campDefaultNode(_cbDrag.type));
      } else {
        const from = _cbDrag.idx;
        const [m] = state.steps.splice(from, 1);
        if (from < to) to--;
        state.steps.splice(Math.min(to, state.steps.length), 0, m);
      }
      _cbDrag = null;
      refresh();
    });

    ov.addEventListener('click', e => {
      if (e.target.closest('#campLaunch')) {
        const seg = SEGMENT_ROWS[state.segIdx];
        const ch = channelsUsed().join(', ');
        ov.querySelector('.modal').innerHTML = builderSuccess('Campaign launched',
          `Targeting ${fmt(seg.count)} customers in “${seg.name}” across ${ch}, with a ${state.steps.length}-step flow. weGAS Intelligence will monitor performance and surface optimisation alerts as it runs.`);
        wireSuccess(ov);
      }
    });

    refresh();
  }});
}

/* ---------- builder success view ---------- */
function builderSuccess(title, body) {
  return `<button class="modal-close" data-close-modal>${svg('x')}</button>
    <div style="text-align:center;padding:30px 10px 14px">
      <div style="width:64px;height:64px;border-radius:999px;margin:0 auto 22px;display:grid;place-items:center;background:rgba(123,255,95,0.12);border:1px solid rgba(123,255,95,0.34);color:var(--lime)">${svg('check')}</div>
      <h2 style="font-size:28px">${title}</h2>
      <p style="font-family:var(--mono);font-size:13px;line-height:1.7;color:#cfcfcf;max-width:46ch;margin:14px auto 0">${body}</p>
      <div style="display:flex;justify-content:center;margin-top:26px"><button class="pill pill-teal" data-close-modal style="padding:11px 26px;font-size:11px">Done</button></div>
    </div>`;
}
function wireSuccess(ov) {
  ov.querySelectorAll('[data-close-modal]').forEach(b => b.addEventListener('click', closeModal));
}
