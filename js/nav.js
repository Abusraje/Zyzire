// ============================================
// ZYZIRE 0.0.3 — js/nav.js
// ============================================

const TABS = ['dashboard','tasks','habits','diary','media','bookshelf','gym','finance','goals','subscriptions','settings'];

function goTab(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const screen = document.getElementById('screen-' + id);
  const nav    = document.getElementById('nav-' + id);
  if (screen) screen.classList.add('active');
  if (nav)    nav.classList.add('active');
  const fn = window['render_' + id];
  if (fn) fn();
}

function ring(pct, size=56, color='#22c55e') {
  const r = (size-6)/2, circ = 2*Math.PI*r, offset = circ - (pct/100)*circ;
  return `<svg width="${size}" height="${size}" style="flex-shrink:0">
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#052e16" stroke-width="6"/>
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="6"
      stroke-linecap="round" stroke-dasharray="${circ.toFixed(1)}" stroke-dashoffset="${offset.toFixed(1)}"
      transform="rotate(-90 ${size/2} ${size/2})"/>
    <text x="${size/2}" y="${size/2+5}" text-anchor="middle" fill="${color}"
      style="font-size:${(size*0.2).toFixed(0)}px;font-family:'JetBrains Mono';font-weight:700">${pct}%</text>
  </svg>`;
}

function stars(rating, editable=false, onRate=null) {
  return Array.from({length:5},(_,i) => {
    const on = i < rating;
    const onclick = editable && onRate ? `onclick="${onRate}(${i+1})"` : '';
    return `<span class="star${on?' on':''}" ${onclick}>★</span>`;
  }).join('');
}

function rateColor(r) {
  return r >= 8 ? '#22c55e' : r >= 5 ? '#fbbf24' : '#f87171';
}

function openModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add('open'); activeModal = id; }
}

function closeModal(id) {
  const el = document.getElementById(id || activeModal);
  if (el) { el.classList.remove('open'); }
  activeModal = null;
}

function confirm(msg, fn) {
  if (window.confirm(msg)) fn();
}

function toast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = 'position:fixed;bottom:110px;left:50%;transform:translateX(-50%);background:#22c55e;color:#fff;padding:10px 20px;border-radius:10px;font-size:13px;font-weight:700;z-index:9999;opacity:0;transition:opacity .3s;pointer-events:none;font-family:Syne,sans-serif';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  setTimeout(() => { t.style.opacity = '0'; }, 2000);
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) closeModal();
  if (e.target.classList.contains('paywall-overlay')) closePaywall();
});

function buildWeekStrip() {
  const strip = document.getElementById('week-strip');
  if (!strip) return;
  strip.innerHTML = '';
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - today.getDay() + i);
    const isT = d.toDateString() === today.toDateString();
    strip.innerHTML += `<div style="flex-shrink:0;text-align:center;width:44px;border-radius:10px;padding:6px 4px;background:${isT?'var(--v)':'var(--card)'};border:1px solid ${isT?'var(--v)':'var(--border)'}">
      <div style="font-size:9px;font-weight:700;color:${isT?'#fff':'var(--muted)'};margin-bottom:2px">${DAYS[d.getDay()]}</div>
      <div style="font-size:15px;font-weight:800;color:${isT?'#fff':'var(--text)'}">${d.getDate()}</div>
    </div>`;
  }
}

// ---- SIDEBAR (tablet/desktop) ----
function updateSidebar(activeId) {
  const sb = document.getElementById('sidebar-nav');
  if (!sb) return;
  if (typeof buildSidebar === 'function') buildSidebar();
  document.querySelectorAll('.sb-item').forEach(el=>el.classList.remove('active'));
  const el = document.getElementById('sb-'+activeId);
  if (el) el.classList.add('active');
}

// Override goTab to update sidebar + right panel
const _baseGoTab = goTab;
function goTab(id) {
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const screen=document.getElementById('screen-'+id);
  const navEl=document.getElementById('nav-'+id);
  if (screen) screen.classList.add('active');
  if (navEl)  navEl.classList.add('active');
  const fn=window['render_'+id];
  if (fn) fn();
  // sidebar + right panel
  updateSidebar(id);
  if (typeof updateRightPanel==='function') updateRightPanel();
}

function render_layout() { if(typeof render_settings==='function') render_settings(); }
