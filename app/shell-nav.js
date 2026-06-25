/* ============================================================
   weGAS Intelligence — app-shell navigation
   • mobile: sidebar <-> slide-in drawer
   • brand wordmarks (sidebar + topbar) act as "home" in the demo
   • drawer closes on nav tap, brand tap, backdrop, Esc, resize

   The explicit "Back to weGAS" exit is a plain <a> in the HTML,
   so leaving the demo for the main site works even if JS fails.
   ============================================================ */
(function () {
  const app = document.querySelector('.app');
  if (!app) return;

  /* one dim backdrop, parked behind the drawer */
  let backdrop = app.querySelector('.nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    app.appendChild(backdrop);
  }

  /* inject a hamburger into every pre-rendered topbar (one per page) */
  const HAMBURGER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';
  document.querySelectorAll('.topbar').forEach(bar => {
    if (bar.querySelector('.nav-toggle')) return;
    const btn = document.createElement('button');
    btn.className = 'nav-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Open navigation');
    btn.innerHTML = HAMBURGER;
    bar.insertBefore(btn, bar.firstChild);
  });

  const closeNav = () => app.classList.remove('nav-open');

  document.addEventListener('click', e => {
    /* hamburger toggles the drawer */
    if (e.target.closest('.nav-toggle')) { app.classList.toggle('nav-open'); return; }
    /* tap outside (backdrop) closes it */
    if (e.target.closest('.nav-backdrop')) { closeNav(); return; }
    /* brand wordmark = home within the demo (the labeled exit leaves the site) */
    if (e.target.closest('.sidebar-logo, .topbar-logo')) {
      if (window.__goTo) window.__goTo('home');
      closeNav();
      return;
    }
    /* tapping a nav item navigates (app.js) then closes the drawer */
    if (e.target.closest('#navList [data-nav]')) { closeNav(); }
  });

  /* Esc closes the drawer */
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

  /* growing back to desktop width closes the drawer */
  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { if (window.innerWidth > 820) closeNav(); }, 150);
  });
})();
