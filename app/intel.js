/* ============================================================
   weGAS Intelligence — annotation boxes + modal system
   ============================================================ */

/* intelBox({variant, observation, implication, action, tag})
   variant: 'op' (opportunity) | 'alert'
   tag: { type:'impact'|'priority', value:'+R380k' | 'HIGH' }  (optional)        */
function intelBox(o) {
  const variant = o.variant === 'alert' ? 'alert' : 'op';
  let tagHtml = '';
  if (o.tag) {
    const t = o.tag;
    let cls = '', label = '';
    if (t.type === 'impact') { cls = 'impact'; label = 'EST. IMPACT: ' + t.value; }
    else { label = 'PRIORITY: ' + t.value; cls = (t.value === 'HIGH') ? 'hi' : ''; }
    tagHtml = `<span class="intel-tag ${cls}">${label}</span>`;
  }
  const impl = o.implication ? `<p class="intel-impl">${o.implication}</p>` : '';
  const action = o.action ? `<p class="intel-action"><span class="rec">Recommend</span>${o.action}</p>` : '';
  return `
    <div class="intel ${variant} ${o.compact ? 'compact' : ''}">
      <div class="intel-head">
        <span class="intel-badge">${svg('zap')} weGAS Intelligence</span>
        ${tagHtml}
      </div>
      <p class="intel-obs">${o.observation}</p>
      ${impl}
      ${action}
    </div>`;
}

/* light inline intel line */
function intelLine(text) {
  return `<div class="intel-line">${svg('zap')}<div>${text}</div></div>`;
}

/* ---- modal system ---- */
function openModal(innerHtml, opts = {}) {
  // remove any existing overlay immediately (avoid duplicate ids during close animation)
  const existing = document.getElementById('modalOverlay');
  if (existing) { document.removeEventListener('keydown', escClose); existing.remove(); }
  const ov = document.createElement('div');
  ov.className = 'modal-overlay';
  ov.id = 'modalOverlay';
  ov.innerHTML = `<div class="modal ${opts.wide ? 'wide' : ''}">
      <button class="modal-close" id="modalClose">${svg('x')}</button>
      ${innerHtml}
    </div>`;
  document.body.appendChild(ov);
  // close handlers
  ov.addEventListener('click', e => { if (e.target === ov) closeModal(); });
  ov.querySelector('#modalClose').addEventListener('click', closeModal);
  if (opts.onOpen) opts.onOpen(ov);
  requestAnimationFrame(() => ov.classList.add('show'));
  document.addEventListener('keydown', escClose);
  return ov;
}
function escClose(e) { if (e.key === 'Escape') closeModal(); }
function closeModal() {
  const ov = document.getElementById('modalOverlay');
  if (!ov) return;
  document.removeEventListener('keydown', escClose);
  ov.classList.remove('show');
  setTimeout(() => ov.remove(), 200);
}
