/* ============================================================
   Chart.js configs — lazy-initialised when a panel becomes visible
   (Northwind e-commerce dashboard)
   ============================================================ */
const C = {
  magenta:'#EE3EC9', teal:'#54C4C8', lime:'#7BFF5F', coral:'#F06A5A',
  red:'#FF4D4D', amber:'#F5B73D', indigo:'#9aa0ff', white:'#FFFFFF',
  grey:'#8A8A8A', line:'rgba(255,255,255,0.08)',
};

function chartDefaults() {
  if (!window.Chart) return;
  Chart.defaults.font.family = "'Roboto Mono', monospace";
  Chart.defaults.font.size = 11;
  Chart.defaults.color = C.grey;
  Chart.defaults.plugins.legend.display = false;
  Chart.defaults.plugins.tooltip.backgroundColor = '#0A0A0A';
  Chart.defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,0.14)';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.titleColor = '#fff';
  Chart.defaults.plugins.tooltip.bodyColor = '#ddd';
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
  Chart.defaults.plugins.tooltip.titleFont = { family:"'Roboto Mono', monospace", size:11 };
  Chart.defaults.plugins.tooltip.bodyFont = { family:"'Roboto Mono', monospace", size:12 };
}

const axisX = { grid:{ display:false }, border:{ color:C.line }, ticks:{ color:C.grey, maxRotation:0, autoSkip:true } };
const axisY = { grid:{ color:C.line }, border:{ display:false }, ticks:{ color:C.grey } };

const legendBottom = { display:true, position:'bottom', labels:{ color:C.grey, boxWidth:10, boxHeight:10, padding:16, font:{ family:"'Roboto Mono', monospace", size:10 } } };

function gradient(el, h, color) {
  const ctx = el.getContext('2d');
  const g = ctx.createLinearGradient(0,0,0,h);
  g.addColorStop(0, color.replace('ALPHA','0.45'));
  g.addColorStop(1, color.replace('ALPHA','0.02'));
  return g;
}

/* inline plugins: end-point value label + dashed target line */
function endLabel(id, text, color) {
  return { id, afterDatasetsDraw(chart) {
    const pts = chart.getDatasetMeta(0).data; if (!pts || !pts.length) return;
    const last = pts[pts.length - 1]; const ctx = chart.ctx;
    ctx.save();
    ctx.beginPath(); ctx.arc(last.x, last.y, 3.5, 0, Math.PI*2); ctx.fillStyle = color; ctx.fill();
    ctx.font = "700 12px 'Roboto Mono', monospace"; ctx.fillStyle = color;
    ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
    ctx.fillText(text, last.x - 4, last.y - 9);
    ctx.restore();
  }};
}
function targetLine(id, value, label, color) {
  return { id, beforeDatasetsDraw(chart) {
    const sc = chart.scales.y; if (!sc) return;
    const y = sc.getPixelForValue(value); const a = chart.chartArea;
    if (y < a.top || y > a.bottom) return;
    const ctx = chart.ctx; ctx.save();
    ctx.setLineDash([5,5]); ctx.strokeStyle = color; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(a.left, y); ctx.lineTo(a.right, y); ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = "600 10px 'Roboto Mono', monospace"; ctx.fillStyle = color;
    ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
    ctx.fillText(label, a.left + 4, y - 4);
    ctx.restore();
  }};
}

const CHART_INIT = {
  /* ---- Executive View ---- */
  exRev: el => new Chart(el, {
    type:'line',
    data:{ labels:DATA.months, datasets:[{ data:DATA.exec.revSeries,
      borderColor:C.lime, borderWidth:2.5, backgroundColor:gradient(el,300,'rgba(123,255,95,ALPHA)'),
      fill:true, tension:0.4, pointRadius:0, pointHoverRadius:4, pointHoverBackgroundColor:C.lime }] },
    options:{ responsive:true, maintainAspectRatio:false, layout:{ padding:{ top:18, right:8 } },
      scales:{ x:axisX, y:{ ...axisY, beginAtZero:true, ticks:{ ...axisY.ticks, callback:v=>'R'+v+'M' } } },
      plugins:{ tooltip:{ callbacks:{ label:ctx=>'R'+ctx.parsed.y.toFixed(2)+'M revenue' } } } },
    plugins:[ targetLine('exRevTarget', 7, 'TARGET R7M', 'rgba(255,255,255,0.34)'), endLabel('exRevEnd', 'R6.84M', C.lime) ]
  }),
  exSplit: el => new Chart(el, {
    type:'doughnut',
    data:{ labels:['Returning','New'], datasets:[{ data:[66,34], backgroundColor:[C.teal,C.magenta], borderWidth:0, hoverOffset:4 }] },
    options:{ cutout:'68%', responsive:true, maintainAspectRatio:false,
      plugins:{ legend:legendBottom, tooltip:{ callbacks:{ label:ctx=>ctx.label+' '+ctx.parsed+'% of revenue' } } } }
  }),

  /* ---- Customer Growth ---- */
  cgNewReturn: el => new Chart(el, {
    type:'bar',
    data:{ labels:DATA.months, datasets:[
      { label:'New', data:DATA.growth.newSeries, backgroundColor:'rgba(238,62,201,0.55)', hoverBackgroundColor:C.magenta, borderRadius:4, stack:'s' },
      { label:'Returning', data:DATA.growth.returningSeries, backgroundColor:'rgba(84,196,200,0.55)', hoverBackgroundColor:C.teal, borderRadius:4, stack:'s' },
    ]},
    options:{ responsive:true, maintainAspectRatio:false,
      scales:{ x:{ ...axisX, stacked:true }, y:{ ...axisY, stacked:true, beginAtZero:true } },
      plugins:{ legend:legendBottom, tooltip:{ callbacks:{ label:ctx=>ctx.dataset.label+' '+fmt(ctx.parsed.y) } } } }
  }),

  /* ---- Churn ---- */
  chTrend: el => new Chart(el, {
    type:'line',
    data:{ labels:DATA.months, datasets:[{ data:DATA.churn.churnSeries,
      borderColor:C.red, borderWidth:2.5, backgroundColor:gradient(el,300,'rgba(255,77,77,ALPHA)'),
      fill:true, tension:0.4, pointRadius:0, pointHoverRadius:4, pointHoverBackgroundColor:C.red }] },
    options:{ responsive:true, maintainAspectRatio:false, layout:{ padding:{ top:18, right:8 } },
      scales:{ x:axisX, y:{ ...axisY, beginAtZero:true, ticks:{ ...axisY.ticks, callback:v=>v+'%' } } },
      plugins:{ tooltip:{ callbacks:{ label:ctx=>ctx.parsed.y+'% monthly churn' } } } },
    plugins:[ endLabel('chEnd', '4.8%', C.red) ]
  }),
  chReasons: el => new Chart(el, {
    type:'bar',
    data:{ labels:DATA.churn.reasons.map(r=>r[0]), datasets:[{ data:DATA.churn.reasons.map(r=>r[1]),
      backgroundColor:[C.red,C.amber,C.teal,C.indigo,C.grey], borderRadius:6, barThickness:22 }] },
    options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false,
      scales:{ y:{ ...axisX, ticks:{ color:'#ccc', font:{ size:10 } } }, x:{ ...axisY, beginAtZero:true, ticks:{ ...axisY.ticks, callback:v=>v+'%' } } },
      plugins:{ tooltip:{ callbacks:{ label:ctx=>ctx.parsed.x+'% of churned customers' } } } }
  }),

  /* ---- Abandoned Revenue ---- */
  abProducts: el => new Chart(el, {
    type:'bar',
    data:{ labels:DATA.abandoned.products.map(p=>p[0]), datasets:[{ data:DATA.abandoned.products.map(p=>p[2]),
      backgroundColor:'rgba(245,183,61,0.7)', hoverBackgroundColor:C.amber, borderRadius:6, barThickness:20 }] },
    options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false,
      scales:{ y:{ ...axisX, ticks:{ color:'#ccc', font:{ size:10 } } }, x:{ ...axisY, beginAtZero:true, ticks:{ ...axisY.ticks, callback:v=>'R'+(v/1000)+'k' } } },
      plugins:{ tooltip:{ callbacks:{ label:ctx=>zar(ctx.parsed.x)+' abandoned' } } } }
  }),
  abDrop: el => new Chart(el, {
    type:'doughnut',
    data:{ labels:DATA.abandoned.dropoff.map(d=>d[0]), datasets:[{ data:DATA.abandoned.dropoff.map(d=>d[1]),
      backgroundColor:[C.coral,C.amber,C.teal,C.indigo,C.grey], borderWidth:0, hoverOffset:4 }] },
    options:{ cutout:'66%', responsive:true, maintainAspectRatio:false,
      plugins:{ legend:legendBottom, tooltip:{ callbacks:{ label:ctx=>ctx.label+' '+ctx.parsed+'%' } } } }
  }),

  /* ---- Customer Value ---- */
  cvalTiers: el => new Chart(el, {
    type:'doughnut',
    data:{ labels:DATA.value.tiers.map(t=>t[0]), datasets:[{ data:DATA.value.tiers.map(t=>t[2]),
      backgroundColor:DATA.value.tiers.map(t=>t[3]), borderWidth:0, hoverOffset:4 }] },
    options:{ cutout:'68%', responsive:true, maintainAspectRatio:false,
      plugins:{ legend:legendBottom, tooltip:{ callbacks:{ label:ctx=>ctx.label+' · '+ctx.parsed+'% of revenue' } } } }
  }),
  cvalLtv: el => new Chart(el, {
    type:'bar',
    data:{ labels:DATA.value.ltvBands.map(b=>b[0]), datasets:[{ data:DATA.value.ltvBands.map(b=>b[1]),
      backgroundColor:DATA.value.ltvBands.map(b=>b[2]), borderRadius:6, barThickness:26 }] },
    options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false,
      scales:{ y:{ ...axisX, ticks:{ color:'#ccc', font:{ size:10 } } }, x:{ ...axisY, beginAtZero:true, ticks:{ ...axisY.ticks, callback:v=>fmt(v) } } },
      plugins:{ tooltip:{ callbacks:{ label:ctx=>fmt(ctx.parsed.x)+' customers' } } } }
  }),

  /* ---- Marketing ---- */
  mkChannel: el => new Chart(el, {
    type:'bar',
    data:{ labels:DATA.marketing.byChannel.map(c=>c[0]), datasets:[{ data:DATA.marketing.byChannel.map(c=>c[1]),
      backgroundColor:[C.magenta,C.teal,C.lime,C.indigo,C.amber], borderRadius:7, barThickness:30 }] },
    options:{ responsive:true, maintainAspectRatio:false,
      scales:{ x:axisX, y:{ ...axisY, beginAtZero:true, ticks:{ ...axisY.ticks, callback:v=>'R'+(v/1000000)+'M' } } },
      plugins:{ tooltip:{ callbacks:{ label:ctx=>zar(ctx.parsed.y)+' attributed' } } } }
  }),
  mkRoi: el => new Chart(el, {
    type:'bar',
    data:{ labels:DATA.marketing.campaigns.map(c=>c[0]), datasets:[{ data:DATA.marketing.campaigns.map(c=>parseFloat(c[5])),
      backgroundColor:[C.lime,C.magenta,C.teal,C.indigo,C.coral], borderRadius:6, barThickness:22 }] },
    options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false,
      scales:{ y:{ ...axisX, ticks:{ color:'#ccc', font:{ size:10 } } }, x:{ ...axisY, beginAtZero:true, ticks:{ ...axisY.ticks, callback:v=>v+'x' } } },
      plugins:{ tooltip:{ callbacks:{ label:ctx=>ctx.parsed.x+'x ROI' } } } }
  }),

  /* ---- Paid Media ---- */
  pmRoas: el => new Chart(el, {
    type:'line',
    data:{ labels:DATA.paid.roasMonths, datasets:[
      { label:'Google Ads', data:DATA.paid.roasSeries.google, borderColor:C.lime, borderWidth:2.5, tension:0.4, pointRadius:0, pointHoverRadius:4, fill:false },
      { label:'Meta Ads', data:DATA.paid.roasSeries.meta, borderColor:C.magenta, borderWidth:2.5, tension:0.4, pointRadius:0, pointHoverRadius:4, fill:false },
    ]},
    options:{ responsive:true, maintainAspectRatio:false,
      scales:{ x:axisX, y:{ ...axisY, beginAtZero:true, ticks:{ ...axisY.ticks, callback:v=>v+'x' } } },
      plugins:{ legend:legendBottom, tooltip:{ callbacks:{ label:ctx=>ctx.dataset.label+' '+ctx.parsed.y+'x ROAS' } } } }
  }),

  /* ---- Segmentation ---- */
  segFreq: el => new Chart(el, {
    type:'bar',
    data:{ labels:DATA.segTab.frequency.map(f=>f[0]), datasets:[{ data:DATA.segTab.frequency.map(f=>f[1]),
      backgroundColor:'rgba(84,196,200,0.65)', hoverBackgroundColor:C.teal, borderRadius:6, barThickness:34 }] },
    options:{ responsive:true, maintainAspectRatio:false,
      scales:{ x:axisX, y:{ ...axisY, beginAtZero:true, ticks:{ ...axisY.ticks, callback:v=>fmt(v) } } },
      plugins:{ tooltip:{ callbacks:{ label:ctx=>fmt(ctx.parsed.y)+' customers' } } } }
  }),
  segInterest: el => new Chart(el, {
    type:'doughnut',
    data:{ labels:DATA.segTab.interest.map(i=>i[0]), datasets:[{ data:DATA.segTab.interest.map(i=>i[1]),
      backgroundColor:[C.magenta,C.teal,C.lime,C.indigo,C.amber], borderWidth:0, hoverOffset:4 }] },
    options:{ cutout:'66%', responsive:true, maintainAspectRatio:false,
      plugins:{ legend:legendBottom, tooltip:{ callbacks:{ label:ctx=>ctx.label+' '+ctx.parsed+'%' } } } }
  }),

  /* ---- AMS profile ---- */
  amsEngage: el => new Chart(el, {
    type:'line',
    data:{ labels:DATA.months, datasets:[{ data:DATA.contact.engagement,
      borderColor:C.teal, borderWidth:2.5, backgroundColor:gradient(el,240,'rgba(84,196,200,ALPHA)'), fill:true, tension:0.42, pointRadius:0, pointHoverRadius:4, pointHoverBackgroundColor:C.teal }] },
    options:{ responsive:true, maintainAspectRatio:false,
      scales:{ x:axisX, y:{ ...axisY, beginAtZero:true } },
      plugins:{ tooltip:{ callbacks:{ label:ctx=>'score '+ctx.parsed.y } } } }
  }),
  amsSocial: el => new Chart(el, {
    type:'line',
    data:{ labels:['Jan 26','Feb','Mar','Apr','May','Jun'], datasets:[{ data:[62,150,112,78,116,140],
      borderColor:C.magenta, borderWidth:2.5, backgroundColor:gradient(el,240,'rgba(238,62,201,ALPHA)'), fill:true, tension:0.42, pointRadius:0, pointHoverRadius:4, pointHoverBackgroundColor:C.magenta }] },
    options:{ responsive:true, maintainAspectRatio:false,
      scales:{ x:axisX, y:{ ...axisY, beginAtZero:true } },
      plugins:{ tooltip:{ callbacks:{ label:ctx=>'engagement '+ctx.parsed.y } } } }
  }),
};

const _charts = {};
function initVisibleCharts() {
  if (!window.Chart) return;
  document.querySelectorAll('canvas[id]').forEach(el => {
    if (_charts[el.id]) return;
    if (!CHART_INIT[el.id]) return;
    if (el.offsetParent === null && el.getClientRects().length === 0) return;
    try { _charts[el.id] = CHART_INIT[el.id](el); } catch(e) { console.warn('chart', el.id, e); }
  });
}
